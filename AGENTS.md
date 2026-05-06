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

## Git Conventions

This project follows the **[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)** specification for all commit messages.

### Commit Message Structure

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description |
|------|-------------|
| `feat` | Introduces a new feature (correlates with **MINOR** in SemVer) |
| `fix` | Patches a bug (correlates with **PATCH** in SemVer) |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons, etc. — no logic change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `build` | Changes to the build system or external dependencies |
| `ci` | Changes to CI/CD configuration files and scripts |
| `chore` | Other changes that don't modify source or test files |
| `revert` | Reverts a previous commit |

### Scope (optional)

Provide contextual information about which part of the codebase is affected, enclosed in parentheses:

```
feat(leads): add score calculation on creation
fix(auth): correct token expiration handling
refactor(dashboard): extract metrics aggregation logic
```

Valid scopes for this project: `leads`, `auth`, `citas`, `ventas`, `interacciones`, `dashboard`, `webhooks`, `n8n`, `db`.

### Breaking Changes

Mark breaking changes with `!` after the type/scope, or include a `BREAKING CHANGE:` footer:

```
feat(api)!: rename lead status field

BREAKING CHANGE: `estado` field renamed to `status` in Lead entity response.
```

### Rules

- The description MUST immediately follow the `type:` prefix (lowercase, imperative mood, no period at the end).
- The body, if present, MUST begin one blank line after the description.
- Footers MUST begin one blank line after the body.
- Use `-` instead of spaces in footer tokens (e.g., `Reviewed-by:`).
- `BREAKING CHANGE` footer token MUST be uppercase.
- Each commit should represent a single logical change — if a commit covers multiple concerns, split it.

### Examples

```bash
# New feature
feat(leads): add pagination to lead listing

# Bug fix
fix(auth): resolve JWT expiration not refreshing session

# Breaking change with footer
feat(leads)!: replace score field with scoring object

BREAKING CHANGE: the `score` number field is now a nested object with `value` and `reason`.

# Docs
docs: update AGENTS.md with git conventions

# Revert
revert: let us never again speak of the broken migration

Refs: 676104e, a215868
```

### SemVer Mapping

| Commit type | SemVer bump |
|-------------|-------------|
| `fix` | PATCH |
| `feat` | MINOR |
| `BREAKING CHANGE` | MAJOR |

## Documentación

Actualmente no existen archivos de documentación adicionales. Si se agregan, enlázalos aquí para referencia rápida.

---

Este archivo debe mantenerse actualizado para reflejar cambios importantes en la arquitectura, dependencias o convenciones del proyecto.
