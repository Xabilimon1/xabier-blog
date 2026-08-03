---
title: "SAM: lo difícil nunca fue el modelo"
excerpt: "Monté un agente que está en producción sobre un CRM, recibiendo tráfico real desde dos canales. Entré pensando que lo difícil era el modelo. Dos años después señalaría a casi cualquier otro sitio."
publishedAt: "2026-08-03"
category: "production"
readingMinutes: 6
icon: "ph:circuitry-fill"
color: "purple"
lang: "es"
translationOf: "2026-08-03-sam-the-harness-is-the-hard-part"
draft: false
keywords:
  - "agentes LLM"
  - "agentes en producción"
  - "arquitectura de agentes"
  - "agent harness"
  - "Salesforce"
  - "Vertex AI"
---

Escribí hace un tiempo que lo que me empujó de construir hacia research fue ver la producción romperse por sitios de los que el modelo no tenía ninguna culpa. Esta es la versión larga de esa frase, contada a través de SAM, un agente que monté para una empresa industrial española.

La empresa lleva años en el sector industrial y mantiene la parte exterior de más de 2.500 edificios en España. No es el primer sitio donde buscarías un agente en producción, pero es donde monté uno. SAM se sienta encima del Salesforce de la empresa y responde preguntas reales a dos audiencias muy distintas: el equipo comercial, desde dentro de Salesforce, y los operarios de campo, desde una app móvil. El mismo cerebro, dos canales, tráfico real.

Entré asumiendo que la parte difícil era el modelo de lenguaje. Le haces un buen prompt, eliges el correcto, y el resto es fontanería. Resultó ser casi al revés. En un sistema que toca un CRM con datos reales de clientes, el modelo es quizá una quinta parte del trabajo y casi nada del riesgo. Las otras cuatro quintas partes son cómo enrutas una petición, qué le dejas hacer de verdad al agente, cómo evitas que una llamada a una herramienta se convierta en una inyección, y cómo te enteras de que algo se rompió a las 3 de la mañana de un domingo. Eso es el harness, y ahí es donde metí las horas. Lo voy a contar como lo que aprendí, no como consejos, porque casi todo lo entendí a base de hacerlo mal primero.

## La decisión que sí acerté pronto

En la arquitectura sí pensé antes de escribir un solo agente. El negocio nunca iba a querer un agente. Iba a querer uno comercial, luego uno de operarios, luego presupuestos, luego PRL, luego rutas. Si cada uno de esos significaba tocar el core, estaría reescribiendo el motor todos los meses.

Así que SAM no es un montón de agentes. Es un solo motor que ejecuta perfiles, y un perfil es una lista de pasos declarada como datos:

```python
# Un perfil son datos, no código. Un agente nuevo es una entrada nueva aquí,
# y el motor que lo ejecuta no cambia.
PROFILES = {
    "comercial": [
        RagSearchStep(source="commercial"),
        LlmCallStep(stream=False),          # Salesforce quiere una respuesta JSON síncrona
    ],
    "operario": [
        LlmCallStep(stream=True, grounding=True),  # la app móvil streamea tokens por SSE
    ],
    # "presupuestos": [SfQueryStep(), PricingStep(), LlmCallStep(stream=False)],
    # ...una lista más. El runner de abajo ni se entera.
}
```

El flujo de una petición es deliberadamente aburrido: petición, adapter, resolutor de perfil, runner del pipeline, pasos, respuesta. Cuando el negocio pidió el segundo, tercer y cuarto agente, cada uno fue una lista nueva y un par de pasos nuevos, nunca un cambio en el runner. La primera vez que añadí un agente en una tarde en vez de en una semana entendí por qué me había molestado. La misma forma resolvió calladamente lo de los dos canales también. Comercial quiere una única respuesta síncrona, los operarios quieren los tokens llegando según se generan, y toda esa diferencia vive en el adapter y en un flag del último paso, en vez de partir el código en una mitad síncrona y una mitad streaming.

