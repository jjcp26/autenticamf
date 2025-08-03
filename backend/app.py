# app.py

from flask import Flask, request, jsonify, session, render_template, redirect, url_for, flash
import sqlite3
import hashlib
from functools import wraps
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_cors import CORS # Importa Flask-CORS

app = Flask(__name__)
CORS(app, supports_credentials=True) # Habilita CORS y permite el envío de credenciales (cookies/sesiones)
app.secret_key = 'your_secure_random_secret_key_here' # ¡CAMBIA ESTO POR UNA CLAVE SECRETA SEGURA Y ALEATORIA!
app.config['TEMPLATES_AUTO_RELOAD'] = False
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000

# Función para obtener la conexión a la base de datos
def get_db():
    conn = sqlite3.connect('store.db')
    conn.row_factory = sqlite3.Row # Esto permite acceder a las filas como diccionarios
    return conn

# Decorador para proteger rutas que requieren inicio de sesión de administrador
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            # Si es una solicitud de API (desde React), devuelve JSON
            if request.accept_mimetypes.best == 'application/json':
                return jsonify({'message': 'No autorizado. Por favor, inicia sesión.'}), 401
            # Si es una solicitud de navegador, redirige a la página de login
            flash('Por favor, inicia sesión para acceder a esta página.', 'danger')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Rutas de Autenticación y Administración
