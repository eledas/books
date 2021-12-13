const getBaseQuery = (time) => {
    return ` 
            (SELECT 
              item, SUM(quantity) AS cantidad, 
              SUM(quantity*baseRate) AS SumatoriaCosto, 
              SUM(quantity*rate) AS SumatoriaVenta, 
              SUM(quantity*(rate-baseRate)) AS Ganancia
            FROM 
              SalesInvoiceItem
            INNER JOIN 
                (
                SELECT  
                  name 
                FROM 
                  SalesInvoice
                ${time}
              ) dateView
            ON 
              SalesInvoiceItem.parent=dateView.name
            GROUP BY SalesInvoiceItem.item)
        `;
}

const getSimpleQuery = (time) => {
    return `SELECT 
    *
    FROM ${getBaseQuery(time)} SumarotyView;`
}

const getDates = (time) => {
    return `
    SELECT  
      date(creation) AS date
    FROM 
      SalesInvoice
    ${time}
    Group by date
  `;
}

const getDetailQuery = (time) => {
    return ` 
        SELECT 
             item, quantity, date, baseRate AS costo, 
          rate AS venta, (rate-baseRate) AS ganancia, 
          quantity*baseRate AS costoTotal, 
          quantity*rate AS ventaTotal, 
          quantity*(rate-baseRate) AS gananciaTotal
        FROM 
          SalesInvoiceItem
        INNER JOIN 
            (
            SELECT  
              name, date(creation) AS date
            FROM 
              SalesInvoice
            ${time}
          ) dateView
        ON 
          SalesInvoiceItem.parent=dateView.name
        ORDER BY item
    `;
}

const getTotals = (time) => {
    return `SELECT 
        SUM(SumatoriaVenta) AS rate, SUM(SumatoriaCosto) AS cost, SUM(Ganancia) AS gan
        FROM ${getBaseQuery(time)} SumarotyView;`
}

const getMin = () => {
    return `SELECT name, amount, minAmount FROM Item `+
    `WHERE (amount - minAmount) <= 0 OR amount = 0 `+
    `Order BY name ASC`
}

const getExpired = () => {
    return `SELECT 
          name, amount, date(dateExpired) AS fechaVencimiento, date(dateExpired) < DATE('now') AS vencido
        FROM 
          Item
        WHERE
          DATE('now','+2 months') > date(dateExpired)
        Order BY name ASC
  `
}

export default { getTotals, getDates, getSimpleQuery, getDetailQuery, getExpired, getMin };