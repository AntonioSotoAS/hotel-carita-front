import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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

// Función para exportar a PDF usando jsPDF
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

  // Configurar fuente y tamaño
  doc.setFont('helvetica')
  doc.setFontSize(16)

  // Agregar título
  doc.text(title, 14, 22)

  // Agregar fecha
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 32)

  // Preparar datos para la tabla
  const tableData = data.map(item =>
    columns.map(col => item[col.dataKey] || '')
  )

  // Configurar encabezados
  const headers = columns.map(col => col.header)

  // Generar tabla usando autoTable
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineColor: [66, 133, 244],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [66, 133, 244],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    margin: { top: 40 },
  })

  // Agregar pie de página
  const finalY = (doc as any).lastAutoTable?.finalY || 40
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('Reporte generado automáticamente por Hotel Carita', 14, finalY + 10)

  // Guardar el PDF
  doc.save(`${filename}.pdf`)
}

// Función específica para exportar clientes
export const exportClientes = (clientes: any[], format: 'excel' | 'pdf') => {
  const filename = `clientes-${new Date().toISOString().split('T')[0]}`
  const title = 'Reporte de Clientes'

  // Función para formatear el tipo de documento
  const formatearTipoDocumento = (tipo: string) => {
    return tipo === 'DNI' ? 'DNI - Persona Natural' : 'RUC - Empresa'
  }

  // Función para obtener el nombre completo o razón social
  const obtenerNombre = (cliente: any) => {
    if (cliente.tipo_documento === 'DNI') {
      return cliente.nombre_completo || `${cliente.apellido_paterno || ''} ${cliente.apellido_materno || ''}, ${cliente.nombres || ''}`.trim()
    } else {
      return cliente.nombre_o_razon_social || 'Sin nombre'
    }
  }

  // Función para obtener la dirección completa
  const obtenerDireccion = (cliente: any) => {
    if (cliente.tipo_documento === 'RUC') {
      const partes = [
        cliente.direccion,
        cliente.distrito,
        cliente.provincia,
        cliente.departamento
      ].filter(Boolean)
      return partes.join(', ')
    }
    return 'No disponible'
  }

  if (format === 'excel') {
    // Preparar datos para Excel
    const excelData = clientes.map(cliente => ({
      'Tipo Documento': formatearTipoDocumento(cliente.tipo_documento),
      'Número Documento': cliente.numero_documento,
      'Nombre/Razón Social': obtenerNombre(cliente),
      'Dirección': obtenerDireccion(cliente),
      'Estado': cliente.estado || 'N/A',
      'Condición': cliente.condicion || 'N/A',
      'Fecha Creación': cliente.fechaCreacion ? new Date(cliente.fechaCreacion).toLocaleDateString() : 'N/A'
    }))

    exportToExcel(excelData, {
      filename,
      sheetName: 'Clientes',
      title
    })
  } else {
    // Preparar datos para PDF
    const pdfData = clientes.map(cliente => {
      const nombre = obtenerNombre(cliente)
      const direccion = obtenerDireccion(cliente)

      return {
        tipo: formatearTipoDocumento(cliente.tipo_documento),
        documento: cliente.numero_documento,
        nombre: nombre,
        direccion: direccion,
        estado: cliente.estado || 'N/A',
        condicion: cliente.condicion || 'N/A',
        fecha: cliente.fechaCreacion ? new Date(cliente.fechaCreacion).toLocaleDateString() : 'N/A'
      }
    })

    exportToPDF(pdfData, [
      { header: 'Tipo', dataKey: 'tipo' },
      { header: 'Documento', dataKey: 'documento' },
      { header: 'Nombre/Razón Social', dataKey: 'nombre' },
      { header: 'Dirección', dataKey: 'direccion' },
      { header: 'Estado', dataKey: 'estado' },
      { header: 'Condición', dataKey: 'condicion' },
      { header: 'Fecha Creación', dataKey: 'fecha' }
    ], {
      filename,
      title
    })
  }
}

// Función para exportar estadísticas de clientes
export const exportEstadisticasClientes = (clientes: any[], format: 'excel' | 'pdf') => {
  const filename = `estadisticas-clientes-${new Date().toISOString().split('T')[0]}`
  const title = 'Estadísticas de Clientes'

  // Calcular estadísticas
  const totalClientes = clientes.length
  const clientesDNI = clientes.filter(c => c.tipo_documento === 'DNI').length
  const clientesRUC = clientes.filter(c => c.tipo_documento === 'RUC').length

  // Clientes por estado (solo RUC)
  const clientesRUCActivos = clientes.filter(c => c.tipo_documento === 'RUC' && c.estado === 'ACTIVO').length
  const clientesRUCInactivos = clientes.filter(c => c.tipo_documento === 'RUC' && c.estado === 'INACTIVO').length

  // Clientes por condición (solo RUC)
  const clientesHabidos = clientes.filter(c => c.tipo_documento === 'RUC' && c.condicion === 'HABIDO').length
  const clientesNoHabidos = clientes.filter(c => c.tipo_documento === 'RUC' && c.condicion === 'NO HABIDO').length

  // Clientes por departamento (solo RUC)
  const departamentos = clientes
    .filter(c => c.tipo_documento === 'RUC' && c.departamento)
    .reduce((acc, cliente) => {
      acc[cliente.departamento] = (acc[cliente.departamento] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const topDepartamentos = Object.entries(departamentos)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)

  if (format === 'excel') {
    const excelData = [
      { 'Métrica': 'Total de Clientes', 'Valor': totalClientes },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'Clientes DNI (Personas Naturales)', 'Valor': clientesDNI },
      { 'Métrica': 'Clientes RUC (Empresas)', 'Valor': clientesRUC },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'RUC Activos', 'Valor': clientesRUCActivos },
      { 'Métrica': 'RUC Inactivos', 'Valor': clientesRUCInactivos },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'RUC Habidos', 'Valor': clientesHabidos },
      { 'Métrica': 'RUC No Habidos', 'Valor': clientesNoHabidos },
      { 'Métrica': '', 'Valor': '' }, // Fila vacía
      { 'Métrica': 'Top 5 Departamentos', 'Valor': '' },
      ...topDepartamentos.map(([depto, count]) => ({
        'Métrica': `  ${depto}`,
        'Valor': count
      }))
    ]

    exportToExcel(excelData, {
      filename,
      sheetName: 'Estadísticas',
      title
    })
  } else {
    const pdfData = [
      {
        metrica: 'Total de Clientes',
        valor: totalClientes
      },
      {
        metrica: 'Clientes DNI (Personas Naturales)',
        valor: clientesDNI
      },
      {
        metrica: 'Clientes RUC (Empresas)',
        valor: clientesRUC
      },
      {
        metrica: 'RUC Activos',
        valor: clientesRUCActivos
      },
      {
        metrica: 'RUC Inactivos',
        valor: clientesRUCInactivos
      },
      {
        metrica: 'RUC Habidos',
        valor: clientesHabidos
      },
      {
        metrica: 'RUC No Habidos',
        valor: clientesNoHabidos
      },
      {
        metrica: 'Top Departamentos',
        valor: topDepartamentos.map(([depto, count]) => `${depto}: ${count}`).join(', ')
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
