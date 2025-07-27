import sqlite3

def add_sample_data():
    conn = sqlite3.connect('store.db')
    c = conn.cursor()
    
    # Productos de ejemplo
    products = [
        ('Vestido Floral', 'Hermoso vestido con estampado floral', 'Vestidos', 99.90, 10, '/static/images/products/vestido-floral.jpg'),
        ('Blusa Elegante', 'Blusa elegante para ocasiones especiales', 'Blusas', 59.90, 15, '/static/images/products/blusa-elegante.jpg'),
        ('Pantalón Casual', 'Pantalón casual para el día a día', 'Pantalones', 79.90, 20, '/static/images/products/pantalon-casual.jpg'),
        ('Collar Dorado', 'Hermoso collar dorado', 'Accesorios', 29.90, 30, '/static/images/products/collar-dorado.jpg')
    ]
    
    # Agregar productos
    for product in products:
        try:
            c.execute('''
                INSERT INTO inventory (name, description, category, price, stock, image_url)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', product)
        except sqlite3.IntegrityError:
            print(f"El producto {product[0]} ya existe")
    
    # Agregar algunos productos a novedades
    try:
        c.execute("INSERT INTO novedades (product_id) VALUES (1)")
        c.execute("INSERT INTO novedades (product_id) VALUES (2)")
    except sqlite3.IntegrityError:
        print("Algunos productos ya están en novedades")
    
    # Imágenes del hero
    hero_images = [
        ('/static/images/hero/hero1.jpg', 'Nueva Colección', 'Descubre las últimas tendencias'),
        ('/static/images/hero/hero2.jpg', 'Ofertas Especiales', 'Hasta 50% de descuento'),
        ('/static/images/hero/hero3.jpg', 'Accesorios', 'Complementa tu estilo')
    ]
    
    # Agregar imágenes del hero
    for image in hero_images:
        try:
            c.execute('''
                INSERT INTO hero_images (image_url, title, subtitle)
                VALUES (?, ?, ?)
            ''', image)
        except sqlite3.IntegrityError:
            print(f"La imagen {image[0]} ya existe")
    
    conn.commit()
    conn.close()
    print("Datos de ejemplo agregados correctamente")

if __name__ == '__main__':
    add_sample_data()
