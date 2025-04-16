// Script de diagnóstico para problemas de Tailwind CSS en Astro
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}=== DIAGNÓSTICO DE TAILWIND CSS EN ASTRO ===${colors.reset}\n`);

// 1. Verificar archivos de configuración
console.log(`${colors.blue}[1] Verificando archivos de configuración...${colors.reset}`);

const configFiles = [
  { path: 'astro.config.mjs', required: true },
  { path: 'tailwind.config.cjs', required: true },
  { path: 'src/styles/global.css', required: false },
  { path: 'src/styles/tailwind.css', required: false }
];

let allConfigFilesExist = true;

configFiles.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`  ✅ ${file.path} encontrado`);
  } else if (file.required) {
    console.log(`  ❌ ${file.path} NO encontrado (requerido)`);
    allConfigFilesExist = false;
  } else {
    console.log(`  ⚠️ ${file.path} NO encontrado (opcional)`);
  }
});

if (!allConfigFilesExist) {
  console.log(`\n${colors.red}❌ Faltan archivos de configuración requeridos. Soluciona esto primero.${colors.reset}`);
  process.exit(1);
}

// 2. Verificar la configuración de Tailwind
console.log(`\n${colors.blue}[2] Verificando configuración de Tailwind...${colors.reset}`);

try {
  const tailwindConfig = fs.readFileSync(path.join(__dirname, 'tailwind.config.cjs'), 'utf-8');
  
  // Verificar que el content incluya los archivos Astro
  if (tailwindConfig.includes('.astro')) {
    console.log('  ✅ La configuración incluye archivos .astro en content');
  } else {
    console.log('  ❌ La configuración NO incluye archivos .astro en content');
  }
  
  // Verificar que no haya errores de sintaxis obvios
  if (tailwindConfig.includes('module.exports')) {
    console.log('  ✅ La configuración tiene el formato correcto (module.exports)');
  } else {
    console.log('  ❌ La configuración NO tiene el formato correcto (falta module.exports)');
  }
} catch (error) {
  console.log(`  ❌ Error al leer tailwind.config.cjs: ${error.message}`);
}

// 3. Verificar la configuración de Astro
console.log(`\n${colors.blue}[3] Verificando configuración de Astro...${colors.reset}`);

try {
  const astroConfig = fs.readFileSync(path.join(__dirname, 'astro.config.mjs'), 'utf-8');
  
  // Verificar que la integración de Tailwind esté configurada
  if (astroConfig.includes('@astrojs/tailwind') && astroConfig.includes('tailwind()')) {
    console.log('  ✅ La integración de Tailwind está configurada correctamente');
  } else {
    console.log('  ❌ La integración de Tailwind NO está configurada correctamente');
  }
} catch (error) {
  console.log(`  ❌ Error al leer astro.config.mjs: ${error.message}`);
}

// 4. Verificar las importaciones de estilos
console.log(`\n${colors.blue}[4] Verificando importaciones de estilos...${colors.reset}`);

// Verificar global.css
try {
  const globalCss = fs.readFileSync(path.join(__dirname, 'src/styles/global.css'), 'utf-8');
  
  if (globalCss.includes('@import') && globalCss.includes('tailwind.css')) {
    console.log('  ✅ global.css importa tailwind.css');
  } else if (globalCss.includes('@tailwind')) {
    console.log('  ✅ global.css incluye directivas @tailwind');
  } else {
    console.log('  ❌ global.css NO importa Tailwind correctamente');
  }
} catch (error) {
  console.log(`  ⚠️ No se pudo leer src/styles/global.css: ${error.message}`);
}

// Verificar tailwind.css si existe
try {
  const tailwindCss = fs.readFileSync(path.join(__dirname, 'src/styles/tailwind.css'), 'utf-8');
  
  if (tailwindCss.includes('@tailwind base') && 
      tailwindCss.includes('@tailwind components') && 
      tailwindCss.includes('@tailwind utilities')) {
    console.log('  ✅ tailwind.css incluye todas las directivas necesarias');
  } else {
    console.log('  ❌ tailwind.css NO incluye todas las directivas necesarias');
  }
} catch (error) {
  console.log(`  ⚠️ No se pudo leer src/styles/tailwind.css: ${error.message}`);
}

// 5. Verificar que los layouts importen los estilos
console.log(`\n${colors.blue}[5] Verificando importaciones en layouts...${colors.reset}`);

const layouts = [
  'src/layouts/Layout.astro',
  'src/layouts/Base.astro'
];

layouts.forEach(layoutPath => {
  try {
    const layout = fs.readFileSync(path.join(__dirname, layoutPath), 'utf-8');
    
    if (layout.includes("import '../styles/global.css'")) {
      console.log(`  ✅ ${layoutPath} importa global.css`);
    } else {
      console.log(`  ❌ ${layoutPath} NO importa global.css`);
    }
  } catch (error) {
    console.log(`  ⚠️ No se pudo leer ${layoutPath}: ${error.message}`);
  }
});

// 6. Verificar la versión de las dependencias
console.log(`\n${colors.blue}[6] Verificando versiones de dependencias...${colors.reset}`);

try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
  
  const dependencies = {
    astro: packageJson.dependencies?.astro || 'no instalado',
    tailwindcss: packageJson.dependencies?.tailwindcss || 'no instalado',
    '@astrojs/tailwind': packageJson.dependencies?.['@astrojs/tailwind'] || 'no instalado'
  };
  
  console.log(`  📦 astro: ${dependencies.astro}`);
  console.log(`  📦 tailwindcss: ${dependencies.tailwindcss}`);
  console.log(`  📦 @astrojs/tailwind: ${dependencies['@astrojs/tailwind']}`);
  
  // Verificar compatibilidad
  const astroVersion = dependencies.astro.replace('^', '').replace('~', '');
  const tailwindVersion = dependencies.tailwindcss.replace('^', '').replace('~', '');
  const integrationVersion = dependencies['@astrojs/tailwind'].replace('^', '').replace('~', '');
  
  if (astroVersion.startsWith('2') && integrationVersion.startsWith('3')) {
    console.log('  ✅ Las versiones de astro y @astrojs/tailwind son compatibles');
  } else {
    console.log('  ⚠️ Posible incompatibilidad entre versiones de astro y @astrojs/tailwind');
  }
} catch (error) {
  console.log(`  ❌ Error al leer package.json: ${error.message}`);
}

// 7. Verificar la salida generada
console.log(`\n${colors.blue}[7] Verificando archivos generados...${colors.reset}`);

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('  ⚠️ El directorio dist no existe. Ejecuta "npm run build" primero.');
} else {
  // Buscar archivos CSS
  let foundTailwindCSS = false;
  
  function findCssFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findCssFiles(filePath);
      } else if (path.extname(file) === '.css') {
        const cssContent = fs.readFileSync(filePath, 'utf-8');
        
        // Buscar huellas típicas de Tailwind en el CSS
        if (cssContent.includes('.bg-') || 
            cssContent.includes('.text-') || 
            cssContent.includes('.flex') || 
            cssContent.includes('.grid')) {
          console.log(`  ✅ Encontrado CSS de Tailwind en: ${path.relative(__dirname, filePath)}`);
          foundTailwindCSS = true;
        }
      }
    }
  }
  
  try {
    findCssFiles(distDir);
    
    if (!foundTailwindCSS) {
      console.log('  ❌ No se encontró CSS de Tailwind en los archivos generados');
    }
  } catch (error) {
    console.log(`  ❌ Error al buscar archivos CSS: ${error.message}`);
  }
}

// 8. Recomendaciones finales
console.log(`\n${colors.cyan}=== RECOMENDACIONES ===${colors.reset}`);
console.log(`
1. Asegúrate de que la integración de Tailwind esté correctamente configurada en astro.config.mjs
2. Verifica que tailwind.config.cjs incluya todos los archivos relevantes en 'content'
3. Comprueba que las directivas de Tailwind (@tailwind base/components/utilities) estén presentes
4. Asegúrate de que todos los layouts importen el archivo CSS que contiene las directivas de Tailwind
5. Verifica que las versiones de astro, tailwindcss y @astrojs/tailwind sean compatibles
6. Intenta ejecutar "npm run build" y verifica que el CSS de Tailwind se genere correctamente
7. Si todo lo anterior está correcto, prueba con "npm run dev" para ver si los estilos se aplican en desarrollo
`);

console.log(`${colors.cyan}=== FIN DEL DIAGNÓSTICO ===${colors.reset}`);
