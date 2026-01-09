// api/seo.js - VERSIÓN CORREGIDA Y FUNCIONAL
export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot/i.test(userAgent.toLowerCase());
  
  if (isBot) {
    // HTML COMPLETO con contenido SEO
    const seoHtml = `<!DOCTYPE html>
<html lang="es-CL">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InfraExpert - Mantención Integral: Plantas de Agua, Electricidad y Climatización | Chile</title>
    <meta name="description" content="Especialistas en mantención industrial y residencial: plantas de agua, sistemas eléctricos, climatización, gas y automatización. Más de 10 años en Chile.">
    <meta name="keywords" content="mantención plantas de agua Chile, mantenimiento eléctrico industrial, climatización edificios, sistemas gas industrial, automatización residencial, eficiencia energética Chile, paneles solares instalación">
    <link rel="canonical" href="https://infraexpert.cl">
    <meta name="robots" content="index, follow">
    
    <meta property="og:title" content="InfraExpert - Mantención Integral Industrial y Residencial">
    <meta property="og:description" content="Expertos en plantas de agua, electricidad, climatización, gas y automatización para Chile">
    <meta property="og:url" content="https://infraexpert.cl">
    <meta property="og:type" content="website">
    
    <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
    <div id="root"></div>
    
    <!-- CONTENIDO PARA BOTS (Google ve esto) -->
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
        
        <h3>Palabras clave:</h3>
        <p>mantención plantas de agua Chile, plantas agua potable rural, mantenimiento eléctrico industrial, sistemas climatización edificios, instalación gas industrial Chile, mantención edificios residenciales Santiago, automatización residencial Chile, eficiencia energética industrial, paneles solares instalación</p>
        
        <h3>Zonas de Servicio:</h3>
        <p>Santiago, Valparaíso, Viña del Mar, Concepción, Talcahuano, Rancagua, Curicó, Talca y todo Chile.</p>
        
        <p><strong>Contacto:</strong> +56 9 37492604 | contactoinfraexpert@gmail.com | Servicios de emergencia 24/7</p>
    </div>
    
    <script type="module" src="/assets/index.js"></script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(seoHtml);
  } else {
    // Para usuarios normales, redirigir a SPA
    res.writeHead(302, {
      'Location': '/',
      'Cache-Control': 'no-cache'
    });
    res.end();
  }
}