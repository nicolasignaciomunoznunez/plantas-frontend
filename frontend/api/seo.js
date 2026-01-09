
export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot/i.test(userAgent.toLowerCase());
  
  if (!isBot) {
    // Redirigir a la SPA normal
    res.writeHead(302, { Location: '/' });
    return res.end();
  }
  
  // HTML para bots
  const seoHtml = `
<!DOCTYPE html>
<html lang="es-CL">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InfraExpert - Mantención Integral: Plantas de Agua, Electricidad y Climatización | Chile</title>
    <meta name="description" content="Especialistas en mantención industrial y residencial: plantas de agua, sistemas eléctricos, climatización, gas y automatización. Más de 5 años en Chile.">
    <meta name="keywords" content="mantención plantas de agua Chile, mantenimiento eléctrico industrial, climatización edificios, sistemas gas industrial">
    <link rel="canonical" href="https://infraexpert.cl">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="InfraExpert - Mantención Integral Industrial y Residencial">
    <meta property="og:description" content="Expertos en plantas de agua, electricidad, climatización, gas y automatización para Chile">
    <meta property="og:url" content="https://infraexpert.cl">
    <meta property="og:type" content="website">
    
    <!-- Tu CSS -->
    <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
    <div id="root"></div>
    
    <!-- CONTENIDO PARA BOTS -->
    <div style="display:none">
        <h1>InfraExpert - Mantención Integral Industrial y Residencial</h1>
        <h2>Especialistas en Plantas de Agua y Sistemas Industriales</h2>
        <p>Empresa chilena con más de 5 años de experiencia en mantención integral.</p>
        
        <h3>Servicios Principales:</h3>
        <ul>
            <li><strong>💧 Gestión Integral de Plantas de Agua</strong> - Mantención y optimización de plantas de agua potable</li>
            <li><strong>⚡ Mantenimiento Eléctrico Integral</strong> - Para plantas industriales y edificios</li>
            <li><strong>❄️ Sistemas de Climatización</strong> - Aire acondicionado para edificios</li>
            <li><strong>🔥 Seguridad en Sistemas de Gas</strong> - Instalación y certificación</li>
            <li><strong>🏢 Mantenimiento de Edificios</strong> - Gestión completa de infraestructura</li>
            <li><strong>🏠 Automatización Residencial</strong> - Sistemas inteligentes para hogares</li>
            <li><strong>💡 Eficiencia Energética</strong> - Auditorías y optimización</li>
            <li><strong>☀️ Paneles Solares</strong> - Instalación sistemas fotovoltaicos</li>
        </ul>
        
        <p><strong>Contacto:</strong> +56 9 37492604 | contactoinfraexpert@gmail.com | Servicio 24/7</p>
    </div>
    
    <!-- Tu JavaScript -->
    <script type="module" src="/assets/index.js"></script>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(seoHtml);
}