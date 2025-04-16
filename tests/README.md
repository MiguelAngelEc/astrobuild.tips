# Pruebas de Tailwind CSS en Astro

Este directorio contiene pruebas automatizadas para verificar que Tailwind CSS esté funcionando correctamente en el proyecto Astro.

## Estructura de pruebas

- `tailwind.spec.ts`: Pruebas básicas para verificar que Tailwind CSS esté funcionando en las páginas principales.
- `components.spec.ts`: Pruebas para verificar que los componentes tengan los estilos de Tailwind aplicados correctamente.
- `utils/tailwind-helpers.ts`: Utilidades para facilitar las pruebas de estilos de Tailwind.

## Cómo ejecutar las pruebas

Para ejecutar todas las pruebas:

```bash
npx playwright test
```

Para ejecutar una prueba específica:

```bash
npx playwright test tailwind.spec.ts
```

Para ver los resultados en modo UI:

```bash
npx playwright test --ui
```

## Instalación de navegadores

Si es la primera vez que ejecutas Playwright, necesitarás instalar los navegadores:

```bash
npx playwright install
```

## Reportes

Después de ejecutar las pruebas, puedes ver un reporte HTML detallado:

```bash
npx playwright show-report
```

## Consejos para escribir pruebas de Tailwind

1. Verifica que las clases de Tailwind estén presentes en los elementos
2. Comprueba que los estilos computados coincidan con lo esperado
3. Prueba el comportamiento responsive cambiando el tamaño del viewport
4. Verifica que los colores coincidan con la paleta de Tailwind
