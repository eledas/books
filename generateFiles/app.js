import printPDF from './print';

export const generateReport = (basePrintData, shortPrintData) =>{   
    printPDF(Object.assign(basePrintData, shortPrintData));
}

