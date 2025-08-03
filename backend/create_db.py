import sqlite3
import hashlib

def create_database():
    """Crea la base de datos y todas las tablas necesarias."""
    conn = sqlite3.connect('store.db')
    cursor = conn.cursor()

    # Eliminar tablas si existen (útil para pruebas)
    cursor.execute("DROP TABLE IF EXISTS users")
    cursor.execute("DROP TABLE IF EXISTS inventory")
    cursor.execute("DROP TABLE IF EXISTS hero_images")
    cursor.execute("DROP TABLE IF EXISTS novedades")

    # Tabla de Usuarios (para el admin)
    cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')

    # Tabla de Productos (inventario)
    cursor.execute('''
        CREATE TABLE inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT,
            price REAL NOT NULL,
            stock INTEGER NOT NULL,
            image_url TEXT
        )
    ''')

    # Tabla de Imágenes del Carrusel (hero)
    cursor.execute('''
        CREATE TABLE hero_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT NOT NULL,
            title TEXT,
            subtitle TEXT,
            active INTEGER DEFAULT 1
        )
    ''')
    
    # Tabla de Novedades
    cursor.execute('''
        CREATE TABLE novedades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL UNIQUE,
            FOREIGN KEY(product_id) REFERENCES inventory(id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    print("¡Base de datos y tablas creadas exitosamente!")

    # Insertar un usuario admin de ejemplo
    print("Creando usuario admin...")
    admin_username = 'admin'
    admin_password = 'admin'
    hashed_password = hashlib.sha256(admin_password.encode()).hexdigest()
    
    cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (admin_username, hashed_password))
    conn.commit()
    print(f"Usuario 'admin' creado con contraseña 'admin'.")

    conn.close()

if __name__ == '__main__':
    create_database()
