import newPage from '../newPage';

export default (doc, printData, startY, fontSize, lineSpacing) => {
    let startX = 57;
    const pageWidth = doc.internal.pageSize.width;
    const endX = pageWidth - startX;

    let tablecol2X = 300;
    let tablecol3X = 386;
    let tablecol4X = 460;
    let tablecol5X = 380;
    let tablecol6X = 440;
    let tablecol7X = 500;
    let tablecol8X = 500;

    if (printData.label.tableDate !== undefined) {
        fontSize = 7;
        tablecol2X = 120;
        tablecol3X = 150;
        tablecol4X = 220;
        tablecol5X = 290;
        tablecol6X = 360;
        tablecol7X = 430;
        tablecol8X = 490;
    }

    doc.setFontSize(fontSize);
    doc.setFontType('normal');

    //-------Table Header---------------------
    startY += lineSpacing * 1.5;

    if (printData.label.tableDate !== undefined) {
        doc.text(printData.label.tableDate, startX, startY);
        doc.text(printData.label.tableItems, tablecol2X, startY);
        doc.text(printData.label.tableQuantity, tablecol3X, startY, 'right');
        doc.text(printData.label.tableCost, tablecol4X, startY, 'right');
        doc.text(printData.label.tableRate, tablecol5X, startY, 'right');
        doc.text(printData.label.tableGain, tablecol6X, startY, 'right');
        doc.text(printData.label.tableTotalCost, tablecol7X, startY, 'right');
        doc.text(printData.label.tableTotalCost, tablecol8X, startY, 'right');
        doc.text(printData.label.tableTotalGain, endX, startY, 'right');

    } else {
        doc.text(printData.label.tableItems, startX, startY);
        doc.text(printData.label.tableQuantity, tablecol2X, startY, 'right');
        doc.text(printData.label.tableCost, tablecol3X, startY, 'right');
        doc.text(printData.label.tableRate, tablecol4X, startY, 'right');
        doc.text(printData.label.tableGain, endX, startY, 'right');
    }

    startY += lineSpacing;

    doc.line(startX, startY, endX, startY);

    startY += lineSpacing * 1.5;

    //-------Table Body---------------------

    const items = Object.values(printData.items);

    items.map(item => {

        doc.setFontType('bold');
        let splitTitle
        if (printData.label.tableDate !== undefined) {
            splitTitle = doc.splitTextToSize(
                item.date,
                tablecol2X - startX - lineSpacing * 1.5
            );
        } else {
            splitTitle = doc.splitTextToSize(
                item.title,
                tablecol2X - startX - lineSpacing * 1.5
            );
        }
        const heightTitle = splitTitle.length * doc.internal.getLineHeight();

        doc.setFontType('normal');

        startY = newPage(doc, startY, heightTitle);

        doc.setFontType('bold');
        doc.text(splitTitle, startX, startY);
        // tweak Y to be below title. fits nicer with long descriptions. descriptions will be probably taking a row space while titles do not.
        startY += heightTitle;

        doc.setFontType('normal');

        if (printData.label.tableDate !== undefined) {
            doc.text(item.title, tablecol2X, startY, 'right');
            doc.text(item.quantity, tablecol3X, startY, 'right');
            doc.text(item.cost, tablecol4X, startY, 'right');
            doc.text(item.rate, tablecol5X, startY, 'right');
            doc.text(item.gain, tablecol6X, startY, 'right');
            doc.text(item.costTotal, tablecol7X, startY, 'right');
            doc.text(item.rateTotal, tablecol8X, startY, 'right');
            doc.text(item.gainTotal, endX, startY, 'right');

        } else {
            doc.text(item.quantity, tablecol2X, startY, 'right');
            doc.text(item.cost, tablecol3X, startY, 'right');
            doc.text(item.rate, tablecol4X, startY, 'right');
            doc.text(item.gain, endX, startY, 'right');
        }

        startY += lineSpacing;
    });

    return startY;
}
