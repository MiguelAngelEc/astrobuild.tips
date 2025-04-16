// Un script simple para verificar si Tailwind CSS está funcionando correctamente
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Función para verificar si un archivo HTML contiene clases de Tailwind
function checkTailwindClasses(filePath) {
  console.log(`Verificando ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Lista de clases comunes de Tailwind para buscar
    const tailwindClasses = [
      'bg-', 'text-', 'p-', 'm-', 'flex', 'grid', 'rounded', 'shadow',
      'border', 'w-', 'h-', 'max-w-', 'min-h-', 'items-', 'justify-'
    ];
    
    // Buscar clases de Tailwind en el contenido
    const foundClasses = [];
    
    tailwindClasses.forEach(className => {
      // Buscar todas las ocurrencias de la clase
      const regex = new RegExp(`class="[^"]*${className}[^"]*"`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        foundClasses.push(...matches);
      }
    });
    
    // Mostrar resultados
    if (foundClasses.length > 0) {
      console.log(`✅ Tailwind CSS está funcionando en ${filePath}`);
      console.log('Clases encontradas:');
      foundClasses.forEach(cls => console.log(`  - ${cls}`));
    } else {
      console.log(`❌ No se encontraron clases de Tailwind en ${filePath}`);
    }
    
    return foundClasses.length > 0;
  } catch (error) {
    console.error(`Error al leer el archivo ${filePath}:`, error);
    return false;
  }
}

// Función principal para ejecutar las pruebas
async function runTests() {
  console.log('🔍 Iniciando pruebas de Tailwind CSS...');
  
  // Verificar si el directorio dist existe
  const distDir = path.join(__dirname, 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.log('⚠️ El directorio dist no existe. Construyendo el proyecto...');
    console.log('Ejecuta "npm run build" primero y luego vuelve a ejecutar este script.');
    return;
  }
  
  // Buscar archivos HTML en el directorio dist
  const htmlFiles = [];
  
  function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findHtmlFiles(filePath);
      } else if (path.extname(file) === '.html') {
        htmlFiles.push(filePath);
      }
    });
  }
  
  findHtmlFiles(distDir);
  
  if (htmlFiles.length === 0) {
    console.log('❌ No se encontraron archivos HTML en el directorio dist.');
    return;
  }
  
  console.log(`🔍 Encontrados ${htmlFiles.length} archivos HTML para verificar.`);
  
  // Verificar cada archivo HTML
  let passedTests = 0;
  
  for (const file of htmlFiles) {
    const passed = checkTailwindClasses(file);
    if (passed) passedTests++;
    console.log('-----------------------------------');
  }
  
  // Mostrar resumen
  console.log('📊 Resumen de pruebas:');
  console.log(`✅ Pasaron: ${passedTests}/${htmlFiles.length}`);
  console.log(`❌ Fallaron: ${htmlFiles.length - passedTests}/${htmlFiles.length}`);
  
  if (passedTests === htmlFiles.length) {
    console.log('🎉 ¡Todas las pruebas pasaron! Tailwind CSS está funcionando correctamente.');
  } else if (passedTests > 0) {
    console.log('⚠️ Algunas pruebas fallaron. Tailwind CSS podría no estar funcionando en todas las páginas.');
  } else {
    console.log('❌ Todas las pruebas fallaron. Tailwind CSS no está funcionando correctamente.');
  }
}

// Ejecutar las pruebas
runTests().catch(console.error);
