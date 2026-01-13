   import { defineConfig, globalIgnores } from 'eslint/config';
   import nextVitals from 'eslint-config-next/core-web-vitals'; // Importando regras padrões do NextJs

   const eslintConfig = defineConfig([
   ...nextVitals, // Usando regras do NextJs
   globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**']), // Lista de exceções para não verificar.
   ]);

   export default eslintConfig;