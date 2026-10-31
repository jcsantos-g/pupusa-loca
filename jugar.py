"""Abre ¡Volteala! en el navegador usando un servidor local.

Uso:  python jugar.py
El juego también se puede abrir con doble clic en index.html; este script
sirve la carpeta como lo haría una página web real (así lo probé al final).
"""
import functools
import http.server
import os
import socketserver
import threading
import webbrowser

CARPETA = os.path.dirname(os.path.abspath(__file__))
Manejador = functools.partial(http.server.SimpleHTTPRequestHandler, directory=CARPETA)


def abrir_servidor(puerto_inicial=8000, intentos=10):
    # si el puerto está ocupado, prueba con los siguientes
    for puerto in range(puerto_inicial, puerto_inicial + intentos):
        try:
            return socketserver.TCPServer(("127.0.0.1", puerto), Manejador), puerto
        except OSError:
            continue
    raise SystemExit("No encontré un puerto libre entre 8000 y 8009.")


if __name__ == "__main__":
    servidor, puerto = abrir_servidor()
    url = f"http://127.0.0.1:{puerto}/index.html"
    print(f"¡Volteala! está en {url}  (Ctrl+C para cerrar)")
    threading.Timer(0.5, webbrowser.open, args=[url]).start()
    with servidor:
        try:
            servidor.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor cerrado.")
