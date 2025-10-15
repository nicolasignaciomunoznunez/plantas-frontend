import TarjetaReporte from './TarjetaReporte';

export default function ListaReportes({ reportes, plantas, onDescargarReporte, onEliminarReporte, loading, puedeGestionar }) {
  if (loading && reportes.length === 0) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 sm:w-1/4"></div>
              <div className="h-7 sm:h-8 bg-gray-200 rounded w-20 sm:w-24"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reportes.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
        <div className="text-gray-300 text-4xl sm:text-6xl mb-3 sm:mb-4">
          <i className="fas fa-chart-bar"></i>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">No hay reportes generados</h3>
        <p className="text-gray-500 text-sm sm:text-base">Genera el primer reporte para verlo aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {reportes.map((reporte) => (
        <TarjetaReporte
          key={reporte.id}
          reporte={reporte}
          plantas={plantas}
          onDescargarReporte={onDescargarReporte}
          onEliminarReporte={onEliminarReporte}
          puedeGestionar={puedeGestionar}
        />
      ))}
    </div>
  );
}