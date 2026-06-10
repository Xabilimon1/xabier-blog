---
title: "De producción a research, a los 19"
excerpt: "Quería aplicar a un fellowship que requiere visa. No la tengo. Lo que pasó después fue el cambio de plan más útil que he hecho."
publishedAt: "2026-06-09"
category: "meta"
readingMinutes: 8
icon: "ph:compass-fill"
color: "coral"
lang: "es"
translationOf: "2026-06-09-from-production-to-research-at-19"
draft: false
---

Unos días antes de la decisión estaba investigando cómo aplicar al fellowship de Anthropic, una empresa cuyo trabajo me fascina y cuya ambición es similar a la mía, una empresa en la que me veo con vocación absoluta. Tras leer la letra pequeña vino el choque: no podía aplicar porque no tengo visa de trabajo full-time en USA, Canadá o UK, así que ya estaba descartado antes de empezar.

Me puse a pensar qué otros sitios había, pero al rato me di cuenta de que la pregunta interesante no era esa. La pregunta era qué ofrecía yo.

Me considero espabilado y ambicioso, no superdotado ni de altas capacidades ni mucho menos, pero sí alguien que se saca sus propias castañas del fuego y que por suerte encontró su vocación pronto. Soy uno de esos raritos que de pequeño, en vez de estar jugando, se pasaba el rato viendo cómo mejorar su juego. El niño que se hacía mods en Minecraft, plugins, que siempre veía una vía para la mejora y nunca encontraba la perfección. Cuando algo se me metía en la cabeza me recorría YouTube entero, el buscador de Google, lo típico, hasta que todos los enlaces aparecían en morado y todos los vídeos aparecían como vistos. Tragaba información como un oso hambriento.

Me desvío. Volviendo a la pregunta de qué ofrecía. Cuando hice el inventario honesto, salió esto.

Llevo un tiempo trabajando en Xexterior, una empresa industrial con años de trayectoria que mantiene la parte exterior de más de 2.500 edificios en España. Lo curioso es que justo ahí, en una empresa que de primeras no asocias con IA, monté SAM — un agente orquestador comercial sobre Salesforce que enriquece el contexto del contacto, lo lleva a un backend nuestro y devuelve respuesta vía Gemini. Recibe tráfico real desde la app de SF y la móvil. Es lo más cercano que tengo a "agente en producción de verdad", y la lista de cosas que aprendí ahí sobre cómo se rompen los sistemas multi-agente en silencio es de donde sale la materia prima del paper que voy a escribir.

A la vez trabajo como becario en mi universidad. Construí allí una interfaz de evaluación de proyectos que usan unos 30-40 profesores al año, repitiendo curso tras curso. No es prueba de concepto, es producción institucional con todo lo que conlleva: calendarios, identidades, fechas que no se pueden mover. Y dentro del mismo grupo construimos también un sistema de reserva de salas de estudio para los alumnos de la propia universidad. Más cosas que tocan datos sensibles y gente real.

Por mi cuenta llevo Numo, una app de escritorio que pretende sustituir a SPSS y modernizar la experiencia de hacer estadística. La idea: motor estadístico real, local, bundleado con la app (pandas, scipy, statsmodels, pingouin) e interpretación en lenguaje natural vía Claude. El argumento que no se puede copiar: tus datos clínicos o educativos nunca salen de tu ordenador, solo la IA necesita internet, no los datos. Está en desarrollo, no tiene usuarios todavía, pero la arquitectura ya está montada en Tauri v2 y los algoritmos del motor funcionan.

Cuatro cosas reales, que dicho así suena bien. Pero si te sientas en la silla del reclutador de un lab, lo que ve es a un builder, top 5% de los chavales de su edad, vale, pero la credibilidad de builder es exactamente la cosa que esos sitios ya tienen apilada hasta el techo. Lo que yo no tenía era ni un paper publicado, ni una replicación, ni una contribución a research que viaje entre labs.

Y la cosa es que el research signal viaja. Un paper con mi nombre lo lee igual de bien Anthropic, OpenAI, DeepMind, Mistral o cualquier startup de IA, y una herramienta open-source construida alrededor de un asistente concreto solo viaja hacia ese asistente.

Así que el problema no era hacer más cosas en producción, era publicar el conocimiento que ya tengo del sitio donde realmente se aprende esto, que es la producción rompiéndose por sitios que no esperabas.

