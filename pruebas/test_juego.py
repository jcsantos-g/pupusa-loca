"""Pruebas automáticas de ¡Volteala!

No abren el juego: leen index.html, css/ y js/ y revisan que las reglas tengan sentido.
Uso (desde la carpeta del proyecto):  python -m unittest discover -s pruebas -v
"""
import re
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
HTML = (RAIZ / "index.html").read_text(encoding="utf-8")
CSS = (RAIZ / "css" / "estilos.css").read_text(encoding="utf-8")
SCRIPTS = re.findall(r'<script src="([^"]+)"></script>', HTML)
CODIGO = "\n".join((RAIZ / s).read_text(encoding="utf-8") for s in SCRIPTS if (RAIZ / s).exists())


# Copia en Python de las fórmulas de dificultad de js/config.js.
# test_formulas_iguales_al_juego avisa si alguien cambia una y no la otra.
def coccion(nivel):
    tabla = [2.6, 2.5, 2.4, 2.2]
    base = tabla[nivel - 1] if nivel <= 4 else 2.2 * 0.93 ** (nivel - 4)
    return max(1.2, base)


def puestos(nivel):
    return 4 if nivel >= 3 else 3 if nivel == 2 else 2


GREEN_RATE = 0.55


def zonas():
    m = re.search(
        r"Z_GOOD = ([\d.]+), Z_PERF = ([\d.]+), Z_PERF_END = ([\d.]+), Z_DONE = ([\d.]+), Z_BURN = ([\d.]+)",
        CODIGO,
    )
    return [float(x) for x in m.groups()]


class ReglasDelJuego(unittest.TestCase):
    def test_zonas_del_anillo_en_orden(self):
        # cruda < buena < perfecta < pasada < quemada
        z = zonas()
        self.assertEqual(z, sorted(z), f"las zonas deben ir de menor a mayor: {z}")

    def test_formulas_iguales_al_juego(self):
        self.assertIn("Math.max(1.2, [2.6, 2.5, 2.4, 2.2][lv - 1] ?? 2.2 * Math.pow(0.93, lv - 4))", CODIGO)
        self.assertIn("(lv >= 3 ? [0, 1, 2, 3] : lv === 2 ? [0, 3, 1] : [0, 3])", CODIGO)
        self.assertIn("const GREEN_RATE = 0.55;", CODIGO)

    def test_dificultad_sube_y_tiene_tope(self):
        tiempos = [coccion(n) for n in range(1, 40)]
        self.assertTrue(all(a >= b for a, b in zip(tiempos, tiempos[1:])), "la cocción nunca debe volverse más lenta al subir")
        self.assertGreaterEqual(min(tiempos), 1.2, "la cocción no debe bajar de 1.2 s")
        self.assertEqual([puestos(n) for n in (1, 2, 3, 9)], [2, 3, 4, 4])

    def test_el_verde_siempre_alcanza_a_tocarse(self):
        _, perf, perf_end, _, _ = zonas()
        peor = (perf_end - perf) * coccion(99) / GREEN_RATE
        self.assertGreaterEqual(peor, 0.3, f"en el nivel más difícil el verde dura {peor:.2f} s")

    def test_puntos(self):
        self.assertIn("const CRUDA = 5;", CODIGO)
        self.assertIn("pts = -CRUDA;", CODIGO, "la cruda debe restar puntos")
        self.assertIn("pts = (10 + Math.min(run.streak - 1, 10)) * mult;", CODIGO)
        self.assertIn("run.score = Math.max(0, run.score + pts);", CODIGO, "el puntaje no debe quedar negativo")


class Pantallas(unittest.TestCase):
    def test_regla_hidden(self):
        # regresión: sin esta regla las pantallas salían todas encimadas al abrir el archivo
        self.assertIn("[hidden] { display: none !important; }", CSS)

    def test_cada_id_usado_existe(self):
        usados = set(re.findall(r"\$\('([A-Za-z]+)'\)", CODIGO))
        faltan = sorted(i for i in usados if f'id="{i}"' not in HTML)
        self.assertEqual(faltan, [], f"el código busca elementos que no están en la página: {faltan}")


class Estructura(unittest.TestCase):
    def test_scripts_existen_y_en_orden(self):
        # cada archivo usa lo que definen los anteriores, así que el orden importa
        esperado = ["js/config.js", "js/sonido.js", "js/dibujo.js", "js/juego.js", "js/main.js"]
        self.assertEqual(SCRIPTS, esperado)
        for s in SCRIPTS:
            self.assertTrue((RAIZ / s).exists(), f"falta {s}")

    def test_sin_nombres_repetidos_entre_archivos(self):
        # todos los archivos comparten el mismo espacio de nombres; un nombre repetido rompe el juego
        nombres = re.findall(r"^(?:const|let|function)\s+(\w+)", CODIGO, re.M)
        repetidos = sorted({n for n in nombres if nombres.count(n) > 1})
        self.assertEqual(repetidos, [], f"nombres definidos dos veces: {repetidos}")


if __name__ == "__main__":
    unittest.main()
