const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Verificar si es bot de Google
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot/i.test(userAgent.toLowerCase());
  
  if (isBot) {
    console.log('🤖 Bot detectado:', userAgent.substring(0, 50));
    
    // HTML optimizado para SEO
    const seoHtml = `
<!DOCTYPE html>
<html lang="es-CL">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- METADATOS SEO PRINCIPALES -->
    <title>InfraExpert - Mantención Integral: Plantas de Agua, Electricidad y Climatización | Chile</title>
    <meta name="description" content="Especialistas en mantención industrial y residencial: plantas de agua, sistemas eléctricos, climatización, gas y automatización. Más de 10 años de experiencia en Chile.">
    <meta name="keywords" content="mantención plantas de agua Chile, mantenimiento eléctrico industrial, climatización edificios, sistemas gas industrial, automatización residencial, eficiencia energética Chile, paneles solares instalación">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="https://infraexpert.cl">
    
    <!-- Open Graph -->
    <meta property="og:title" content="InfraExpert - Mantención Integral Industrial y Residencial">
    <meta property="og:description" content="Expertos en plantas de agua, electricidad, climatización, gas y automatización para Chile">
    <meta property="og:url" content="https://infraexpert.cl">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="es_CL">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="InfraExpert - Mantención Integral Chile">
    <meta name="twitter:description" content="Especialistas en plantas de agua y mantenimiento industrial">
    
    <!-- Geo -->
    <meta name="geo.region" content="CL">
    <meta name="geo.placename" content="Chile">
    <meta name="geo.position" content="-33.448890; -70.669265">
    <meta name="ICBM" content="-33.448890, -70.669265">
    
    <!-- Tu CSS y JS normal -->
    <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
    <div id="root"></div>
    
    <!-- CONTENIDO VISIBLE SOLO PARA BOTS (Google ve esto) -->
    <div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">
        <h1>InfraExpert - Mantención Integral Industrial y Residencial</h1>
        
        <h2>Especialistas en Plantas de Agua y Sistemas Industriales</h2>
        <p>Empresa chilena con más de 10 años de experiencia en mantención integral: plantas de agua, sistemas eléctricos, climatización, gas y automatización.</p>
        
        <h3>Servicios Principales:</h3>
        <ul>
            <li><strong>💧 Gestión Integral de Plantas de Agua:</strong> Mantención y optimización de plantas de agua potable rurales e industriales. Nuestra especialidad principal.</li>
            <li><strong>⚡ Mantenimiento Eléctrico Integral:</strong> Para plantas industriales y edificios residenciales. Instalaciones, reparaciones y optimización.</li>
            <li><strong>❄️ Sistemas de Climatización:</strong> Mantención e instalación de aires acondicionados para edificios corporativos, industriales y residenciales.</li>
            <li><strong>🔥 Seguridad en Sistemas de Gas:</strong> Instalación, mantenimiento y certificación de redes de gas para cocinas, calefacción y procesos industriales.</li>
            <li><strong>🏢 Mantenimiento de Edificios:</strong> Gestión completa de infraestructura de edificios: áreas comunes, sistemas hidráulicos y eléctricos.</li>
            <li><strong>🏠 Automatización Residencial:</strong> Sistemas inteligentes para hogares y edificios: control de iluminación, climatización y seguridad.</li>
            <li><strong>💡 Eficiencia Energética:</strong> Auditorías y optimización energética para industrias, comercios y edificios residenciales.</li>
            <li><strong>☀️ Paneles Solares:</strong> Instalación y mantenimiento de sistemas fotovoltaicos para industrias, comercios y viviendas.</li>
        </ul>
        
        <h3>Palabras clave para SEO:</h3>
        <p>
            mantención plantas de agua Chile, plantas agua potable rural, mantenimiento eléctrico industrial, 
            sistemas climatización edificios, instalación gas industrial Chile, mantención edificios residenciales Santiago, 
            automatización residencial Chile, eficiencia energética industrial, paneles solares instalación, 
            mantención integral industrial, empresa mantención industrial Chile, servicios eléctricos para edificios,
            climatización industrial mantención, seguridad sistemas gas certificación, gestión plantas tratamiento agua
        </p>
        
        <h3>Zonas de Servicio:</h3>
        <p>Santiago, Valparaíso, Viña del Mar, Concepción, Talcahuano, Rancagua, Curicó, Talca y todo Chile.</p>
        
        <p><strong>Contacto:</strong> +56 9 37492604 | contactoinfraexpert@gmail.com | Servicios de emergencia 24/7</p>
        
        <h3>Nuestra Experiencia:</h3>
        <p>Más de 50 proyectos ejecutados en plantas de agua, 100+ edificios con mantención regular, 30+ instalaciones de paneles solares. Certificados en seguridad eléctrica y gas.</p>
    </div>
    
    <!-- Tu JavaScript normal -->
    <script type="module" src="/assets/index.js"></script>
</body>
</html>`;
    
    res.writeHead(200, { 
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600'
    });
    res.end(seoHtml);
  } else {
    // Para usuarios normales, servir el archivo normal
    try {
      const normalHtml = fs.readFileSync(
        path.join(__dirname, 'dist/index.html'), 
        'utf8'
      );
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(normalHtml);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading page');
    }
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor SEO escuchando en puerto ${PORT}`);
  console.log(`📌 URL: http://localhost:${PORT}`);
  console.log(`📌 Para producción: Configurar en Vercel Edge Functions`);
});