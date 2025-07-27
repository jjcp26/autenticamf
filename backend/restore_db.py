import sqlite3
import os

def create_database():
    # Conectar a la base de datos (la crea si no existe)
    conn = sqlite3.connect('store.db')
    c = conn.cursor()

    # Crear tablas
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL)''')

    c.execute('''CREATE TABLE IF NOT EXISTS inventory
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  description TEXT,
                  category TEXT,
                  price REAL,
                  stock INTEGER,
                  image_url TEXT)''')

    c.execute('''CREATE TABLE IF NOT EXISTS hero_images
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  image_url TEXT NOT NULL,
                  title TEXT,
                  subtitle TEXT,
                  active INTEGER DEFAULT 1)''')

    c.execute('''CREATE TABLE IF NOT EXISTS novedades
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  product_id INTEGER,
                  FOREIGN KEY(product_id) REFERENCES inventory(id))''')

    # Insertar datos iniciales
    # Usuario admin (contraseña: admin)
    c.execute("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)",
             ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'))

    # Imágenes del hero
    hero_images = [
        ('/static/images/hero/hero1.jpg', 'Nueva Colección', 'Descubre las últimas tendencias en moda femenina'),
        ('/static/images/hero/hero2.jpg', 'Elegancia y Estilo', 'Para cada ocasión especial')
    ]
    c.executemany("INSERT OR IGNORE INTO hero_images (image_url, title, subtitle) VALUES (?, ?, ?)", hero_images)

    # Productos iniciales
    products = [
        ('Vestido Floral', 'Hermoso vestido con estampado floral', 'Vestidos', 129.99, 10, '/static/images/products/vestido1.jpg'),
        ('Blusa Elegante', 'Blusa de seda con detalles elegantes', 'Blusas', 79.99, 15, '/static/images/products/blusa1.jpg'),
        ('Pantalón Casual', 'Pantalón cómodo para el día a día', 'Pantalones', 89.99, 8, '/static/images/products/pantalon1.jpg'),
        ('Falda Midi', 'Falda midi con diseño moderno', 'Faldas', 69.99, 12, '/static/images/products/falda1.jpg')
    ]
    c.executemany("INSERT OR IGNORE INTO inventory (name, description, category, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)", products)

    # Guardar cambios y cerrar conexión
    conn.commit()
    conn.close()

def create_directories():
    # Crear directorios para imágenes si no existen
    directories = [
        'static/images/hero',
        'static/images/products'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)

if __name__ == '__main__':
    create_directories()
    create_database()
    print("Base de datos y directorios restaurados exitosamente.")
