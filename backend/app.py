# app.py

from flask import Flask, request, jsonify, session, render_template, redirect, url_for, flash
import sqlite3
import hashlib
from functools import wraps
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_cors import CORS

app = Flask(__name__)
# Habilita CORS y permite el envío de credenciales (cookies/sesiones)
CORS(app, supports_credentials=True)
# ¡CAMBIA ESTO POR UNA CLAVE SECRETA SEGURA Y ALEATORIA!
app.secret_key = 'your_secure_random_secret_key_here'
app.config['TEMPLATES_AUTO_RELOAD'] = False
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000

# Función para obtener la conexión a la base de datos
def get_db():
    # Depuración: verificar si el archivo de la base de datos existe
    db_path = 'store.db'
    if not os.path.exists(db_path):
        print(f"ERROR: El archivo de la base de datos '{db_path}' no se encontró.")
        raise FileNotFoundError(f"Database file not found at {db_path}")

    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        print(f"DEBUG: Conexión a la base de datos '{db_path}' exitosa.")
        return conn
    except sqlite3.Error as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        raise # Vuelve a lanzar la excepción para que Flask la capture

# Decorador para proteger rutas que requieren inicio de sesión de administrador
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print(f"DEBUG: Verificando login_required para user_id: {session.get('user_id')}")
        if 'user_id' not in session:
            print("DEBUG: Solicitud de API no autorizada.")
            return jsonify({'message': 'No autorizado. Por favor, inicia sesión.'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Rutas de Autenticación para API (solo JSON)
@app.route('/admin/login', methods=['POST']) # Solo POST para API login
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    print(f"DEBUG: Intento de login para usuario: {username}")

    if not username or not password:
        print("DEBUG: Usuario o contraseña faltantes.")
        return jsonify({'success': False, 'message': 'Usuario y contraseña son requeridos.'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    print(f"DEBUG: Contraseña hasheada: {hashed_password}")

    db = None
    try:
        db = get_db()
        user = db.execute('SELECT * FROM users WHERE username = ? AND password = ?',
                         (username, hashed_password)).fetchone()
        print(f"DEBUG: Resultado de la consulta de usuario: {user}")

        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            print(f"DEBUG: Login exitoso para {username}. ID de sesión: {session['user_id']}")
            return jsonify({'success': True, 'message': 'Inicio de sesión exitoso.', 'user': {'username': user['username']}})
        else:
            print(f"DEBUG: Intento de login fallido: credenciales incorrectas para {username}")
            return jsonify({'success': False, 'message': 'Nombre de usuario o contraseña incorrectos.'}), 401
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error de base de datos: {str(e)}'}), 500
    except sqlite3.Error as e:
        print(f"ERROR: Error de SQLite durante el login: {e}")
        return jsonify({'success': False, 'message': f'Error de base de datos: {str(e)}'}), 500
    except Exception as e:
        print(f"ERROR: Error inesperado durante el login: {e}")
        return jsonify({'success': False, 'message': f'Error interno del servidor: {str(e)}'}), 500
    finally:
        if db:
            db.close()
            print("DEBUG: Conexión a DB cerrada.")

@app.route('/admin/logout', methods=['POST'])
@login_required
def logout():
    print(f"DEBUG: Cerrando sesión para user_id: {session.get('user_id')}")
    session.pop('user_id', None)
    session.pop('username', None)
    return jsonify({'success': True, 'message': 'Has cerrado sesión exitosamente.'})

# --- Rutas API para la gestión de productos (Inventario) ---
@app.route('/api/admin/products', methods=['GET'])
@login_required
def admin_get_products():
    db = None
    try:
        db = get_db()
        products = db.execute('SELECT * FROM inventory').fetchall()
        products_list = [dict(row) for row in products]
        print(f"DEBUG: Devolviendo {len(products_list)} productos para admin.")
        return jsonify(products_list)
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al obtener productos: {str(e)}'}), 500
    except Exception as e:
        print(f"ERROR: Error en admin_get_products: {e}")
        return jsonify({'success': False, 'message': f'Error al obtener productos: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/admin/products', methods=['POST'])
@login_required
def admin_add_product():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    category = data.get('category')
    price = float(data.get('price'))
    stock = int(data.get('stock'))
    image_url = data.get('image_url')

    if not all([name, price, stock, image_url]):
        return jsonify({'success': False, 'message': 'Faltan campos requeridos.'}), 400

    db = None
    try:
        db = get_db()
        db.execute('INSERT INTO inventory (name, description, category, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                   (name, description, category, price, stock, image_url))
        db.commit()
        return jsonify({'success': True, 'message': 'Producto añadido exitosamente.', 'id': db.cursor().lastrowid}), 201
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al añadir producto: {str(e)}'}), 500
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al añadir producto: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/admin/products/<int:product_id>', methods=['PUT'])
@login_required
def admin_edit_product(product_id):
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    category = data.get('category')
    price = float(data.get('price'))
    stock = int(data.get('stock'))
    image_url = data.get('image_url')

    if not all([name, price, stock, image_url]):
        return jsonify({'success': False, 'message': 'Faltan campos requeridos.'}), 400

    db = None
    try:
        db = get_db()
        db.execute('UPDATE inventory SET name = ?, description = ?, category = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
                   (name, description, category, price, stock, image_url, product_id))
        db.commit()
        if db.cursor().rowcount == 0:
            return jsonify({'success': False, 'message': 'Producto no encontrado.'}), 404
        return jsonify({'success': True, 'message': 'Producto actualizado exitosamente.'})
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al actualizar producto: {str(e)}'}), 500
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al actualizar producto: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
@login_required
def admin_delete_product(product_id):
    db = None
    try:
        db = get_db()
        db.execute('DELETE FROM inventory WHERE id = ?', (product_id,))
        db.commit()
        if db.cursor().rowcount == 0:
            return jsonify({'success': False, 'message': 'Producto no encontrado.'}), 404
        return jsonify({'success': True, 'message': 'Producto eliminado exitosamente.'})
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al eliminar producto: {str(e)}'}), 500
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al eliminar producto: {str(e)}'}), 500
    finally:
        if db:
            db.close()

# --- Rutas API para la gestión de imágenes del Hero ---
@app.route('/api/admin/hero_images', methods=['GET'])
@login_required
def admin_get_hero_images():
    db = None
    try:
        db = get_db()
        images = db.execute('SELECT * FROM hero_images').fetchall()
        images_list = [dict(row) for row in images]
        return jsonify(images_list)
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al obtener imágenes del Hero: {str(e)}'}), 500
    except Exception as e:
        print(f"ERROR: Error en admin_get_hero_images: {e}")
        return jsonify({'success': False, 'message': f'Error al obtener imágenes del Hero: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/admin/hero_images', methods=['POST'])
@login_required
def admin_add_hero_image():
    data = request.get_json()
    image_url = data.get('image_url')
    title = data.get('title', '')
    subtitle = data.get('subtitle', '')
    active = int(data.get('active', 1))

    if not image_url:
        return jsonify({'success': False, 'message': 'La URL de la imagen es requerida.'}), 400

    db = None
    try:
        db = get_db()
        db.execute('INSERT INTO hero_images (image_url, title, subtitle, active) VALUES (?, ?, ?, ?)',
                   (image_url, title, subtitle, active))
        db.commit()
        return jsonify({'success': True, 'message': 'Imagen del Hero añadida exitosamente.', 'id': db.cursor().lastrowid}), 201
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al añadir imagen del Hero: {str(e)}'}), 500
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al añadir imagen del Hero: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/admin/hero_images/<int:image_id>/toggle', methods=['PUT'])
@login_required
def admin_toggle_hero_image(image_id):
    db = None
    try:
        db = get_db()
        image = db.execute('SELECT active FROM hero_images WHERE id = ?', (image_id,)).fetchone()
        if not image:
            return jsonify({'success': False, 'message': 'Imagen del Hero no encontrada.'}), 404
        new_status = 1 if image['active'] == 0 else 0
        db.execute('UPDATE hero_images SET active = ? WHERE id = ?', (new_status, image_id))
        db.commit()
        return jsonify({'success': True, 'message': f'Estado de la imagen del Hero cambiado a {"activo" if new_status else "inactivo"}.', 'new_status': new_status})
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al cambiar estado de imagen del Hero: {str(e)}'}), 500
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al cambiar estado de imagen del Hero: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/admin/hero_images/<int:image_id>', methods=['DELETE'])
@login_required
def admin_delete_hero_image(image_id):
    db = None
    try:
        db = get_db()
        db.execute('DELETE FROM hero_images WHERE id = ?', (image_id,))
        db.commit()
        if db.cursor().rowcount == 0:
            return jsonify({'success': False, 'message': 'Imagen del Hero no encontrada.'}), 404
        return jsonify({'success': True, 'message': 'Imagen del Hero eliminada exitosamente.'})
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al eliminar imagen del Hero: {str(e)}'}), 500
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al eliminar imagen del Hero: {str(e)}'}), 500
    finally:
        if db:
            db.close()

# --- Rutas API para la gestión de Novedades ---
@app.route('/api/admin/novedades', methods=['GET'])
@login_required
def admin_get_novedades():
    db = None
    try:
        db = get_db()
        novedades_products = db.execute('''
            SELECT i.* FROM inventory i
            JOIN novedades n ON i.id = n.product_id
        ''').fetchall()
        novedades_list = [dict(row) for row in novedades_products]
        return jsonify(novedades_list)
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al obtener novedades: {str(e)}'}), 500
    except Exception as e:
        print(f"ERROR: Error en admin_get_novedades: {e}")
        return jsonify({'success': False, 'message': f'Error al obtener novedades: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/admin/novedades', methods=['POST'])
@login_required
def admin_add_novedad():
    data = request.get_json()
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({'success': False, 'message': 'ID de producto es requerido.'}), 400

    db = None
    try:
        db = get_db()
        db.execute('INSERT INTO novedades (product_id) VALUES (?)', (product_id,))
        db.commit()
        return jsonify({'success': True, 'message': 'Producto añadido a Novedades.'}), 201
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al añadir a Novedades: {str(e)}'}), 500
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Este producto ya está en Novedades.'}), 409 # Conflict
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al añadir a Novedades: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/admin/novedades/<int:product_id>', methods=['DELETE'])
@login_required
def admin_remove_novedad(product_id):
    db = None
    try:
        db = get_db()
        db.execute('DELETE FROM novedades WHERE product_id = ?', (product_id,))
        db.commit()
        if db.cursor().rowcount == 0:
            return jsonify({'success': False, 'message': 'Producto no encontrado en Novedades.'}), 404
        return jsonify({'success': True, 'message': 'Producto eliminado de Novedades.'})
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al eliminar de Novedades: {str(e)}'}), 500
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al eliminar de Novedades: {str(e)}'}), 500
    finally:
        if db:
            db.close()

# --- Rutas API para el Frontend React (públicas, sin login_required) ---
@app.route('/api/products', methods=['GET'])
def get_products():
    db = None
    try:
        db = get_db()
        products = db.execute('SELECT * FROM inventory').fetchall()
        products_list = [dict(row) for row in products]
        return jsonify(products_list)
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al obtener productos: {str(e)}'}), 500
    except Exception as e:
        print(f"ERROR: Error en get_products (pública): {e}")
        return jsonify({'success': False, 'message': f'Error al obtener productos: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/novedades', methods=['GET'])
def get_novedades():
    db = None
    try:
        db = get_db()
        novedades = db.execute('SELECT i.* FROM inventory i JOIN novedades n ON i.id = n.product_id').fetchall()
        novedades_list = [dict(row) for row in novedades]
        return jsonify(novedades_list)
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al obtener novedades: {str(e)}'}), 500
    except Exception as e:
        print(f"ERROR: Error en get_novedades (pública): {e}")
        return jsonify({'success': False, 'message': f'Error al obtener novedades: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/hero_images', methods=['GET'])
def get_hero_images_api():
    db = None
    try:
        db = get_db()
        images = db.execute('SELECT image_url, title, subtitle FROM hero_images WHERE active = 1').fetchall()
        images_list = [dict(row) for row in images]
        return jsonify(images_list)
    except FileNotFoundError as e:
        print(f"ERROR: No se pudo conectar a la base de datos: {e}")
        return jsonify({'success': False, 'message': f'Error al obtener imágenes del Hero: {str(e)}'}), 500
    except Exception as e:
        print(f"ERROR: Error en get_hero_images_api (pública): {e}")
        return jsonify({'success': False, 'message': f'Error al obtener imágenes del Hero: {str(e)}'}), 500
    finally:
        if db:
            db.close()

@app.route('/api/enviar-mensaje', methods=['POST'])
def api_enviar_mensaje():
    if not request.is_json:
        return jsonify({"success": False, "message": "Content-Type must be application/json"}), 400

    data = request.get_json()
    nombre = data.get('name')
    correo = data.get('email')
    mensaje = data.get('message')

    if not nombre or not correo or not mensaje:
        return jsonify({"success": False, "message": "Faltan campos requeridos (nombre, email, mensaje)."}), 400

    # Configuración de SMTP (¡REEMPLAZA ESTOS VALORES CON TUS PROPIOS DATOS!)
    smtp_host = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = 'your_email@gmail.com' # <--- CAMBIA ESTO
    smtp_pass = 'your_app_password' # <--- CAMBIA ESTO (usa una contraseña de aplicación si usas Gmail)
    destinatario = 'your_receiving_email@example.com' # <--- CAMBIA ESTO

    asunto = f'Nuevo mensaje de contacto de {nombre} (Autentica)'
    cuerpo = f'Nombre: {nombre}\nEmail: {correo}\nMensaje:\n{mensaje}'

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = destinatario
    msg['Subject'] = asunto
    msg.attach(MIMEText(cuerpo, 'plain'))

    try:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, destinatario, msg.as_string())
        server.quit()
        return jsonify({'success': True, 'message': 'Mensaje enviado, te contactaremos pronto'})
    except Exception as e:
        print(f"ERROR: Error al enviar correo: {e}")
        return jsonify({'success': False, 'message': f'Error al enviar mensaje: {str(e)}'}), 500

# Ruta para servir archivos estáticos (imágenes, CSS, JS)
@app.route('/static/<path:filename>')
def static_files(filename):
    return app.send_static_file(filename)

# Ruta principal (puede ser un placeholder si React maneja todo el frontend)
@app.route('/')
def index():
    return "Backend de Autentica funcionando. El frontend React se sirve por separado."


if __name__ == '__main__':
    app.run(debug=True, port=5000)
