# Instrucciones para Agentes de IA

Este archivo proporciona instrucciones concisas y en español para agentes de IA que colaboran en este proyecto. Su objetivo es facilitar la productividad inmediata y mantener la coherencia con las convenciones del proyecto.

## Descripción general

Este proyecto es un sitio web de presentación para Webcol, una empresa dedicada al desarrollo de software, automatización con n8n, agentes de IA y APIs en diversos lenguajes (Java, Python, C#, PHP), así como integraciones bancarias.

## Arquitectura y principios de diseño

El desarrollo sigue una **arquitectura hexagonal (Ports & Adapters)** orientada a mantener el sistema desacoplado y preparado para una futura migración a microservicios.

### Arquitectura hexagonal

- El **dominio** (lógica de negocio) es el núcleo: no depende de frameworks, bases de datos ni infraestructura externa.
- Los **puertos** definen contratos (interfaces) que el dominio expone o consume.
- Los **adaptadores** implementan esos contratos para conectar con el mundo exterior (HTTP, base de datos, APIs de terceros, n8n, etc.).
- Estructura de carpetas sugerida al escalar:
  ```
  src/
    Domain/         # Entidades, value objects, lógica de negocio pura
    Application/    # Casos de uso (servicios de aplicación)
    Infrastructure/ # Adaptadores: controladores HTTP, repositorios, clientes externos
    Ports/          # Interfaces e contratos
  ```

### Clean Code

- Funciones y métodos con una única responsabilidad y nombre descriptivo.
- Sin comentarios que expliquen código confuso; el código debe ser autoexplicativo.
- Sin números mágicos: usar constantes con nombre.
- Evitar lógica duplicada (principio DRY).

### Principios SOLID (aplicar cuando corresponda)

- **S** — Single Responsibility: cada clase o módulo tiene una sola razón de cambio.
- **O** — Open/Closed: abierto a extensión, cerrado a modificación.
- **L** — Liskov Substitution: las implementaciones deben poder reemplazar sus interfaces sin romper el sistema.
- **I** — Interface Segregation: interfaces pequeñas y específicas en lugar de contratos genéricos.
- **D** — Dependency Inversion: depender de abstracciones, nunca de implementaciones concretas.

### Patrones de diseño

- Usar patrones reconocidos (Repository, Factory, Strategy, Adapter, Observer, etc.) solo cuando aporten claridad real, no por convención.
- Documentar brevemente el patrón aplicado en el bloque de código correspondiente.

### Preparación para microservicios

- Cada módulo funcional debe poder extraerse como servicio independiente sin refactorización profunda.
- La comunicación entre módulos debe realizarse a través de interfaces o eventos, nunca mediante llamadas directas a implementaciones concretas.
- Evitar estado compartido entre módulos; preferir mensajes o contratos explícitos.
- Las integraciones externas (n8n, APIs bancarias, IA) se encapsulan en adaptadores intercambiables.

## Convenciones y buenas prácticas

- El código fuente principal está en `index.php`.
- El sitio utiliza Tailwind CSS y Lucide Icons vía CDN.
- El idioma principal es español.
- Mantén los comentarios y documentación en español.
- Usa nombres descriptivos y consistentes para variables y funciones.
- Prioriza la claridad y la mantenibilidad del código.

## Recomendaciones para agentes

- Antes de realizar cambios, revisa la estructura y configuración de Tailwind en el archivo principal.
- Al agregar funcionalidad, identifica si pertenece al dominio, a la aplicación o a la infraestructura y ubícala en la capa correspondiente.
- No mezcles lógica de negocio con lógica de presentación o acceso a datos.
- Si agregas nuevas dependencias, documenta su propósito y uso.
- Si el proyecto crece, considera separar instrucciones específicas en archivos adicionales (por ejemplo, para backend, frontend o automatización).

## Documentación

Actualmente no existen archivos de documentación adicionales. Si se agregan, enlázalos aquí para referencia rápida.

---

Este archivo debe mantenerse actualizado para reflejar cambios importantes en la arquitectura, dependencias o convenciones del proyecto.
