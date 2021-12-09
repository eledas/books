import newPage from "../newPage";

export default (doc, printData, startY, fontSize, lineSpacing) => {
    let startX = 57;
    const pageWidth = doc.internal.pageSize.width;
    const endX =  pageWidth - startX;

    const tablecol3X = 300

    // <><>><><>><>><><><><><>>><><<><><><><>
    // new page check before totals output
    const neededHeight = lineSpacing * 2 + lineSpacing;
    startY = newPage(doc, startY, neededHeight);

    doc.setDrawColor(157, 183, 128);
    doc.setLineWidth(0.5);
    doc.line(startX, startY, endX, startY);

    doc.setFontSize(fontSize);

    startY += lineSpacing * 2;

    doc.text(printData.label.totalGrand, tablecol3X, startY, 'right');

    doc.setFontType('bold');
    
    doc.text(printData.invoice.totalCost, endX, startY, 'right');
    startX = endX - doc.getStringUnitWidth(printData.invoice.totalCost) * fontSize - 80;

    doc.text(printData.invoice.totalRate, startX, startY);
    startX = endX - doc.getStringUnitWidth(printData.invoice.totalRate) * fontSize - 155;
   
    doc.text(printData.invoice.totalGan, startX, startY);
    startX = endX - doc.getStringUnitWidth(printData.invoice.totalGan) * fontSize - 20;
   
    doc.setLineWidth(0.5);
    startY += 4;
    doc.line(startX - 1, startY, endX + 1, startY);
    startY += 2;
    doc.line(startX -2 , startY, endX + 2, startY);

    return startY;
}