## Luego me di cuenta de que cada herramienta es una puerta

Esta es la parte que no vi venir. En el momento en que tu agente puede hacer cosas, consultar el CRM, buscar un contacto, sacar una oportunidad, cada una de esas herramientas es una puerta, y lo que la cruza es un modelo al que se le puede convencer de cosas.

No soy ingeniero de seguridad, y no voy a narrar los agujeros concretos que encontré y cerré en un sistema de cliente en vivo, porque sería raro publicar eso sobre la producción de otro. Pero los hábitos con los que salí sí merece la pena escribirlos, sobre todo porque ninguno es ingenioso, y eso es un poco el punto. Lo que parece un fallo exótico de agentes suele ser una de estas cosas aburridas que no estaba en su sitio. Las herramientas están en una allowlist por perfil y la comprobación falla cerrada, así que el agente comercial simplemente no puede llamar a una herramienta de operarios, y "¿está permitido esto?" se decide en el servidor en el momento de la llamada, con "no" por defecto. Cualquier cosa que llegue al CRM va parametrizada, nunca pegada con strings al lado del input del usuario. Y cada llamada a una herramienta deja una línea de audit: cuándo, qué perfil, qué herramienta, un hash de los argumentos, el resultado. Un hash y no los argumentos, porque el log no puede convertirse en el siguiente sitio por donde se fugan datos. A la mayoría de estas llegué por las malas, dándome cuenta a posteriori de que me había fiado de algo de lo que no debía.

## El fallo que se me quedó grabado

Mi cicatriz favorita de este proyecto es una de ops, porque es el "parece hecho, no lo está" más limpio que me he encontrado.

Monté una alerta para que me avisara si el sistema empezaba a lanzar demasiados errores de rate-limit. La configuré, validó, se puso verde. Hecho, pensé. No estaba hecho. La métrica que había usado medía un ratio, errores por segundo, y yo había escrito el umbral como si contara errores totales. Mi regla decía en la práctica "dispara si mantenemos más de diez errores de rate-limit por segundo durante cinco minutos", que son miles, que no pasa nunca con un pico real. La alerta era indisparable. Se habría quedado ahí con pinta de estar perfectamente sana mientras justo lo que tenía que cazar pasaba por debajo.

Solo lo pillé porque me obligué a lanzar un pico falso contra el endpoint y esperar el aviso que se suponía que iba a llegar. No llegó. Desde entonces no me fío de una alerta que no he visto dispararse de verdad. El verde en un dashboard solo significa que nadie ha demostrado todavía que funciona.

Es la misma lección en versión pequeña que otra que no paro de reaprender. Hacia el final dejé de revisar la seguridad de SAM leyéndola yo, porque ya me creía que estaba bien, y la creencia es justo la única cosa con la que no puedes auditar. Prefiero que algo adversarial vaya a buscar lo que yo me he convencido de que no está ahí. Normalmente lo encuentra.

## Por qué esto apunta a research

Si me hubieras preguntado al principio dónde vive la dificultad en un agente de producción, habría señalado al modelo. Ahora señalaría a casi todo menos al modelo: el enrutado, los permisos de herramientas, los reintentos, el contexto que decides guardar o tirar. Y no es solo mi anécdota. Hay un paper de Anthropic de principios de 2026 que muestra que solo la configuración de la infraestructura puede mover los benchmarks de coding agéntico varios puntos, a veces más que la diferencia entre los modelos top del leaderboard. Leerlo después de haber vivido SAM se sintió menos como un descubrimiento y más como ponerle nombre a algo que mis manos ya sabían.

El paper que estoy intentando escribir ahora se toma eso en serio: cuánto contribuye de verdad cada componente del harness, ablacionado de uno en uno, sobre modelos públicos. SAM es de donde salió la pregunta. Funciona, está en producción, recibe tráfico real. Pero la parte de la que estoy más orgulloso no es que responda bien. Es que cuando se rompe, se rompe por un sitio que puedo ver.
