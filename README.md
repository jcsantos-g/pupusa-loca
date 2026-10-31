# ¡Volteala! — Minijuego de pupusas

**Actividad individual:** Vibecoding guiado – Semana 2  
**IA utilizada:** Claude (Claude Code, aplicación de escritorio).  
**Proyecto:** Desarrollo de un minijuego 2D inspirado en la gastronomía salvadoreña.

---

## 1. Descripción del proyecto

**¡Volteala!** es un minijuego 2D inspirado en la preparación de pupusas salvadoreñas. El objetivo es cocinar y servir la mayor cantidad posible de pupusas sin quemarlas, obteniendo la puntuación más alta.

El jugador debe observar el estado de cocción de cada pupusa y tocarla en el momento adecuado. La dificultad aumenta progresivamente, obligando a prestar atención a varios puestos de cocción.

### Mecánicas principales

- En el comal pueden cocinarse hasta 4 pupusas simultáneamente.
- Cada pupusa tiene un anillo indicador de cocción:
  - Gris: cruda.
  - Verde claro: buena.
  - **Verde intenso: cocción perfecta.**
  - Rojo: se está quemando.
- El primer toque voltea la pupusa y el segundo la sirve.
- Si una pupusa se pone negra, se quema y se pierde una vida. Con 3 quemadas termina la partida.

### Sistema de puntuación

| Resultado | Puntuación |
|---|---:|
| Perfecta | 10 puntos |
| Buena | 4 puntos |
| Pasadita | 1 punto |
| Cruda | -5 puntos |
| Perfectas consecutivas | +1 por cada una, hasta un máximo de 20 puntos por perfecta |
| Doble perfecta (ambos lados perfectos) | +10 puntos extra |
| Quemada | 0 puntos y se pierde una vida |

### Progresión y dificultad

- Cada 6 pupusas servidas se avanza de nivel.
- Al subir de nivel se habilita otro puesto de cocción, hasta un máximo de 4.
- La velocidad de cocción aumenta progresivamente.
- Al avanzar de nivel se recupera una vida.
- Las pupusas doradas otorgan un multiplicador de puntuación ×3.
- Con 8 perfectas consecutivas se activa el modo especial «¡Comal en llamas!», que duplica los puntos.

### Indicadores y efectos

Para facilitar la identificación del estado de las pupusas, se incorporaron diferentes señales visuales y sonoras:

- Un indicador verde con el mensaje «¡Ya!» y una campanita cuando la pupusa está lista.
- Cuando una pupusa está a punto de quemarse, comienza a llorar y temblar.
- Se activa una alarma y la cámara se acerca para llamar la atención del jugador.

Al finalizar la partida se muestra un resumen con las pupusas perfectas, buenas, crudas y quemadas, la mejor racha y el nivel alcanzado.

El récord máximo se almacena en el navegador.

---

## 2. Cómo ejecutar el juego

El proyecto puede ejecutarse de dos maneras:

**Opción 1: Desde el navegador**

Abrir directamente el archivo `index.html` con Chrome, Edge o Firefox.

**Opción 2: Mediante Python**

Ejecutar el siguiente comando desde la carpeta principal del proyecto:

```bash
python jugar.py
```

Esto inicia un servidor local y abre el juego en el navegador.

### Controles

| Control | Acción |
|---|---|
| Mouse | Seleccionar una pupusa |
| Pantalla táctil | Seleccionar una pupusa |
| Teclas 1 a 4 | Seleccionar los puestos correspondientes |
| P o Esc | Pausar la partida |

---

## 3. Tecnologías y estructura del proyecto

### ¿Por qué JavaScript y no Python?

Aunque Python era el lenguaje sugerido en la actividad, antes de comenzar el desarrollo consulté con la IA cuál sería la mejor alternativa.

Se evaluó utilizar Python con Pygame, pero se determinó que una versión web sería más conveniente para el objetivo del proyecto: permitir que el juego pudiera ejecutarse directamente desde un navegador, tanto en computadoras como en dispositivos móviles.

Por esa razón, se utilizó:

