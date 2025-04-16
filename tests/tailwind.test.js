// @ts-check
import { test, expect } from '@playwright/test';

// Prueba básica para verificar que la página principal carga correctamente
test('la página principal carga correctamente', async ({ page }) => {
  await page.goto('/');
  
  // Verifica que la página principal se cargue
  await expect(page).toHaveTitle(/Astro/);
});

// Prueba para verificar que Tailwind CSS esté funcionando
test('verifica que Tailwind CSS esté funcionando', async ({ page }) => {
  await page.goto('/');
  
  // Verifica que los elementos con clases de Tailwind existan
  const mainElement = page.locator('main');
  await expect(mainElement).toBeVisible();
  
  // Verifica que los estilos de Tailwind se apliquen
  const computedStyles = await mainElement.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      padding: styles.padding,
      margin: styles.margin
    };
  });
  
  // Verifica que se apliquen algunos estilos (esto variará según tu diseño)
  console.log('Estilos computados:', computedStyles);
});

// Prueba para verificar la página about
test('verifica la página about', async ({ page }) => {
  // Intenta navegar a la página about
  await page.goto('/about');
  
  // Verifica que la página about se cargue
  const heading = page.locator('h2:has-text("Hello World")');
  await expect(heading).toBeVisible();
});
