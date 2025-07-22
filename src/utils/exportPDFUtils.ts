import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Extender jsPDF con autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

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

// Función para exportar a PDF real
export const exportToPDF = (
  data: any[],
  columns: { header: string; dataKey: string }[],
  options: ExportOptions = {}
) => {
  const {
    filename = 'export',
    title = 'Reporte'
  } = options

  // Crear nuevo documento PDF
  const doc = new jsPDF()

  // Agregar título
  doc.setFontSize(18)
  doc.text(title, 14, 22)

  // Agregar fecha
  doc.setFontSize(10)
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30)

  // Preparar datos para la tabla
  const tableData = data.map(item =>
    columns.map(col => item[col.dataKey] || '')
  )

  // Agregar tabla
  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  })

  // Guardar el PDF
  doc.save(`${filename}.pdf`)
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

    exportToPDF(pdfData, columns, {
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

    exportToPDF(pdfData, columns, {
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

    exportToPDF(pdfData, [
      { header: 'Métrica', dataKey: 'metrica' },
      { header: 'Valor', dataKey: 'valor' }
    ], {
      filename,
      title
    })
  }
}

// Función específica para exportar historial de habitaciones
export const exportHistorial = (historial: any[], format: 'excel' | 'pdf') => {
  const columns = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Fecha', dataKey: 'fecha' },
    { header: 'Hora', dataKey: 'hora' },
    { header: 'Habitación', dataKey: 'habitacionNombre' },
    { header: 'Tipo de Movimiento', dataKey: 'tipoMovimiento' },
    { header: 'Cambio de Estado', dataKey: 'cambioEstado' },
    { header: 'Huésped', dataKey: 'infoHuesped' },
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
      ID: registro.id,
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
    // Preparar datos para PDF
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
        id: registro.id,
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

    exportToPDF(pdfData, columns, {
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

    exportToPDF(pdfData, [
      { header: 'Métrica', dataKey: 'metrica' },
      { header: 'Valor', dataKey: 'valor' }
    ], {
      filename,
      title
    })
  }
}

// Función específica para exportar historial de stock
export const exportStockHistory = (stockHistory: any[], format: 'excel' | 'pdf') => {
  const columns = [
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
    // Preparar datos para PDF
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

    exportToPDF(pdfData, columns, {
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

    exportToPDF(pdfData, [
      { header: 'Métrica', dataKey: 'metrica' },
      { header: 'Valor', dataKey: 'valor' }
    ], {
      filename,
      title
    })
  }
}