- **HTML5:** estructura de la aplicación.
- **CSS3:** diseño visual y presentación de la interfaz.
- **JavaScript:** mecánicas, controles y lógica del juego.
- **HTML Canvas:** representación gráfica del comal, las pupusas y sus efectos.
- **Web Audio API:** generación de efectos de sonido.
- **Python:** servidor local para ejecutar el juego y pruebas automatizadas.

Esta decisión permitió priorizar la facilidad de ejecución y distribución sin necesidad de instalar un motor de videojuegos.

### Organización de archivos

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura de la página, marcador y pantallas del juego. |
| `css/estilos.css` | Estilos, colores, tipografía y diseño de la interfaz. |
| `js/config.js` | Constantes, reglas de puntuación, dificultad y estado compartido. |
| `js/sonido.js` | Generación de efectos de sonido mediante Web Audio. |
| `js/dibujo.js` | Dibujo de las pupusas, anillos, personajes y efectos visuales. |
| `js/juego.js` | Lógica y mecánicas de la partida. |
| `js/main.js` | Controles, pantallas y ciclo principal del juego. |
| `jugar.py` | Servidor local para ejecutar el juego. |
| `pruebas/test_juego.py` | Pruebas automatizadas (9 pruebas). |
| `versiones/1-pupusa-loca-atrapar.html` | Primera versión experimental del juego. |
| `evidencias/error-pantallas-encimadas.png` | Evidencia de un error encontrado durante las pruebas. |

---

## 4. Evidencia de uso de IA y prompts utilizados

Durante el desarrollo utilicé Claude como copiloto de programación. El trabajo se realizó mediante instrucciones progresivas: primero se definió una idea, después se generaron versiones funcionales y finalmente se solicitaron mejoras basadas en los problemas encontrados durante las pruebas.

Cada prompt conserva lo que pedí, pero escrita con el contexto, el objetivo y las restricciones que ahora sé que conviene incluir.

### Prompt 1. Definición de la idea inicial

> Quiero desarrollar un minijuego 2D llamado «Pupusa Loca», inspirado en la gastronomía salvadoreña.
> Busco una experiencia sencilla, divertida y con un estilo visual caricaturesco. El jugador debe preparar una pupusa sobre un comal, recoger ingredientes y conseguir la mayor puntuación posible antes de que termine el tiempo.
> Los ingredientes deberían modificar progresivamente la apariencia de la pupusa y algunos objetos podrían representar obstáculos.
> Antes de comenzar a programar, analiza la idea y propón alternativas para conseguir una mecánica entretenida, fácil de entender y con posibilidades de mejorar progresivamente.

**Qué solicité:** recomendaciones para definir el concepto del juego antes de escribir código.

**Resultado:** la IA propuso comenzar con un prototipo web, establecer una mecánica de puntuación y desarrollar el juego por etapas.

### Prompt 2. Selección de tecnología

> ¿Me recomendarías utilizar Python o JavaScript?
> Compara ambas alternativas considerando facilidad de desarrollo, ejecución en computadoras y compatibilidad con dispositivos móviles. Recomienda la opción más adecuada para este proyecto.

**Por qué lo consulté:** Python era el lenguaje sugerido en la actividad y quería comprobar si era la mejor alternativa.

**Resultado:** después de evaluar las opciones, decidí utilizar JavaScript y HTML Canvas para el juego, dejando Python para herramientas auxiliares.

### Prompt 3. Primera iteración: claridad y condiciones de derrota

> He probado la primera versión y encontré dos problemas:
> 1. Los objetos que representan obstáculos no se distinguen fácilmente de los demás.
> 2. No existe una condición de derrota clara.
> Mejora la identificación visual de los objetos peligrosos y establece un sistema de tres vidas que permita perder la partida cuando se cometan demasiados errores.
> Mantén la mecánica principal del juego y evita agregar funcionalidades innecesarias.

**Por qué lo ajusté:** durante las pruebas noté que era difícil identificar los objetos peligrosos y que no existía una consecuencia clara por equivocarse.

**Resultado:** se agregaron indicadores visuales de peligro y un sistema de tres vidas.

### Prompt 4. Evaluación de la experiencia de juego

