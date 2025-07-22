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

// Función simplificada para exportar a PDF (sin tablas)
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

// Función específica para exportar productos
export const exportProductos = (productos: any[], format: 'excel' | 'pdf') => {
  const columns = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Nombre', dataKey: 'nombre' },
    { header: 'Descripción', dataKey: 'descripcion' },
    { header: 'SKU', dataKey: 'sku' },
    { header: 'Categoría', dataKey: 'categoria' },
    { header: 'Precio', dataKey: 'precio' },
    { header: 'Stock', dataKey: 'stock' },
    { header: 'Stock Mínimo', dataKey: 'stock_minimo' },
    { header: 'Estado', dataKey: 'activo' },
    { header: 'Fecha Creación', dataKey: 'fechaCreacion' }
  ]

  const filename = `productos-${new Date().toISOString().split('T')[0]}`
  const title = 'Reporte de Productos'

  if (format === 'excel') {
    // Preparar datos para Excel
    const excelData = productos.map(producto => ({
      ID: producto.id,
      Nombre: producto.nombre,
      Descripción: producto.descripcion || '',
      SKU: producto.sku || '',
      Categoría: producto.categoria || '',
      Precio: producto.precio ? `S/. ${producto.precio.toFixed(2)}` : 'S/. 0.00',
      Stock: producto.stock,
      'Stock Mínimo': producto.stock_minimo,
      Estado: producto.activo ? 'Activo' : 'Inactivo',
      'Fecha Creación': new Date(producto.fechaCreacion).toLocaleDateString()
    }))

    exportToExcel(excelData, {
      filename,
      sheetName: 'Productos',
      title
    })
  } else {
    // Preparar datos para PDF
    const pdfData = productos.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion || 'Sin descripción',
      sku: producto.sku || 'N/A',
      categoria: producto.categoria || 'Sin categoría',
      precio: producto.precio ? `S/. ${producto.precio.toFixed(2)}` : 'S/. 0.00',
      stock: producto.stock,
      stock_minimo: producto.stock_minimo,
      activo: producto.activo ? 'Activo' : 'Inactivo',
      fechaCreacion: new Date(producto.fechaCreacion).toLocaleDateString()
    }))

    exportToPDFSimple(pdfData, columns, {
      filename,
      title
    })
  }
}

// Función específica para exportar clientes
export const exportClientes = (clientes: any[], format: 'excel' | 'pdf') => {
  const columns = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Tipo Documento', dataKey: 'tipo_documento' },
    { header: 'Número Documento', dataKey: 'numero_documento' },
    { header: 'Nombre/Razón Social', dataKey: 'nombre_completo' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Teléfono', dataKey: 'telefono' },
    { header: 'Dirección', dataKey: 'direccion' },
    { header: 'Estado', dataKey: 'estado' },
    { header: 'Fecha Creación', dataKey: 'fechaCreacion' }
  ]

  const filename = `clientes-${new Date().toISOString().split('T')[0]}`
  const title = 'Reporte de Clientes'

  if (format === 'excel') {
    // Preparar datos para Excel
    const excelData = clientes.map(cliente => ({
      ID: cliente.id,
      'Tipo Documento': cliente.tipo_documento,
      'Número Documento': cliente.numero_documento,
      'Nombre/Razón Social': cliente.tipo_documento === 'DNI'
        ? `${cliente.apellido_paterno || ''} ${cliente.apellido_materno || ''}, ${cliente.nombres || ''}`.trim()
        : cliente.nombre_o_razon_social || '',
      Email: cliente.email || '',
      Teléfono: cliente.telefono || '',
      Dirección: cliente.direccion || '',
      Estado: cliente.estado || (cliente.tipo_documento === 'DNI' ? 'Activo' : 'N/A'),
      'Fecha Creación': new Date(cliente.fechaCreacion).toLocaleDateString()
    }))

    exportToExcel(excelData, {
      filename,
      sheetName: 'Clientes',
      title
    })
  } else {
    // Preparar datos para PDF
    const pdfData = clientes.map(cliente => ({
      id: cliente.id,
      tipo_documento: cliente.tipo_documento,
      numero_documento: cliente.numero_documento,
      nombre_completo: cliente.tipo_documento === 'DNI'
        ? `${cliente.apellido_paterno || ''} ${cliente.apellido_materno || ''}, ${cliente.nombres || ''}`.trim()
        : cliente.nombre_o_razon_social || '',
      email: cliente.email || 'Sin email',
      telefono: cliente.telefono || 'Sin teléfono',
      direccion: cliente.direccion || 'Sin dirección',
      estado: cliente.estado || (cliente.tipo_documento === 'DNI' ? 'Activo' : 'N/A'),
      fechaCreacion: new Date(cliente.fechaCreacion).toLocaleDateString()
    }))

    exportToPDFSimple(pdfData, columns, {
      filename,
      title
    })
  }
}

// Función para exportar estadísticas
export const exportEstadisticas = (estadisticas: any, format: 'excel' | 'pdf') => {
  const filename = `estadisticas-${new Date().toISOString().split('T')[0]}`
  const title = 'Estadísticas del Sistema'

  if (format === 'excel') {
    const excelData = [
      { 'Métrica': 'Total Productos', 'Valor': estadisticas.totalProductos || 0 },
      { 'Métrica': 'Productos Activos', 'Valor': estadisticas.productosActivos || 0 },
      { 'Métrica': 'Productos Bajo Stock', 'Valor': estadisticas.productosBajoStock || 0 },
      { 'Métrica': 'Valor Total Inventario', 'Valor': `S/. ${(estadisticas.valorTotalInventario || 0).toFixed(2)}` },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'Total Clientes', 'Valor': estadisticas.totalClientes || 0 },
      { 'Métrica': 'Personas Naturales (DNI)', 'Valor': estadisticas.clientesDNI || 0 },
      { 'Métrica': 'Empresas (RUC)', 'Valor': estadisticas.clientesRUC || 0 },
      { 'Métrica': 'Clientes Activos', 'Valor': estadisticas.clientesActivos || 0 },
      { 'Métrica': 'Clientes Inactivos', 'Valor': estadisticas.clientesInactivos || 0 }
    ]

    exportToExcel(excelData, {
      filename,
      sheetName: 'Estadísticas',
      title
    })
  } else {
    const pdfData = [
      {
        metrica: 'Total Productos',
        valor: estadisticas.totalProductos || 0
      },
      {
        metrica: 'Productos Activos',
        valor: estadisticas.productosActivos || 0
      },
      {
        metrica: 'Productos Bajo Stock',
        valor: estadisticas.productosBajoStock || 0
      },
      {
        metrica: 'Valor Total Inventario',
        valor: `S/. ${(estadisticas.valorTotalInventario || 0).toFixed(2)}`
      },
      {
        metrica: 'Total Clientes',
        valor: estadisticas.totalClientes || 0
      },
      {
        metrica: 'Personas Naturales (DNI)',
        valor: estadisticas.clientesDNI || 0
      },
      {
        metrica: 'Empresas (RUC)',
        valor: estadisticas.clientesRUC || 0
      },
      {
        metrica: 'Clientes Activos',
        valor: estadisticas.clientesActivos || 0
      },
      {
        metrica: 'Clientes Inactivos',
        valor: estadisticas.clientesInactivos || 0
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
