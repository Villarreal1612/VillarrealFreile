// Script para inyectar variables de entorno en el HTML
const fs = require('fs');
const path = require('path');

// Leer el archivo HTML
const htmlPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Variables de entorno
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ggzyqssptaonmwxoaedw.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdnenlxc3NwdGFvbm13eG9hZWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDc4MjYsImV4cCI6MjA3MjQyMzgyNn0.u_EpXzGNFqD_M_DQ2mnofkqCoSdzDjXv09-norDHpKo';

// Script para inyectar en el HTML
const envScript = `
<script>
  // Variables de entorno inyectadas en build time
  window.VITE_SUPABASE_URL = '${SUPABASE_URL}';
  window.VITE_SUPABASE_ANON_KEY = '${SUPABASE_ANON_KEY}';
  console.log('🚀 Variables de entorno inyectadas:', {
    url: window.VITE_SUPABASE_URL,
    keyConfigured: !!window.VITE_SUPABASE_ANON_KEY
  });
</script>`;

// Inyectar el script antes del cierre del head
if (htmlContent.includes('<!-- ENV_VARS_PLACEHOLDER -->')) {
  // Reemplazar placeholder si existe
  htmlContent = htmlContent.replace('<!-- ENV_VARS_PLACEHOLDER -->', envScript);
} else {
  // Inyectar antes del cierre del head
  htmlContent = htmlContent.replace('</head>', `${envScript}\n</head>`);
}

// Escribir el archivo modificado
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('✅ Variables de entorno inyectadas en index.html');
console.log('🔧 SUPABASE_URL:', SUPABASE_URL);
console.log('🔧 SUPABASE_ANON_KEY configurada:', !!SUPABASE_ANON_KEY);