import { Page, Locator } from '@playwright/test';

/**
 * Utilidades para verificar estilos de Tailwind en pruebas
 */
export class TailwindTestUtils {
  /**
   * Verifica si un elemento tiene una clase específica de Tailwind
   * @param element El localizador del elemento a verificar
   * @param className La clase de Tailwind a buscar
   * @returns true si el elemento tiene la clase, false en caso contrario
   */
  static async hasClass(element: Locator, className: string): Promise<boolean> {
    return element.evaluate((el, className) => {
      return el.classList.contains(className);
    }, className);
  }

  /**
   * Obtiene los estilos computados de un elemento
   * @param element El localizador del elemento
   * @param properties Las propiedades CSS a obtener
   * @returns Un objeto con las propiedades CSS solicitadas
   */
  static async getComputedStyles(element: Locator, properties: string[]): Promise<Record<string, string>> {
    return element.evaluate((el, properties) => {
      const styles = window.getComputedStyle(el);
      return properties.reduce((acc, prop) => {
        acc[prop] = styles.getPropertyValue(prop);
        return acc;
      }, {} as Record<string, string>);
    }, properties);
  }

  /**
   * Verifica si un color CSS coincide con un color de Tailwind
   * @param cssColor El color CSS a verificar (formato rgb o rgba)
   * @param tailwindColorClass La clase de color de Tailwind (ej: 'bg-blue-500')
   * @returns true si los colores coinciden aproximadamente
   */
  static colorMatches(cssColor: string, tailwindColor: Record<string, string>): boolean {
    // Implementación simplificada para comparar colores
    // En una implementación real, se debería convertir correctamente entre formatos de color
    return Object.values(tailwindColor).some(color => 
      cssColor.replace(/\s/g, '') === color.replace(/\s/g, '')
    );
  }

  /**
   * Obtiene un mapa de colores comunes de Tailwind para comparaciones
   * @returns Un objeto con colores comunes de Tailwind
   */
  static getTailwindColors(): Record<string, Record<string, string>> {
    return {
      slate: {
        '900': 'rgb(15, 23, 42)',
        '400': 'rgb(148, 163, 184)',
        '100': 'rgb(241, 245, 249)'
      },
      blue: {
        '500': 'rgb(59, 130, 246)'
      },
      white: {
        'DEFAULT': 'rgb(255, 255, 255)'
      }
      // Añadir más colores según sea necesario
    };
  }
}
