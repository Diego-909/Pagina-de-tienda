# Bitácora del proyecto — CelMarket


## Cómo usamos Bootstrap
- **Componentes y para qué:** navbar colapsable (menú), card (producto), modal (detalle), offcanvas (carrito lateral), toast (aviso al agregar), formularios con `is-invalid` (contacto y checkout), badge (contador).
- **Personalizado en `marca.css`:** variables `--bs-*` (colores, tipografía, enlaces), `.btn-primary`, `.btn-outline-primary`, `.btn-warning`, navbar oscura con contraste, foco visible.
- **CSS anterior eliminado porque Bootstrap ya lo resolvía:** cabecera/menú propio, botones `.btn`, tarjetas, modal propio, tablas, formularios, aviso flotante, rejilla `auto-fill`.
- **Qué decidimos no usar y por qué:** [COMPLETAR]

## Problemas de la migración
1. Las páginas apuntaban a archivos que no existían (`css/bootstrap.min.css`, `js/bootstrap.bundle.min.js`, `css/marca.css`) y el sitio quedaba sin Bootstrap. Se copió Bootstrap a `vendor/` y todas las páginas cargan la misma ruta.
2. `.btn` propio chocaba con `.btn` de Bootstrap (colores y tamaños distintos). Se eliminó el propio y se personalizó con variables en `marca.css`.
3. El modal propio no atrapaba el foco. Se reemplazó por el modal de Bootstrap.
[Ajusten o agreguen los problemas reales que ustedes vivieron.]

## Revisión cruzada
[COMPLETAR: quién revisó y explicó qué parte.]
