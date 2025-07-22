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
        .chip-error { background-color: #ffebee; color: #c62828; border: 1px solid #f44336; }
        .chip-warning { background-color: #fff3e0; color: #ef6c00; border: 1px solid #ff9800; }
        .chip-info { background-color: #e3f2fd; color: #1565c0; border: 1px solid #2196f3; }
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

// Función específica para exportar habitaciones
export const exportHabitaciones = (habitaciones: any[], format: 'excel' | 'pdf') => {
  const columns = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Nombre', dataKey: 'name' },
    { header: 'Precio por Noche', dataKey: 'precio' },
    { header: 'Estado', dataKey: 'estado' },
    { header: 'Fecha Reserva', dataKey: 'fechaReserva' },
    { header: 'Hora Reserva', dataKey: 'horaReserva' },
    { header: 'Huésped', dataKey: 'huespedNombre' },
    { header: 'Documento Huésped', dataKey: 'huespedDocumento' },
    { header: 'Fecha Check-In', dataKey: 'fechaCheckIn' },
    { header: 'Hora Check-In', dataKey: 'horaCheckIn' }
  ]

  const filename = `habitaciones-${new Date().toISOString().split('T')[0]}`
  const title = 'Reporte de Habitaciones'

  // Función para formatear el estado
  const formatearEstado = (estado: string) => {
    const estados = {
      'ocupada': 'Ocupada',
      'vacia': 'Vacía',
      'en-limpieza': 'En Limpieza',
      'reservada': 'Reservada'
    }
    return estados[estado as keyof typeof estados] || estado
  }

  if (format === 'excel') {
    // Preparar datos para Excel
    const excelData = habitaciones.map(habitacion => ({
      ID: habitacion.id,
      Nombre: habitacion.name,
      'Precio por Noche': habitacion.precio ? `S/. ${habitacion.precio.toFixed(2)}` : '-',
      Estado: formatearEstado(habitacion.estado),
      'Fecha Reserva': habitacion.fechaReserva || '-',
      'Hora Reserva': habitacion.horaReserva || '-',
      Huésped: habitacion.huespedNombre || '-',
      'Documento Huésped': habitacion.huespedDocumento || '-',
      'Fecha Check-In': habitacion.fechaCheckIn || '-',
      'Hora Check-In': habitacion.horaCheckIn || '-'
    }))

    exportToExcel(excelData, {
      filename,
      sheetName: 'Habitaciones',
      title
    })
  } else {
    // Preparar datos para PDF
    const pdfData = habitaciones.map(habitacion => {
      // Crear información de reserva
      let infoReserva = '-'
      if (habitacion.estado === 'reservada' && habitacion.fechaReserva && habitacion.horaReserva) {
        infoReserva = `${habitacion.fechaReserva} ${habitacion.horaReserva}`
      }

      // Crear información del huésped
      let infoHuesped = '-'
      if (habitacion.huespedNombre) {
        infoHuesped = `${habitacion.huespedNombre}${habitacion.huespedDocumento ? ` (${habitacion.huespedDocumento})` : ''}`
      }

      // Crear información de check-in
      let infoCheckIn = '-'
      if (habitacion.fechaCheckIn && habitacion.horaCheckIn) {
        infoCheckIn = `${habitacion.fechaCheckIn} ${habitacion.horaCheckIn}`
      }

      return {
        id: habitacion.id,
        name: habitacion.name,
        precio: habitacion.precio ? `S/. ${habitacion.precio.toFixed(2)}` : 'Sin precio',
        estado: formatearEstado(habitacion.estado),
        infoReserva: infoReserva,
        infoHuesped: infoHuesped,
        infoCheckIn: infoCheckIn
      }
    })

    // Columnas simplificadas para PDF
    const pdfColumns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Nombre', dataKey: 'name' },
      { header: 'Precio', dataKey: 'precio' },
      { header: 'Estado', dataKey: 'estado' },
      { header: 'Reserva', dataKey: 'infoReserva' },
      { header: 'Huésped', dataKey: 'infoHuesped' },
      { header: 'Check-In', dataKey: 'infoCheckIn' }
    ]

    exportToPDFSimple(pdfData, pdfColumns, {
      filename,
      title
    })
  }
}

// Función para exportar estadísticas de habitaciones
export const exportEstadisticasHabitaciones = (habitaciones: any[], format: 'excel' | 'pdf') => {
  const filename = `estadisticas-habitaciones-${new Date().toISOString().split('T')[0]}`
  const title = 'Estadísticas de Habitaciones'

  // Calcular estadísticas
  const totalHabitaciones = habitaciones.length
  const ocupadas = habitaciones.filter(h => h.estado === 'ocupada').length
  const vacias = habitaciones.filter(h => h.estado === 'vacia').length
  const enLimpieza = habitaciones.filter(h => h.estado === 'en-limpieza').length
  const reservadas = habitaciones.filter(h => h.estado === 'reservada').length

  // Calcular ingresos potenciales
  const ingresosPotenciales = habitaciones
    .filter(h => h.precio)
    .reduce((sum, h) => sum + h.precio, 0)

  // Habitaciones con huéspedes
  const habitacionesConHuespedes = habitaciones.filter(h => h.huespedNombre).length

  // Reservas próximas (dentro de 3 horas)
  const reservasProximas = habitaciones.filter(h => {
    if (h.estado !== 'reservada' || !h.fechaReserva || !h.horaReserva) return false

    const now = new Date()
    const reservationDateTime = new Date(`${h.fechaReserva}T${h.horaReserva}`)
    const timeDifference = reservationDateTime.getTime() - now.getTime()
    const hoursUntilReservation = timeDifference / (1000 * 60 * 60)

    return hoursUntilReservation <= 3 && hoursUntilReservation > 0
  }).length

  if (format === 'excel') {
    const excelData = [
      { 'Métrica': 'Total de Habitaciones', 'Valor': totalHabitaciones },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'Ocupadas', 'Valor': ocupadas },
      { 'Métrica': 'Vacías', 'Valor': vacias },
      { 'Métrica': 'En Limpieza', 'Valor': enLimpieza },
      { 'Métrica': 'Reservadas', 'Valor': reservadas },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'Ingresos Potenciales', 'Valor': `S/. ${ingresosPotenciales.toFixed(2)}` },
      { 'Métrica': 'Habitaciones con Huéspedes', 'Valor': habitacionesConHuespedes },
      { 'Métrica': 'Reservas Próximas (≤3h)', 'Valor': reservasProximas }
    ]

    exportToExcel(excelData, {
      filename,
      sheetName: 'Estadísticas',
      title
    })
  } else {
    const pdfData = [
      {
        metrica: 'Total de Habitaciones',
        valor: totalHabitaciones
      },
      {
        metrica: 'Ocupadas',
        valor: ocupadas
      },
      {
        metrica: 'Vacías',
        valor: vacias
      },
      {
        metrica: 'En Limpieza',
        valor: enLimpieza
      },
      {
        metrica: 'Reservadas',
        valor: reservadas
      },
      {
        metrica: 'Ingresos Potenciales',
        valor: `S/. ${ingresosPotenciales.toFixed(2)}`
      },
      {
        metrica: 'Habitaciones con Huéspedes',
        valor: habitacionesConHuespedes
      },
      {
        metrica: 'Reservas Próximas (≤3h)',
        valor: reservasProximas
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
