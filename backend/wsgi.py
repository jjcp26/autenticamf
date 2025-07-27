# backend/wsgi.py

import sys
import os

# Asegúrate de que la ruta a tu proyecto esté en el path de Python
# Reemplaza 'your-username' con tu nombre de usuario de PythonAnywhere
# y 'autentica-ecommerce' con el nombre de la carpeta raíz de tu proyecto en PythonAnywhere
# (que será el nombre de tu repositorio de GitHub)
project_home = '/home/jjcp26/autenticamf/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Importa tu aplicación Flask desde app.py
from app import app as application  # 'application' es el nombre que PythonAnywhere busca
