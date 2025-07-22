import * as XLSX from 'xlsx'

// Tipos para exportación
export interface ExportOptions {
  filename?: string
  sheetName?: string
  title?: string
}

// Función para exportar a Excel
export const exportToExcel = (data: any[], options: ExportOptions = {}) => {
  const {
    filename = 'export',
    sheetName = 'Datos',
    title
  } = options

  // Crear un nuevo libro de trabajo
  const workbook = XLSX.utils.book_new()

  // Preparar los datos para Excel
  let excelData = data

  // Si hay un título, agregarlo como primera fila
  if (title) {
    excelData = [
      [title],
      [], // Fila vacía para separar
      ...data
    ]
  }

  // Crear la hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(excelData, { skipHeader: true })

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Generar el archivo y descargarlo
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

// Función simplificada para exportar a PDF (HTML)
export const exportToPDFSimple = (
  data: any[],
  columns: { header: string; dataKey: string }[],
  options: ExportOptions = {}
) => {
  const {
    filename = 'export',
    title = 'Reporte'
  } = options

  // Crear contenido HTML para el PDF
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #4285f4; padding-bottom: 10px; }
        .date { color: #666; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #4285f4; color: white; padding: 8px; text-align: left; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        .chip {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin: 2px;
        }
        .chip-success { background-color: #e8f5e8; color: #2e7d32; border: 1px solid #4caf50; }
        .chip-info { background-color: #e3f2fd; color: #1565c0; border: 1px solid #2196f3; }
        .chip-warning { background-color: #fff3e0; color: #ef6c00; border: 1px solid #ff9800; }
        .chip-primary { background-color: #e8eaf6; color: #3f51b5; border: 1px solid #3f51b5; }
        .chip-error { background-color: #ffebee; color: #c62828; border: 1px solid #f44336; }
        .chip-outlined { background-color: transparent; color: #666; border: 1px solid #ddd; }
        .arrow { color: #666; margin: 0 4px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="date">Generado el: ${new Date().toLocaleDateString()}</div>
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr>
              ${columns.map(col => `<td>${item[col.dataKey] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        Reporte generado automáticamente por Hotel Carita
      </div>
    </body>
    </html>
  `

  // Crear blob y descargar
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.html`
  a.click()
  URL.revokeObjectURL(url)
}

// Función específica para exportar historial de habitaciones
export const exportHistorial = (historial: any[], format: 'excel' | 'pdf') => {
  const columns = [
    { header: 'Fecha', dataKey: 'fecha' },
    { header: 'Hora', dataKey: 'hora' },
    { header: 'Habitación', dataKey: 'habitacionNombre' },
    { header: 'Tipo de Movimiento', dataKey: 'tipoMovimiento' },
    { header: 'Estado Anterior', dataKey: 'estadoAnterior' },
    { header: 'Estado Nuevo', dataKey: 'estadoNuevo' },
    { header: 'Huésped', dataKey: 'huespedNombre' },
    { header: 'Documento Huésped', dataKey: 'huespedDocumento' },
    { header: 'Observaciones', dataKey: 'observaciones' },
    { header: 'Usuario', dataKey: 'usuario' }
  ]

  const filename = `historial-habitaciones-${new Date().toISOString().split('T')[0]}`
  const title = 'Historial de Habitaciones'

  // Función para formatear el tipo de movimiento
  const formatearTipoMovimiento = (tipo: string) => {
    const tipos = {
      'check_in': 'Check-In',
      'check_out': 'Check-Out',
      'cambio_estado': 'Cambio Estado',
      'reserva': 'Reserva',
      'cancelacion': 'Cancelación'
    }
    return tipos[tipo as keyof typeof tipos] || tipo
  }

  if (format === 'excel') {
    // Preparar datos para Excel
    const excelData = historial.map(registro => ({
      Fecha: new Date(registro.fecha).toLocaleDateString('es-ES'),
      Hora: registro.hora,
      Habitación: registro.habitacionNombre,
      'Tipo de Movimiento': formatearTipoMovimiento(registro.tipoMovimiento),
      'Estado Anterior': registro.estadoAnterior || '-',
      'Estado Nuevo': registro.estadoNuevo || '-',
      Huésped: registro.huespedNombre || '-',
      'Documento Huésped': registro.huespedDocumento || '-',
      Observaciones: registro.observaciones || '-',
      Usuario: registro.usuario || '-'
    }))

    exportToExcel(excelData, {
      filename,
      sheetName: 'Historial',
      title
    })
  } else {
    // Preparar datos para PDF con formato especial
    const pdfData = historial.map(registro => {
      // Crear descripción del cambio de estado
      let cambioEstado = '-'
      if (registro.estadoAnterior && registro.estadoNuevo) {
        cambioEstado = `${registro.estadoAnterior} → ${registro.estadoNuevo}`
      } else if (registro.estadoNuevo) {
        cambioEstado = registro.estadoNuevo
      }

      // Crear información del huésped
      let infoHuesped = '-'
      if (registro.huespedNombre) {
        infoHuesped = `${registro.huespedNombre}${registro.huespedDocumento ? ` (${registro.huespedDocumento})` : ''}`
      }

      return {
        fecha: new Date(registro.fecha).toLocaleDateString('es-ES'),
        hora: registro.hora,
        habitacionNombre: registro.habitacionNombre,
        tipoMovimiento: formatearTipoMovimiento(registro.tipoMovimiento),
        cambioEstado: cambioEstado,
        infoHuesped: infoHuesped,
        observaciones: registro.observaciones || 'Sin observaciones',
        usuario: registro.usuario || 'Sistema'
      }
    })

    // Columnas simplificadas para PDF
    const pdfColumns = [
      { header: 'Fecha', dataKey: 'fecha' },
      { header: 'Hora', dataKey: 'hora' },
      { header: 'Habitación', dataKey: 'habitacionNombre' },
      { header: 'Tipo de Movimiento', dataKey: 'tipoMovimiento' },
      { header: 'Cambio de Estado', dataKey: 'cambioEstado' },
      { header: 'Huésped', dataKey: 'infoHuesped' },
      { header: 'Observaciones', dataKey: 'observaciones' },
      { header: 'Usuario', dataKey: 'usuario' }
    ]

    exportToPDFSimple(pdfData, pdfColumns, {
      filename,
      title
    })
  }
}

// Función para exportar estadísticas del historial
export const exportEstadisticasHistorial = (historial: any[], format: 'excel' | 'pdf') => {
  const filename = `estadisticas-historial-${new Date().toISOString().split('T')[0]}`
  const title = 'Estadísticas del Historial de Habitaciones'

  // Calcular estadísticas
  const totalRegistros = historial.length
  const checkIns = historial.filter(h => h.tipoMovimiento === 'check_in').length
  const checkOuts = historial.filter(h => h.tipoMovimiento === 'check_out').length
  const reservas = historial.filter(h => h.tipoMovimiento === 'reserva').length
  const cancelaciones = historial.filter(h => h.tipoMovimiento === 'cancelacion').length
  const cambiosEstado = historial.filter(h => h.tipoMovimiento === 'cambio_estado').length

  // Obtener habitaciones únicas
  const habitacionesUnicas = [...new Set(historial.map(h => h.habitacionNombre))].length

  // Obtener huéspedes únicos
  const huespedesUnicos = [...new Set(historial.filter(h => h.huespedNombre).map(h => h.huespedNombre))].length

  // Obtener usuarios únicos
  const usuariosUnicos = [...new Set(historial.filter(h => h.usuario).map(h => h.usuario))].length

  if (format === 'excel') {
    const excelData = [
      { 'Métrica': 'Total de Registros', 'Valor': totalRegistros },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'Check-Ins', 'Valor': checkIns },
      { 'Métrica': 'Check-Outs', 'Valor': checkOuts },
      { 'Métrica': 'Reservas', 'Valor': reservas },
      { 'Métrica': 'Cancelaciones', 'Valor': cancelaciones },
      { 'Métrica': 'Cambios de Estado', 'Valor': cambiosEstado },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'Habitaciones Involucradas', 'Valor': habitacionesUnicas },
      { 'Métrica': 'Huéspedes Únicos', 'Valor': huespedesUnicos },
      { 'Métrica': 'Usuarios del Sistema', 'Valor': usuariosUnicos }
    ]

    exportToExcel(excelData, {
      filename,
      sheetName: 'Estadísticas',
      title
    })
  } else {
    const pdfData = [
      {
        metrica: 'Total de Registros',
        valor: totalRegistros
      },
      {
        metrica: 'Check-Ins',
        valor: checkIns
      },
      {
        metrica: 'Check-Outs',
        valor: checkOuts
      },
      {
        metrica: 'Reservas',
        valor: reservas
      },
      {
        metrica: 'Cancelaciones',
        valor: cancelaciones
      },
      {
        metrica: 'Cambios de Estado',
        valor: cambiosEstado
      },
      {
        metrica: 'Habitaciones Involucradas',
        valor: habitacionesUnicas
      },
      {
        metrica: 'Huéspedes Únicos',
        valor: huespedesUnicos
      },
      {
        metrica: 'Usuarios del Sistema',
        valor: usuariosUnicos
      }
    ]

    exportToPDFSimple(pdfData, [
      { header: 'Métrica', dataKey: 'metrica' },
      { header: 'Valor', dataKey: 'valor' }
    ], {
      filename,
      title
    })
  }
}
