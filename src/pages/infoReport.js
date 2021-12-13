
const heads = [
    [
        {
            title: 'Producto',
            fieldName: 'title',
        },
        {
            title: 'Cantidad',
            fieldName: 'quantity',
        },
        {
            title: 'Suma Costo',
            fieldName: 'cost',
        },
        {
            title: 'Suma Venta',
            fieldName: 'rate',
        },
        {
            title: 'Ganancia',
            fieldName: 'gain',
        },
    ],
    [
        {
            title: 'Fecha',
            fieldName: 'date',
        },
        {
            title: 'Producto',
            fieldName: 'title',
        },
        {
            title: 'Cantidad',
            fieldName: 'quantity',
        },
        {
            title: 'Costo',
            fieldName: 'cost',
        },
        {
            title: 'Venta',
            fieldName: 'rate',
        },
        {
            title: 'Ganancia',
            fieldName: 'gain',
        },
        {
            title: 'Costo Total',
            fieldName: 'costTotal',
        },
        {
            title: 'Venta Total',
            fieldName: 'rateTotal',
        },
        {
            title: 'Ganancia Total',
            fieldName: 'gainTotal',
        },
    ],
    [
        {
            title: 'Producto',
            fieldName: 'title',
        },
        {
            title: 'Cantidad',
            fieldName: 'quantity',
        },
        {
            title: 'Fecha Vencimiento',
            fieldName: 'rate',
        },
        {
            title: 'Vencido',
            fieldName: 'gain',
        },
    ],
    [
        {
            title: 'Producto',
            fieldName: 'title',
        },
        {
            title: 'Cantidad',
            fieldName: 'quantity',
        },
        {
            title: 'Cantidad Minima',
            fieldName: 'rate',
        },
        {
            title: 'Agotado',
            fieldName: 'gain',
        },
    ]
]

const baseReport = [
    {
        title: {
            title: 'Agropecuaria Aldana',
        },
        label: {
            invoice: `Reporte de Ventas Simple`,
            tableItems: 'Producto',
            tableQuantity: 'Cantidad',
            tableCost: 'Suma Costo',
            tableRate: 'Suma Venta',
            tableGain: 'Ganancia',
            totalGrand: '',
        },
    },
    {
        title: {
            title: 'Agropecuaria Aldana',
        },
        label: {
            invoice: `Reporte de Ventas Detallado`,
            tableItems: 'item',
            tableQuantity: 'cant',
            tableCost: 'Costo',
            tableRate: 'Venta',
            tableGain: 'Ganancia',
            tableTotalCost: 'Total Costo',
            tableTotalRate: 'Total Venta',
            tableTotalGain: 'Total Ganancia',
            tableDate: 'Fecha',
            totalGrand: '',
        },
    },
    {
        title: {
            title: 'Agropecuaria Aldana',
        },
        label: {
            invoice: `Reporte de Productos por Vencer`,
            tableItems: 'Producto',
            tableQuantity: 'Cantidad',
            tableCost: ' ',
            tableRate: 'Fecha Vencimiento',
            tableGain: 'Ganancia',
            totalGrand: '',
        },
    },
    {
        title: {
            title: 'Agropecuaria Aldana',
        },
        label: {
            invoice: `Reporte de Productos por Agotarse`,
            tableItems: 'Producto',
            tableQuantity: 'Cantidad',
            tableCost: ' ',
            tableRate: 'Cantidad Minima',
            tableGain: 'Agotado',
            totalGrand: '',
        },
    }
]

const getHead = (head = 0) => {
    return heads[head];
}

const getBaseReport = (head = 0) => {
    return baseReport[head];
}

export default {getHead, getBaseReport};