> Después de probar el juego, la experiencia no es suficientemente intuitiva.
> Se debe presta demasiada atención a los ingredientes y se pierde de vista el objetivo principal.
> Analiza las mecánicas actuales e identifica qué elementos podrían simplificarse para conseguir una experiencia más directa, fácil de comprender y entretenida.
> Prioriza una mecánica principal que pueda entenderse rápidamente.

**Por qué lo ajusté:** me di cuenta de que incluso yo tenía dudas sobre el objetivo de algunas mecánicas. Esto indicaba que el problema no era únicamente visual, sino también de diseño.

**Resultado:** se identificó que existían demasiadas reglas y elementos simultáneos.

### Prompt 5. Cambio de concepto

> Quiero replantear el juego porque la mecánica actual no me parece suficientemente entretenida.
> Propón un nuevo concepto para un minijuego competitivo, inspirado en la preparación de pupusas.
> Busco una mecánica sencilla de entender, pero que requiera habilidad, atención y precisión. Debe permitir aumentar progresivamente la dificultad y motivar al jugador a superar su propio récord.
> Antes de programarlo, explícame cómo funcionaría la nueva propuesta y por qué podría resultar más entretenida.

**Por qué lo ajusté:** decidí que era mejor cambiar la mecánica principal en lugar de continuar agregando soluciones a un concepto que no estaba funcionando.

**Resultado:** surgió «¡Volteala!», un juego basado en controlar el tiempo de cocción y voltear las pupusas en el momento adecuado.

### Prompt 6. Simplificación de la interfaz

> La nueva versión ya tiene una mecánica más clara, pero el menú inicial está demasiado cargado y presenta problemas para cerrar las pantallas.
> Revisa el comportamiento de las pantallas de inicio, pausa y finalización.
> Simplifica el menú, deja únicamente las opciones necesarias y asegúrate de que las diferentes pantallas se muestren y oculten correctamente.

**Por qué lo ajusté:** durante las pruebas encontré que las pantallas aparecían simultáneamente y que el menú tenía demasiados elementos.

**Resultado:** se simplificó la interfaz y se identificó un conflicto entre el atributo `hidden` y las reglas CSS.

### Prompt 7. Mejorar el ritmo del juego

> La mecánica funciona, pero considero que todavía le falta dinamismo.
> Mejora la sensación de acción sin complicar los controles ni introducir nuevas reglas difíciles de entender.
> Puedes proponer efectos visuales, sonoros y mecánicas especiales que recompensen al jugador cuando consiga buenos resultados.

**Por qué lo ajusté:** el juego ya funcionaba, pero al jugarlo se sentía lento y poco emocionante, sobre todo al inicio de la partida.

**Resultado:** se incorporaron pupusas doradas, el modo «¡Comal en llamas!», música dinámica y efectos adicionales.

### Prompt 8. Indicadores de atención y comportamiento

> Al jugar con varios puestos de cocción, resulta complicado prestar atención a los anillos de todas las pupusas al mismo tiempo.
> Implementa un sistema de avisos que ayude a identificar cuándo una pupusa está lista y cuándo está a punto de quemarse.
> Considera utilizar indicadores visuales, expresiones en las pupusas, sonidos y un acercamiento de cámara cuando exista una situación de peligro.
> El objetivo es que el jugador pueda reconocer rápidamente qué pupusa necesita atención sin tener que observar constantemente todos los indicadores.

**Por qué lo ajusté:** al habilitar varios puestos, los indicadores de cocción dejaron de ser suficientes para identificar rápidamente dónde debía actuar.

**Resultado:** se incorporaron globos de aviso, campanitas, animaciones de llanto, temblores, alarmas y acercamientos de cámara.

### Prompt 9. Ajuste de dificultad y duración

> Después de probar los cambios, considero que el juego se vuelve demasiado rápido y las partidas terminan siendo muy cortas.
> Ajusta la velocidad de cocción para que el jugador tenga más oportunidad de reaccionar cuando una pupusa alcance su punto ideal.
> También quiero que la dificultad aumente progresivamente mediante niveles, habilitando nuevos puestos de cocción.
> Establece límites para evitar que el juego se vuelva imposible de completar y conserva un reto progresivo.

