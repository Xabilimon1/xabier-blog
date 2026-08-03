---
title: "LinceReservations: las restricciones que no eliges"
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

El otro case study que escribí aquí iba de un agente, y la lección era que el modelo nunca fue lo difícil. Este va de un software mucho más corriente, una app web para reservar salas de estudio, y la lección rima. El framework tampoco fue el cuello de botella. La dificultad vino de construirlo para una institución, donde la mayoría de las decisiones que normalmente tomarías tú ya están tomadas.

La app es LinceReservations, una plataforma de reserva de salas que monté para los espacios de estudio de mi universidad. Quiero ser claro con su estado, porque enmarca todo lo demás: no está implantada. La construí como un producto completo, con autenticación, control de acceso por roles, una consola de administración, integración de calendario y cinco idiomas, todo contra los requisitos reales de la universidad, y ahora mismo está en evaluación para adoptarla. Así que esto no es una historia de "lo tenemos en producción". Es sobre diseñar un sistema para encajar en restricciones que yo no puse, que resultó ser donde vive la ingeniería de verdad y casi todo lo que aprendí. El stack por debajo es React, TypeScript y Supabase, pero las partes interesantes tenían poco que ver con él.

## La identidad la heredas

La primera restricción con la que choqué es que no eliges cómo se autentica la gente. En un proyecto personal montas email y contraseña en una tarde y sigues. Aquí el requisito era fijo e innegociable: los usuarios se autentican con su identidad institucional, la cuenta que la universidad ya les da, y con ninguna otra cosa. Ese único requisito descartó el camino por defecto.

Así que la autenticación se convirtió en dos flujos que tenía que montar y mantener coherentes. El personal entra por Microsoft vía MSAL, contra el tenant de Azure AD de la organización, así que la app se apoya en la identidad corporativa que la institución ya gestiona. Los alumnos, que no todos están en ese directorio, pasan por un flujo custom de código de un solo uso: metes tu email de la universidad, recibes un código de seis dígitos que dura poco, y se verifica en el servidor antes de dejarte entrar. Ninguno de los dos era el login que yo habría elegido. Los dos eran el login que la institución imponía. Y eso es casi todo el trabajo cuando construyes para la organización de otro. El sistema de identidad lo heredas, no lo diseñas.

## Cuando ruedas tu propia auth, heredas también todo lo de debajo

Aquí está el fallo que más tiempo me costó, y el punto más transferible de este post.

La base de datos va detrás de row-level security: cada fila lleva políticas que deciden quién puede leerla o modificarla, y las hace cumplir el propio Postgres en vez de fiarse del cliente. Esas políticas se apoyan en un supuesto único, que la base de datos siempre sabe quién está preguntando. Hay una identidad canónica, expuesta a cada política, que un predicado puede referenciar. Escribes "un usuario solo puede tocar las filas que son suyas" y se cumple, porque la comprobación de propiedad se resuelve contra un claim que la base de datos puede leer.

Salvo que mis alumnos no se autenticaban por el proveedor estándar. Como había montado el flujo custom por código para cumplir el requisito de identidad institucional, esa identidad canónica se resolvía a null, y toda política que había escrito dando por hecho que no lo sería empezó a denegar peticiones legítimas, comparando contra nada:

```sql
-- La versión limpia asume que la identidad canónica siempre está:
--   using ( owner_email = auth_identity() )
-- Con un flujo de auth custom, auth_identity() es null, así que el
-- predicado deniega a todos. Re-derivas "quién pregunta" desde el claim
-- que sí controlas, y recurres a él de forma explícita:
--   using ( owner_email = coalesce(auth_identity(), claim_verificado()) )
```

La lección sobrevive al arreglo. En el momento en que ruedas tu propia autenticación, aunque sea por un motivo legítimo como un mandato institucional, también te apuntas a re-derivar todo lo que dependía de la estándar. Cada comprobación de autorización de debajo que asumía que el sistema sabe quién eres pasa a ser tuya de nuevo. La autenticación nunca es solo la pantalla de login; es la raíz de la que cuelgan la autorización, la auditoría y el acceso a datos.

## Las reglas son del edificio, no mías

El mismo patrón aparecía en sitios menos técnicos. Un alumno puede reservar hasta tres horas en franjas de día; el personal tiene ventanas más largas, horas más tarde, y acceso a las salas interactivas grandes que los alumnos no pueden reservar. Hay un flujo de aprobación, un sistema de sanciones graduado para quien no se presenta de forma repetida, y un registro de auditoría de quién hizo qué. No inventé ninguno de esos límites. Codifican cómo la universidad gestiona de verdad sus espacios, y mi trabajo era modelarlos fielmente, no opinar sobre ellos. Construir software para una institución es en gran parte el trabajo de traducir un conjunto de reglas que ya existe en algo que un sistema pueda hacer cumplir sin perder la intención que había detrás.

Y luego está la parte poco vistosa que acaba siendo la que más importa. Una reserva confirmada escribe un evento real en un calendario de Outlook a través de la Graph API; las notificaciones salen por la propia infraestructura de correo de la universidad para que pasen los filtros de spam; cinco idiomas, porque los alumnos no leen todos en español. Nada de eso impresiona por separado, pero junto es la línea entre una demo y algo a lo que una institución le pone su nombre.

## Qué me llevé

Si SAM me enseñó que el harness alrededor del modelo es donde se esconde la dificultad, LinceReservations me enseñó la misma forma un nivel por encima. Cuando construyes para una institución, la ingeniería interesante no está en el código que eres libre de escribir; está en adaptarte con limpieza a todo lo que no eres libre de cambiar. La identidad que heredas, las reglas que no son tuyas, el calendario que tiene que ser el de verdad.

No lo voy a exagerar. No está implantada, la hizo un solo estudiante, y sé exactamente por dónde seguiría endureciéndola antes de que existieran cuentas reales, empezando por el trabajo de auth y de protección contra abuso que exigiría un despliegue. Pero adopte la universidad la plataforma o no, de lo que me alegro es de haber diseñado todo bajo restricciones que yo no elegí, y eso acabó sintiéndose más a ingeniería de verdad que cualquier proyecto en el que puse yo las reglas.
