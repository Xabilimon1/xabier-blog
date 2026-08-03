---
title: "Lince: las restricciones que no eliges"
excerpt: "Monté una plataforma de reserva de salas para los espacios de estudio de mi universidad, diseñada alrededor de las reglas de la propia institución. Todavía no está implantada. Lo difícil nunca fue React. Fue todo lo que la institución ya había decidido por mí."
publishedAt: "2026-08-03"
category: "production"
readingMinutes: 6
icon: "ph:buildings-fill"
color: "blue"
lang: "es"
translationOf: "2026-08-03-building-inside-an-institution"
draft: false
keywords:
  - "full-stack"
  - "software institucional"
  - "autenticación"
  - "row-level security"
  - "Supabase"
  - "React"
---

El otro case study que escribí aquí iba de un agente, y la lección era que el modelo nunca fue lo difícil. Este va de un software mucho más corriente, una app web para reservar salas de estudio, y la lección rima. El framework tampoco fue lo difícil. Lo que lo puso difícil fue que lo estaba construyendo para una institución, y una institución ya tiene decididas casi todas las cosas que normalmente diseñarías tú.

La app es Lince, una plataforma de reserva de salas que monté para los espacios de estudio de mi universidad. Quiero ser honesto con su estado desde el principio, porque cambia cómo hay que leer el resto. No está implantada. La construí como un producto completo, con auth, roles, panel de admin, integración de calendario y cinco idiomas, todo contra los requisitos reales de la universidad, y ahora mismo están viendo si la implantan de verdad. Así que esto no es una historia de "lo usamos en producción". Es la historia de diseñar algo para encajar en restricciones que yo no puse, que resultó ser toda la dificultad y casi todo lo que aprendí. Por debajo hay React, TypeScript y Supabase, pero las partes interesantes no tenían nada que ver con el stack.

## La identidad la heredas

Lo primero que descubrí es que no eliges cómo entra la gente. En un proyecto personal montas email y contraseña en una tarde y sigues. Aquí la regla era simple y no había discusión: la gente entraría con su email institucional, la cuenta de la universidad que ya tienen, y con ninguna otra cosa. Esa frase se cargó calladamente el camino fácil.

Así que la autenticación se convirtió en dos caminos que tenía que montar y mantener funcionando juntos. El personal entra por Microsoft, la misma identidad corporativa que usan para todo lo demás, así que la app se apoya en la cuenta que la institución ya gestiona. Los alumnos, que no todos tienen ese mismo montaje, pasan por un flujo de código de un solo uso: metes tu email de la universidad, te llega un código de seis dígitos que dura poco, lo escribes de vuelta, y estás dentro. Ninguno de esos dos era el login que yo habría elegido. Los dos eran el login que la institución exigía. Y eso es casi todo el trabajo cuando construyes para el edificio de otro. El sistema de identidad lo heredas, no lo inventas.

## Cuando ruedas tu propia auth, heredas también todo lo de debajo

Aquí está la parte que de verdad me pilló, y creo que es lo más útil de todo el post.

La base de datos va detrás de row-level security. Cada fila lleva reglas sobre quién puede verla o cambiarla, y las hace cumplir la propia base de datos en vez de fiarse de la app. La forma limpia en que funcionan esas reglas es que la base de datos siempre sabe quién está preguntando. Hay una identidad estándar en la que cada política se puede apoyar. Escribes una regla que dice "solo puedes tocar las filas que son tuyas", y funciona, porque "tú" es algo que la base de datos puede leer.

Salvo que mis alumnos no entraban de la forma estándar. Como había montado ese flujo por código para cumplir la regla del email institucional, la noción habitual de quién está preguntando volvía vacía. Y toda regla que había escrito dando por hecho que no estaría vacía empezó a fallar, en silencio, denegando acciones legítimas porque la comprobación comparaba contra nada:

```sql
-- La versión limpia asume que la identidad estándar siempre está:
--   using ( owner_email = current_identity() )
-- Con un login custom, current_identity() es null, así que la regla
-- deniega a todo el mundo. Acabas re-derivando "quién pregunta" desde
-- el claim que sí controlas:
--   using ( owner_email = coalesce(current_identity(), mi_propio_claim()) )
```

La lección es más grande que el arreglo. En el momento en que ruedas tu propia autenticación, aunque sea por un buen motivo como que una institución te lo pide, también te apuntas a re-derivar cada cosa que dependía de la normal. Cada comprobación de debajo que asumía que el sistema sabe quién eres pasa a ser tuya otra vez. La auth nunca es solo la pantalla de login. Es la raíz de la que cuelgan otras cien decisiones.

## Las reglas son del edificio, no mías

Lo mismo aparecía en sitios menos técnicos. Un alumno puede reservar hasta tres horas, en franjas de día. El personal tiene más rato, más tarde, y acceso a las salas interactivas grandes que los alumnos no pueden tocar. Hay un flujo de aprobación, una forma de sancionar a quien no se presenta, un registro de quién hizo qué. No inventé ninguno de esos números ni reglas. Reflejan cómo la universidad gestiona de verdad sus espacios, y mi trabajo era modelarlos fielmente, no tener opinión sobre ellos. Construir software para una institución es sobre todo el trabajo de convertir las reglas que ya tiene otro en algo que un ordenador pueda hacer cumplir sin perder lo que hacía que tuvieran sentido.

Y luego está la parte aburrida que resulta ser la que más importa. Una reserva confirmada crea un evento real en un calendario de Outlook. Los emails deben salir por el sistema de correo de la propia universidad para que no caigan en spam. Cinco idiomas, porque los alumnos no van a leer todos en español. Nada de eso impresiona por separado, pero junto es la diferencia entre una demo y algo a lo que una institución le puede poner su nombre.

## Qué me llevé

Si SAM me enseñó que el harness alrededor del modelo es donde se esconde la dificultad, Lince me enseñó la misma forma un nivel por encima. Cuando construyes para una institución, la ingeniería interesante no está en el código que eres libre de escribir, está en adaptarte con limpieza a todo lo que no eres libre de cambiar. La identidad que heredas, las reglas que no son tuyas, el calendario que tiene que ser el de verdad.

No voy a fingir que es más de lo que es. No está implantada, la hizo un solo estudiante, y sé exactamente por dónde seguiría endureciéndola antes de que la tocara gente real. Adopte la universidad o no, de lo que me alegro es de haber diseñado todo bajo condiciones que yo no elegí, y eso acabó sintiéndose más a ingeniería de verdad que cualquier proyecto en el que puse yo las reglas.