**Resultado:** se ajustó la velocidad de la zona perfecta y se implementó una progresión por niveles, con un máximo de cuatro puestos.

### Prompt 10. Balance de puntuación y estadísticas

> La mecánica ya está definida, pero quiero mejorar el sistema de puntuación y las estadísticas finales.
> Realiza los siguientes ajustes:
> - Reduce la escala de puntuación, ya que los resultados actuales son demasiado elevados.
> - Aplica una penalización cuando una pupusa se sirva cruda.
> - Mantén las recompensas por las pupusas bien cocinadas.
> - En la pantalla final muestra la cantidad de pupusas perfectas, buenas, crudas y quemadas.
> Verifica que los cambios no afecten el funcionamiento de las demás mecánicas.

**Por qué lo ajusté:** una partida llegaba a unos 17,000 puntos, una cifra que no se entendía, y servir una pupusa cruda no tenía ningún costo. Además, al terminar no se sabía en qué me había equivocado.

**Resultado:** se redujo la escala de puntos, se incorporó la penalización y se mejoró el resumen de la partida.

### Prompt 11. Simplificación de funcionalidades

> Quiero preparar el proyecto para su entrega.
> Revisa las funcionalidades actuales y elimina aquellas que no aporten directamente a la experiencia principal, como el ranking, los retos diarios y las opciones para compartir por WhatsApp.
> Conserva únicamente las mecánicas del juego, el sistema de niveles y el récord personal.
> Evita agregar nuevas funcionalidades. Prioriza la claridad, estabilidad y facilidad de uso.

**Por qué lo ajusté:** durante el desarrollo aparecieron funcionalidades adicionales que complicaban la experiencia y no eran necesarias para cumplir el objetivo del proyecto.

**Resultado:** se eliminaron las funcionalidades secundarias y se conservó una experiencia más sencilla.

## 5. Iteración y mejoras realizadas

El desarrollo no consistió en generar una única versión del juego. Se realizaron diferentes iteraciones, evaluando los resultados y ajustando las instrucciones según los problemas encontrados.

| Versión | Características | Problema identificado | Mejora solicitada |
|---|---|---|---|
| 1. Atrapar | Ingredientes que caen y botón para servir. | Demasiadas reglas y objetivo poco claro. | Cambiar la mecánica principal. |
| 2. ¡Volteala! | Cocción y volteo de pupusas. | Menú sobrecargado y pantallas encimadas. | Simplificar la interfaz. |
| 3. Con acción | Efectos, pupusas doradas y música. | Difícil atender varios puestos. | Incorporar avisos visuales y sonoros. |
| 4. Con avisos | Globos, animaciones y alertas. | Ritmo demasiado rápido. | Ajustar la velocidad y los niveles. |
| 5. Con niveles | Dificultad progresiva. | Puntuaciones demasiado elevadas. | Balancear la puntuación y las estadísticas. |
| 6. Versión final | Mecánicas, niveles y récord personal. | Funcionalidades secundarias innecesarias. | Simplificar y preparar la entrega. |

### La mejora más importante

El cambio más significativo fue pasar de la primera versión, basada en recoger ingredientes, a la mecánica de cocinar y voltear pupusas.

Esta decisión surgió después de probar el primer prototipo y reconocer que agregar más funcionalidades no solucionaría el problema principal: el juego no era suficientemente intuitivo.

En lugar de seguir modificando una mecánica que no estaba funcionando, utilicé la IA para explorar una alternativa y posteriormente desarrollar una nueva versión.

Esto permitió que el proyecto evolucionara a partir de la evaluación del resultado y no únicamente de las sugerencias de la IA.

---

## 6. Validación y pruebas

La validación se realizó durante las diferentes etapas del desarrollo, combinando pruebas manuales, revisión de código y pruebas automatizadas.

### 6.1 Pruebas manuales

Después de cada modificación ejecuté el juego para comprobar:

- Que el menú principal funcionara correctamente.
- Que se pudiera iniciar, pausar y finalizar una partida.
- Que las pupusas pudieran voltearse y servirse.
- Que los puntos se asignaran correctamente según el estado de cocción.
- Que las vidas y los niveles funcionaran.
- Que los indicadores visuales y sonoros respondieran a los eventos correspondientes.