@app.route('/admin/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.is_json:
            # Si la solicitud es JSON (desde React), obtenemos los datos
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
        else:
            # Si la solicitud es de un formulario, usamos request.form
            username = request.form.get('username')
            password = request.form.get('password')

        if not username or not password:
            if request.accept_mimetypes.best == 'application/json':
                return jsonify({'success': False, 'message': 'Usuario y contraseña son requeridos.'}), 400
            flash('Usuario y contraseña son requeridos.', 'danger')
            return render_template('admin/login.html')

        # La contraseña se hashea con SHA256 para comparación
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        db = get_db()
        user = db.execute('SELECT * FROM users WHERE username = ? AND password = ?',
                         (username, hashed_password)).fetchone()
        db.close()

        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            if request.accept_mimetypes.best == 'application/json':
                return jsonify({'success': True, 'message': 'Inicio de sesión exitoso.', 'user': {'username': user['username']}})
            flash('Inicio de sesión exitoso.', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            if request.accept_mimetypes.best == 'application/json':
                return jsonify({'success': False, 'message': 'Nombre de usuario o contraseña incorrectos.'}), 401
            flash('Nombre de usuario o contraseña incorrectos.', 'danger')
    return render_template('admin/login.html') # Asume que tienes un template para el login de admin

@app.route('/admin/logout', methods=['POST']) # Cambiado a POST para API
@login_required
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    if request.accept_mimetypes.best == 'application/json':
        return jsonify({'success': True, 'message': 'Has cerrado sesión exitosamente.'})
    flash('Has cerrado sesión exitosamente.', 'info')
    return redirect(url_for('login'))

# Rutas API para la gestión de productos (Inventario)
@app.route('/api/admin/products', methods=['GET'])
@login_required
def admin_get_products():
    db = get_db()
    products = db.execute('SELECT * FROM inventory').fetchall()
    db.close()
    products_list = [dict(row) for row in products]
    return jsonify(products_list)

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

    db = get_db()
    try:
        db.execute('INSERT INTO inventory (name, description, category, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                   (name, description, category, price, stock, image_url))
        db.commit()
        return jsonify({'success': True, 'message': 'Producto añadido exitosamente.', 'id': db.cursor().lastrowid}), 201
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al añadir producto: {str(e)}'}), 500
    finally:
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

    db = get_db()
    try:
        db.execute('UPDATE inventory SET name = ?, description = ?, category = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
                   (name, description, category, price, stock, image_url, product_id))
        db.commit()
        if db.cursor().rowcount == 0:
            return jsonify({'success': False, 'message': 'Producto no encontrado.'}), 404
        return jsonify({'success': True, 'message': 'Producto actualizado exitosamente.'})
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al actualizar producto: {str(e)}'}), 500
    finally:
        db.close()

@app.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
@login_required
def admin_delete_product(product_id):
    db = get_db()
    try:
        db.execute('DELETE FROM inventory WHERE id = ?', (product_id,))
        db.commit()
        if db.cursor().rowcount == 0:
            return jsonify({'success': False, 'message': 'Producto no encontrado.'}), 404
        return jsonify({'success': True, 'message': 'Producto eliminado exitosamente.'})
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al eliminar producto: {str(e)}'}), 500
    finally:
        db.close()

# Rutas API para la gestión de imágenes del Hero
@app.route('/api/admin/hero_images', methods=['GET'])
@login_required
def admin_get_hero_images():
    db = get_db()
    images = db.execute('SELECT * FROM hero_images').fetchall()
    db.close()
    images_list = [dict(row) for row in images]
    return jsonify(images_list)

@app.route('/api/admin/hero_images', methods=['POST'])
@login_required
def admin_add_hero_image():
    # Asegúrate de que la solicitud sea JSON para el frontend de React
    data = request.get_json()
    image_url = data.get('image_url')
    title = data.get('title', '')
    subtitle = data.get('subtitle', '')
    active = int(data.get('active', 1))

    if not image_url:
        return jsonify({'success': False, 'message': 'La URL de la imagen es requerida.'}), 400

    db = get_db()
    try:
        db.execute('INSERT INTO hero_images (image_url, title, subtitle, active) VALUES (?, ?, ?, ?)',
                   (image_url, title, subtitle, active))
        db.commit()
        return jsonify({'success': True, 'message': 'Imagen del Hero añadida exitosamente.', 'id': db.cursor().lastrowid}), 201
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al añadir imagen del Hero: {str(e)}'}), 500
    finally:
        db.close()

@app.route('/api/admin/hero_images/<int:image_id>/toggle', methods=['PUT'])
@login_required
def admin_toggle_hero_image(image_id):
    db = get_db()
    try:
        image = db.execute('SELECT active FROM hero_images WHERE id = ?', (image_id,)).fetchone()
        if not image:
            return jsonify({'success': False, 'message': 'Imagen del Hero no encontrada.'}), 404
        new_status = 1 if image['active'] == 0 else 0
        db.execute('UPDATE hero_images SET active = ? WHERE id = ?', (new_status, image_id))
        db.commit()
        return jsonify({'success': True, 'message': f'Estado de la imagen del Hero cambiado a {"activo" if new_status else "inactivo"}.', 'new_status': new_status})
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al cambiar estado de imagen del Hero: {str(e)}'}), 500
    finally:
        db.close()

@app.route('/api/admin/hero_images/<int:image_id>', methods=['DELETE'])
@login_required
def admin_delete_hero_image(image_id):
    db = get_db()
    try:
        db.execute('DELETE FROM hero_images WHERE id = ?', (image_id,))
        db.commit()
        if db.cursor().rowcount == 0:
            return jsonify({'success': False, 'message': 'Imagen del Hero no encontrada.'}), 404
        return jsonify({'success': True, 'message': 'Imagen del Hero eliminada exitosamente.'})
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al eliminar imagen del Hero: {str(e)}'}), 500
    finally:
        db.close()

# Rutas API para la gestión de Novedades
@app.route('/api/admin/novedades', methods=['GET'])
@login_required
def admin_get_novedades():
    db = get_db()
    novedades_products = db.execute('''
        SELECT i.* FROM inventory i
        JOIN novedades n ON i.id = n.product_id
    ''').fetchall()
    db.close()
    novedades_list = [dict(row) for row in novedades_products]
    return jsonify(novedades_list)

@app.route('/api/admin/novedades', methods=['POST'])
@login_required
def admin_add_novedad():
    data = request.get_json()
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({'success': False, 'message': 'ID de producto es requerido.'}), 400

    db = get_db()
    try:
        db.execute('INSERT INTO novedades (product_id) VALUES (?)', (product_id,))
        db.commit()
        return jsonify({'success': True, 'message': 'Producto añadido a Novedades.'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Este producto ya está en Novedades.'}), 409 # Conflict
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al añadir a Novedades: {str(e)}'}), 500
    finally:
        db.close()

@app.route('/api/admin/novedades/<int:product_id>', methods=['DELETE'])
@login_required
def admin_remove_novedad(product_id):
    db = get_db()
    try:
        db.execute('DELETE FROM novedades WHERE product_id = ?', (product_id,))
        db.commit()
        if db.cursor().rowcount == 0:
            return jsonify({'success': False, 'message': 'Producto no encontrado en Novedades.'}), 404
        return jsonify({'success': True, 'message': 'Producto eliminado de Novedades.'})
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Error al eliminar de Novedades: {str(e)}'}), 500
    finally:
        db.close()

# Rutas API para el Frontend React (públicas, sin login_required)
@app.route('/api/products', methods=['GET'])
def get_products():
    """
    API para obtener todos los productos del inventario (público).
    """
    db = get_db()
    products = db.execute('SELECT * FROM inventory').fetchall()
    db.close()
    products_list = [dict(row) for row in products]
    return jsonify(products_list)

@app.route('/api/novedades', methods=['GET'])
def get_novedades():
    """
    API para obtener productos marcados como novedades (público).
    """
    db = get_db()
    novedades = db.execute('SELECT i.* FROM inventory i JOIN novedades n ON i.id = n.product_id').fetchall()
    db.close()
    novedades_list = [dict(row) for row in novedades]
    return jsonify(novedades_list)

@app.route('/api/hero_images', methods=['GET'])
def get_hero_images_api():
    """
    API para obtener las imágenes activas del carrusel Hero (público).
    """
    db = get_db()
    images = db.execute('SELECT image_url, title, subtitle FROM hero_images WHERE active = 1').fetchall()
    db.close()
    images_list = [dict(row) for row in images]
    return jsonify(images_list)

@app.route('/api/enviar-mensaje', methods=['POST'])
def api_enviar_mensaje():
    """
    API para enviar mensajes desde el formulario de contacto (público).
    Espera datos JSON y envía un correo electrónico.
    """
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
        print(f"Error al enviar correo: {e}")
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

