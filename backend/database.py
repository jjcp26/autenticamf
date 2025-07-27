import sqlite3
import hashlib

def init_db():
    conn = sqlite3.connect('store.db')
    c = conn.cursor()
    
    # Create users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL)''')
    
    # Create inventory table
    c.execute('''CREATE TABLE IF NOT EXISTS inventory
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  description TEXT,
                  category TEXT,
                  price REAL,
                  stock INTEGER,
                  image_url TEXT)''')
    
    # Create novedades table
    c.execute('''CREATE TABLE IF NOT EXISTS novedades
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  product_id INTEGER,
                  FOREIGN KEY (product_id) REFERENCES inventory(id))''')
    
    # Create hero_images table
    c.execute('''CREATE TABLE IF NOT EXISTS hero_images
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  image_url TEXT NOT NULL,
                  title TEXT,
                  subtitle TEXT,
                  active INTEGER DEFAULT 1)''')
    
    # Add default admin user if not exists
    admin_password = hashlib.sha256("admin".encode()).hexdigest()
    try:
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", 
                 ("admin", admin_password))
    except sqlite3.IntegrityError:
        pass  # Admin user already exists
    
    conn.commit()
    conn.close()

def add_to_novedades(product_id):
    conn = sqlite3.connect('store.db')
    c = conn.cursor()
    try:
        c.execute("INSERT INTO novedades (product_id) VALUES (?)", (product_id,))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al agregar producto a novedades: {e}")
    finally:
        conn.close()

def remove_from_novedades(product_id):
    conn = sqlite3.connect('store.db')
    c = conn.cursor()
    try:
        c.execute("DELETE FROM novedades WHERE product_id = ?", (product_id,))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al eliminar producto de novedades: {e}")
    finally:
        conn.close()

def get_novedades():
    conn = sqlite3.connect('store.db')
    c = conn.cursor()
    try:
        c.execute("""
            SELECT i.* FROM inventory i
            INNER JOIN novedades n ON i.id = n.product_id
        """)
        novedades = c.fetchall()
        return novedades
    except sqlite3.Error as e:
        print(f"Error al obtener novedades: {e}")
        return []
    finally:
        conn.close()

def is_product_in_novedades(product_id):
    conn = sqlite3.connect('store.db')
    c = conn.cursor()
    try:
        c.execute("SELECT 1 FROM novedades WHERE product_id = ?", (product_id,))
        return c.fetchone() is not None
    except sqlite3.Error as e:
        print(f"Error al verificar producto en novedades: {e}")
        return False
    finally:
        conn.close()

def add_hero_image(image_url, title="", subtitle=""):
    conn = sqlite3.connect('store.db')
    c = conn.cursor()
    try:
        c.execute("""
            INSERT INTO hero_images (image_url, title, subtitle)
            VALUES (?, ?, ?)
        """, (image_url, title, subtitle))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al agregar imagen hero: {e}")
    finally:
        conn.close()

def remove_hero_image(image_id):
    conn = sqlite3.connect('store.db')
    c = conn.cursor()
    try:
        c.execute("DELETE FROM hero_images WHERE id = ?", (image_id,))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al eliminar imagen hero: {e}")
    finally:
        conn.close()

def get_hero_images():
    conn = sqlite3.connect('store.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    try:
        c.execute("SELECT * FROM hero_images WHERE active = 1")
        images = c.fetchall()
        return images
    except sqlite3.Error as e:
        print(f"Error al obtener imágenes hero: {e}")
        return []
    finally:
        conn.close()

def toggle_hero_image(image_id, active):
    conn = sqlite3.connect('store.db')
    c = conn.cursor()
    try:
        c.execute("UPDATE hero_images SET active = ? WHERE id = ?", (active, image_id))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al actualizar estado de imagen hero: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