### 6.2 Revisión técnica

Se utilizó `node --check` para comprobar la sintaxis de los archivos JavaScript después de las modificaciones.

También se revisó la ejecución desde el navegador, incluyendo la consola de desarrollador.

### 6.3 Pruebas automatizadas

Se desarrollaron nueve pruebas automatizadas en Python mediante el módulo `unittest`.

Para ejecutarlas:

```bash
python -m unittest discover -s pruebas -v
```

Las pruebas verifican:

1. El orden correcto de las zonas de cocción.
2. El incremento progresivo de dificultad y su límite.
3. La duración mínima de la zona perfecta en el nivel más difícil.
4. La penalización por servir pupusas crudas.
5. Que la puntuación no sea negativa.
6. La existencia de los elementos HTML requeridos por el código.
7. El comportamiento de la regla que solucionó el error de las pantallas.
8. La existencia y el orden de carga de los archivos JavaScript.
9. Que no existan nombres repetidos entre los archivos.

**Resultado:** las nueve pruebas finalizaron correctamente (`OK`).

Adicionalmente, se modificó temporalmente una copia del juego para eliminar una de las reglas verificadas. La prueba correspondiente detectó el problema y falló, confirmando que la validación de regresión estaba funcionando.

### 6.4 Prueba final

Se ejecutó el proyecto mediante el servidor local y se comprobó que:

- Los siete archivos principales cargaran correctamente.
- El menú y una partida funcionaran.
- No aparecieran errores en la consola.
- Una pupusa perfecta sumara 10 puntos.
- Una pupusa cruda restara 5 puntos.

### 6.5 Errores y ajustes encontrados

**Error 1. Pantallas encimadas**

Al abrir directamente `index.html`, aparecían simultáneamente el menú, la pausa, la pantalla final y el ranking.

La causa fue un conflicto entre el atributo HTML `hidden` y una regla CSS que establecía `display: flex`.

Se solucionó incorporando:

```css
[hidden] {
    display: none !important;
}
```

Este problema fue especialmente importante porque el juego funcionaba correctamente dentro del entorno de Claude, pero no al ejecutarlo directamente en el navegador.

**Error 2. Dificultad sin límite**

La velocidad de cocción aumentaba continuamente, haciendo que el juego se volviera prácticamente imposible.

Se implementó una progresión por niveles y un límite mínimo de tiempo de cocción.

**Error 3. Escala de puntuación**

Los resultados alcanzaban aproximadamente 17,000 puntos, lo que dificultaba interpretar el desempeño.

Se redujo la escala de puntuación para obtener resultados más equilibrados.

**Error 4. Diseño poco intuitivo**

La primera versión tenía demasiadas mecánicas y no permitía identificar fácilmente el objetivo principal.

Se decidió cambiar el concepto del juego en lugar de continuar agregando funcionalidades.

**Error 5. Funcionalidades innecesarias**

Durante el desarrollo se incorporaron elementos como retos diarios, ranking y opciones para compartir.

Aunque podían funcionar, no aportaban suficiente valor al objetivo principal, por lo que se eliminaron.

---

## 7. Comprensión del código

Inicialmente, el juego estaba concentrado en un único archivo `index.html` de aproximadamente 1,100 líneas.

Para mejorar su organización y facilitar el mantenimiento, solicité a la IA separar el código según las responsabilidades de cada componente, conservando el comportamiento existente.

Actualmente, el proyecto está organizado en archivos independientes.

### Conceptos principales que comprendí

**Ciclo principal del juego**

El juego utiliza `requestAnimationFrame` para actualizar y dibujar continuamente los elementos.

La función `frame()` coordina dos procesos:

- `update(dt)`: actualiza el estado del juego según el tiempo transcurrido.
- `render()`: dibuja los elementos visuales en el Canvas.

**Estado de las pupusas**

Cada pupusa se representa mediante un objeto que almacena información como su nivel de cocción (`d`), el lado que se está cocinando (`side`) y su estado actual (`st`).

Esto permite controlar individualmente cada pupusa sin tener que manejar toda la lógica mediante condiciones independientes.

**Sistema de puntuación**