Antes de aceptar esto intenté la jugada clásica, la que pide el cuerpo cuando llevas dos años construyendo cosas: un flagship open-source grande y ambicioso que diga "este es el tío". Pasé por tres ideas. Las tres murieron por research profundo en la misma tarde, en unas cuatro horas.

La primera era un benchmark de cómo se recuperan los agentes LLM de fallos en cadena: timeouts, herramientas rotas, contexto truncado. Mi lectura inicial era que nadie estaba haciendo esto en serio. Cuando me puse a buscar de verdad me aparecieron Letta Recovery-Bench, balagan-agent, ToolMisuseBench y un par más, varios de ellos con respaldo institucional. Esa la dejé caer ahí mismo.

La segunda era un perfilador de coste y cache para runs de agentes en producción. Mi lectura inicial era que esto es exactamente lo que me ha mordido en Xexterior y por tanto lo va a querer todo el mundo. Cuando me puse a buscar me salieron más de 10 proyectos OSS activos y, además, el equipo del asistente que yo estaría perfilando lanzó un comando `/cost` nativo en su CLI esa misma semana. Ahí ya iban dos.

La tercera era "agent-surgeon": fork, merge y replay de sesiones de agentes para debug post-mortem. Mi lectura inicial era que esto sí era nuevo, que esta era la buena. Cuando me puse a buscar resulta que el SDK ya exponía hooks de fork, listado y resume de sesiones con cookbook oficial, y había un competidor con cientos de estrellas en GitHub (`es617/claude-replay`) ya haciendo replays HTML de sesiones de agentes. Y con eso se cayó la tercera.

La sensación de tirar tres ideas seguidas en una sola tarde es jodida, porque cada vez que matas una te das cuenta de que la habrías construido sin haber hecho los deberes, y habría perdido meses replicando algo que ya existe o persiguiendo paridad con un equipo que shippea cada semana.

Lo que sí me llevé de esa tarde no fue ninguna idea, fue darme cuenta de que no me puedo fiar de la primera búsqueda cuando estoy decidiendo dónde meter año y medio de mi vida. Tres tirones mínimos por sitios distintos — GitHub directo, arxiv, los foros donde está la gente que de verdad construye esto — con sinónimos diferentes en cada uno, antes de decirme a mí mismo que algo no existe. La conclusión más amplia: el espacio open-source alrededor de los asistentes está saturado en 2026, y apostar 18 meses de dev en solitario ahí es una apuesta perdedora.

A partir de ahí el plan se reordenó, y la pieza central es escribir un paper empírico que responda a una pregunta concreta: ¿cuánto contribuye cada componente del harness (estructura del prompt, lógica de selección de herramientas, política de reintentos, gestión de contexto) al rendimiento de un agente LLM? Ablación sistemática, modelos públicos, tareas sintéticas, varios trials. Cita y extiende un paper reciente de Anthropic (febrero 2026) que muestra que la configuración de la infraestructura puede mover los benchmarks de coding agéntico varios puntos porcentuales, a veces más que la diferencia entre los modelos top del leaderboard. Yo extiendo eso empíricamente al resto de componentes del harness. Solo, APIs públicas, unos 300 dólares de cómputo. Sin involucrar a terceros. Si el workshop top no entra, va a arxiv como preprint y a por la siguiente.

Mientras tanto sigo con la carrera, sigo con Xexterior y la universidad, y abro este blog para tener un sitio donde dejar lo que voy aprendiendo. No por estrategia de "marca personal". Por la razón aburrida de que escribir lo que estudio es la única forma que conozco de saber si lo entiendo.

No sé si el paper saldrá. La pregunta es buena, la metodología es defendible, pero mandar un paper a un workshop a los 20 no es trivial y la tasa de rechazo es real. Tampoco sé si los 18 meses que me he dado son la cifra correcta. Puede que con menos baste. Puede que necesite más.

Y la duda que cuesta más decir en voz alta: ¿es esto el camino correcto, o es la racionalización de no poder hacer fellowship por la visa? Honestamente, no lo sé del todo. Lo que sí sé es que la señal de research viaja entre labs, que la parte de builder ya la tengo cubierta, y que matar tres flagships en una tarde me enseñó que la velocidad sin verificación es lo que más caro sale.

Con lo que sé hoy, esta es mi mejor apuesta. No tengo ninguna certeza de que sea el camino correcto, y la voy a ir contando aquí mientras la juego.
