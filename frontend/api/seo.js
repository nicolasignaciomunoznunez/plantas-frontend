// frontend/api/seo.js - Edge Function
export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot/i.test(userAgent.toLowerCase());
  
  if (isBot) {
    const html = `<!DOCTYPE html>
<html lang="es-CL">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InfraExpert - Mantención Integral: Plantas de Agua, Electricidad y Climatización | Chile</title>
    <meta name="description" content="Especialistas en mantención industrial y residencial: plantas de agua, sistemas eléctricos, climatización, gas y automatización. Más de 10 años en Chile.">
    <meta name="keywords" content="mantención plantas de agua Chile, mantenimiento eléctrico industrial, climatización edificios">
    <link rel="canonical" href="https://infraexpert.cl">
    <meta name="robots" content="index, follow">
    <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
    <div id="root"></div>
    
    <div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">
        <h1>InfraExpert - Mantención Integral Industrial y Residencial</h1>
        <h2>Especialistas en Plantas de Agua y Sistemas Industriales</h2>
        <p>Empresa chilena con más de 10 años de experiencia en mantención integral: plantas de agua, sistemas eléctricos, climatización, gas y automatización.</p>
        
        <h3>Servicios Principales:</h3>
        <ul>
            <li><strong>💧 Gestión Integral de Plantas de Agua:</strong> Mantención y optimización de plantas de agua potable rurales e industriales.</li>
            <li><strong>⚡ Mantenimiento Eléctrico Integral:</strong> Para plantas industriales y edificios residenciales.</li>
            <li><strong>❄️ Sistemas de Climatización:</strong> Mantención e instalación de aires acondicionados.</li>
            <li><strong>🔥 Seguridad en Sistemas de Gas:</strong> Instalación, mantenimiento y certificación.</li>
            <li><strong>🏢 Mantenimiento de Edificios:</strong> Gestión completa de infraestructura.</li>
            <li><strong>🏠 Automatización Residencial:</strong> Sistemas inteligentes para hogares.</li>
            <li><strong>💡 Eficiencia Energética:</strong> Auditorías y optimización energética.</li>
            <li><strong>☀️ Paneles Solares:</strong> Instalación sistemas fotovoltaicos.</li>
        </ul>
        
        <p><strong>Contacto:</strong> +56 9 37492604 | contactoinfraexpert@gmail.com | Servicio 24/7</p>
    </div>
    
    <script type="module" src="/assets/index.js"></script>
</body>
</html>`;
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
  
  // Para usuarios normales, redirigir al frontend
  return Response.redirect(new URL('/', request.url), 302);
}