La función `grade(d)` determina el resultado de una acción según el nivel de cocción.

Posteriormente, `tap(p)` utiliza ese resultado para aplicar la puntuación correspondiente, actualizar las rachas y determinar si la pupusa debe voltearse o servirse.

**Dificultad progresiva**

Las funciones `cookFor(nivel)` y `gapFor(nivel)` permiten modificar los tiempos y la frecuencia de aparición de pupusas según el nivel.

La función `levelUp()` administra el avance entre niveles.

**Representación gráfica y sonido**

Las funciones de dibujo utilizan Canvas 2D para representar las pupusas, sus indicadores y las animaciones.

Los sonidos se generan mediante Web Audio API, utilizando osciladores y ruido, sin depender de archivos de audio externos.

**Almacenamiento del récord**

Se utiliza `localStorage` para conservar el mejor resultado en el navegador, incluso después de cerrar la partida.

---

## 8. Reflexión final

### ¿Qué aprendí utilizando IA para programar?

Aprendí que utilizar IA para desarrollar software no consiste simplemente en solicitar que genere código y aceptar el resultado. Es necesario tener una idea clara de lo que se quiere conseguir, probar las funcionalidades y comunicar los problemas de manera específica.

Uno de los aprendizajes más importantes fue entender que un programa puede funcionar técnicamente y aun así ofrecer una mala experiencia al usuario. Esto ocurrió con mi primera versión del juego: tenía código funcional, pero la mecánica no era suficientemente intuitiva.

También comprendí la importancia de dividir un proyecto en partes más pequeñas y utilizar instrucciones progresivas. De esta manera pude desarrollar nuevas funcionalidades sin perder de vista el objetivo principal.

### ¿Qué ventajas y limitaciones identifiqué del vibecoding?

La principal ventaja fue la velocidad con la que pude transformar una idea en un prototipo funcional. También pude experimentar con diferentes mecánicas, corregir errores y mejorar el diseño sin tener que desarrollar cada elemento completamente desde cero.

Sin embargo, identifiqué algunas limitaciones. La IA puede interpretar de manera diferente una instrucción, agregar funcionalidades que no se necesitan o generar soluciones que funcionan en un entorno, pero presentan problemas en otro.

También comprobé que la IA no puede sustituir las pruebas realizadas por el usuario. En varias ocasiones tuve que jugar, identificar qué no me gustaba y explicarle el problema. Incluso fue necesario compartir una captura de pantalla para encontrar la causa de un error visual.

Por eso considero que la IA es una herramienta de apoyo muy útil, pero las decisiones, la revisión y la validación del resultado siguen siendo responsabilidad del desarrollador.

### ¿Qué partes del código comprendo y cuáles necesito reforzar?

Comprendo la estructura general del proyecto, la separación de responsabilidades y la lógica principal del juego.

Puedo identificar cómo funciona el ciclo de actualización y dibujo, cómo se administra el estado de las pupusas, cómo se determinan los resultados de cocción y cómo se calcula la puntuación.

También comprendo cómo se organiza la dificultad por niveles y cómo se utilizan herramientas como `localStorage` para conservar información.

Sin embargo, considero que todavía necesito reforzar algunos aspectos, especialmente el dibujo y las animaciones mediante Canvas, el manejo de la cámara y la generación de sonidos con Web Audio API.

Aunque pude revisar y comprender su funcionamiento general con ayuda de la IA, necesito practicar más estos conceptos para poder modificarlos y desarrollarlos por mi cuenta.

---

## 9. Conclusión

El desarrollo de «¡Volteala!» me permitió experimentar un proceso de programación asistida por inteligencia artificial en el que no solamente se generó código, sino que también se analizaron ideas, se tomaron decisiones de diseño, se corrigieron errores y se validaron resultados.

La experiencia más importante fue comprobar que el resultado mejora cuando el desarrollador participa activamente, cuestiona las soluciones propuestas y utiliza la IA como copiloto, manteniendo el control sobre el proyecto.

**El objetivo no fue conseguir que la IA programara por mí, sino utilizarla como una herramienta para desarrollar una idea, comprender sus resultados y mejorarla mediante pruebas e iteraciones.**