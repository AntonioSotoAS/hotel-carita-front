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
        .arrow { color: #666; margin: 0 4px; }
        .positive { color: #2e7d32; font-weight: bold; }
        .negative { color: #c62828; font-weight: bold; }
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

// Función específica para exportar historial de stock
export const exportStockHistory = (stockHistory: any[], format: 'excel' | 'pdf') => {
  const columns = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Fecha', dataKey: 'fecha' },
    { header: 'Hora', dataKey: 'hora' },
    { header: 'Producto', dataKey: 'producto_nombre' },
    { header: 'ID Producto', dataKey: 'producto_id' },
    { header: 'Tipo de Movimiento', dataKey: 'tipo_movimiento' },
    { header: 'Cantidad', dataKey: 'cantidad' },
    { header: 'Stock Anterior', dataKey: 'stock_anterior' },
    { header: 'Stock Actual', dataKey: 'stock_actual' },
    { header: 'Motivo', dataKey: 'motivo' },
    { header: 'Observaciones', dataKey: 'observaciones' },
    { header: 'Usuario', dataKey: 'usuario' }
  ]

  const filename = `historial-stock-${new Date().toISOString().split('T')[0]}`
  const title = 'Historial de Movimientos de Stock'

  // Función para formatear el tipo de movimiento
  const formatearTipoMovimiento = (tipo: string) => {
    return tipo === 'entrada' ? 'ENTRADA' : 'SALIDA'
  }

  if (format === 'excel') {
    // Preparar datos para Excel
    const excelData = stockHistory.map(movimiento => ({
      ID: movimiento.id,
      Fecha: new Date(movimiento.fecha).toLocaleDateString('es-ES'),
      Hora: movimiento.hora,
      Producto: movimiento.producto_nombre,
      'ID Producto': movimiento.producto_id,
      'Tipo de Movimiento': formatearTipoMovimiento(movimiento.tipo_movimiento),
      Cantidad: `${movimiento.tipo_movimiento === 'entrada' ? '+' : '-'}${movimiento.cantidad}`,
      'Stock Anterior': movimiento.stock_anterior,
      'Stock Actual': movimiento.stock_actual,
      Motivo: movimiento.motivo,
      Observaciones: movimiento.observaciones || '-',
      Usuario: movimiento.usuario
    }))

    exportToExcel(excelData, {
      filename,
      sheetName: 'Historial Stock',
      title
    })
  } else {
    // Preparar datos para PDF con formato especial
    const pdfData = stockHistory.map(movimiento => {
      // Crear descripción del cambio de stock
      const cambioStock = `${movimiento.stock_anterior} → ${movimiento.stock_actual}`

      // Crear información del producto
      const infoProducto = `${movimiento.producto_nombre} (ID: ${movimiento.producto_id})`

      // Crear cantidad con signo
      const cantidadConSigno = `${movimiento.tipo_movimiento === 'entrada' ? '+' : '-'}${movimiento.cantidad}`

      return {
        id: movimiento.id,
        fecha: new Date(movimiento.fecha).toLocaleDateString('es-ES'),
        hora: movimiento.hora,
        producto: infoProducto,
        tipoMovimiento: formatearTipoMovimiento(movimiento.tipo_movimiento),
        cantidad: cantidadConSigno,
        cambioStock: cambioStock,
        motivo: movimiento.motivo,
        observaciones: movimiento.observaciones || 'Sin observaciones',
        usuario: movimiento.usuario
      }
    })

    // Columnas simplificadas para PDF
    const pdfColumns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Fecha', dataKey: 'fecha' },
      { header: 'Hora', dataKey: 'hora' },
      { header: 'Producto', dataKey: 'producto' },
      { header: 'Tipo', dataKey: 'tipoMovimiento' },
      { header: 'Cantidad', dataKey: 'cantidad' },
      { header: 'Stock Anterior → Actual', dataKey: 'cambioStock' },
      { header: 'Motivo', dataKey: 'motivo' },
      { header: 'Observaciones', dataKey: 'observaciones' },
      { header: 'Usuario', dataKey: 'usuario' }
    ]

    exportToPDFSimple(pdfData, pdfColumns, {
      filename,
      title
    })
  }
}

// Función para exportar estadísticas del historial de stock
export const exportEstadisticasStock = (stockHistory: any[], format: 'excel' | 'pdf') => {
  const filename = `estadisticas-stock-${new Date().toISOString().split('T')[0]}`
  const title = 'Estadísticas del Historial de Stock'

  // Calcular estadísticas
  const totalMovimientos = stockHistory.length
  const entradas = stockHistory.filter(m => m.tipo_movimiento === 'entrada').length
  const salidas = stockHistory.filter(m => m.tipo_movimiento === 'salida').length

  const totalEntradas = stockHistory
    .filter(m => m.tipo_movimiento === 'entrada')
    .reduce((sum, m) => sum + m.cantidad, 0)

  const totalSalidas = stockHistory
    .filter(m => m.tipo_movimiento === 'salida')
    .reduce((sum, m) => sum + m.cantidad, 0)

  // Obtener productos únicos
  const productosUnicos = [...new Set(stockHistory.map(m => m.producto_nombre))].length

  // Obtener usuarios únicos
  const usuariosUnicos = [...new Set(stockHistory.map(m => m.usuario))].length

  // Obtener motivos únicos
  const motivosUnicos = [...new Set(stockHistory.map(m => m.motivo))].length

  // Calcular balance neto
  const balanceNeto = totalEntradas - totalSalidas

  if (format === 'excel') {
    const excelData = [
      { 'Métrica': 'Total de Movimientos', 'Valor': totalMovimientos },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'Entradas', 'Valor': entradas },
      { 'Métrica': 'Salidas', 'Valor': salidas },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'Cantidad Total Entradas', 'Valor': totalEntradas },
      { 'Métrica': 'Cantidad Total Salidas', 'Valor': totalSalidas },
      { 'Métrica': 'Balance Neto', 'Valor': balanceNeto },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'Productos Involucrados', 'Valor': productosUnicos },
      { 'Métrica': 'Usuarios del Sistema', 'Valor': usuariosUnicos },
      { 'Métrica': 'Tipos de Motivos', 'Valor': motivosUnicos }
    ]

    exportToExcel(excelData, {
      filename,
      sheetName: 'Estadísticas',
      title
    })
  } else {
    const pdfData = [
      {
        metrica: 'Total de Movimientos',
        valor: totalMovimientos
      },
      {
        metrica: 'Entradas',
        valor: entradas
      },
      {
        metrica: 'Salidas',
        valor: salidas
      },
      {
        metrica: 'Cantidad Total Entradas',
        valor: totalEntradas
      },
      {
        metrica: 'Cantidad Total Salidas',
        valor: totalSalidas
      },
      {
        metrica: 'Balance Neto',
        valor: balanceNeto
      },
      {
        metrica: 'Productos Involucrados',
        valor: productosUnicos
      },
      {
        metrica: 'Usuarios del Sistema',
        valor: usuariosUnicos
      },
      {
        metrica: 'Tipos de Motivos',
        valor: motivosUnicos
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
