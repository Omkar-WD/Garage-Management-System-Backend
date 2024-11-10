import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "reactstrap";

const customerData = {
    name: "Sagar",
    phone: "7741049598",
    repairs: [
        {
            service: "old change",
            cost: "10Rs"
        }
    ],
    userDetails: [ "Sagar Gondage", "Chimbhale", "Test Data", "MH01AB1234" ]
}

const GeneratePdf = () => {
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        
        // const title = "Sai Auto Services";
        // // doc.addImage("https://gbdev.s3.amazonaws.com/qa/product/titanegiftcard/d/thumbnail/84_microsite.png", 'JPEG', 15, 10, 50, 50); // x, y, width, height
        // doc.setFontSize(30);
        // doc.setFont("helvetica", "bold")
        // const textWidth = doc.getTextWidth(title)
        // const textX = (pageWidth - textWidth) / 2;
        // doc.text(title, textX, 25)

        doc.setFontSize(12)


        // Define table data
        const tableRows = [
            ['NAME', customerData.userDetails[0], 'IN. NO', 'Price'],
            ['ADDRESS', customerData.userDetails[1], 'DATE', "28.09.2023"],
            ['TEST', customerData.userDetails[2], 'MODEL', 'INDIGO'],
            ['VEH NO', customerData.userDetails[3], 'KM', '3000'],
        ];

        // AutoTable with specific column widths
        doc.autoTable({
            body: tableRows,
            startY: 20,  // Start table after some vertical space
            columnStyles: {
                0: { cellWidth: pageWidth * 0.1 },  // 10% of page width for 1st column
                1: { cellWidth: pageWidth * 0.4 },  // 40% of page width for 2nd column
                2: { cellWidth: pageWidth * 0.1 },  // 10% of page width for 3rd column
                3: { cellWidth: pageWidth * 0.4 },  // 40% of page width for 4th column
            },
            styles: { overflow: 'linebreak' },  // Enable text wrapping if needed
        });

        // Add customer details
        // doc.text(`Customer Name: ${customerData.name}`, 14, 30);
        // doc.text(`Phone: ${customerData.phone}`, 14, 40);

        // // Add table for repairs
        // const tableColumn = ["Service", "Cost"];
        // const tableRows = [];

        // customerData.repairs.forEach(repair => {
        //     const repairData = [repair.service, `$${repair.cost}`];
        //     tableRows.push(repairData);
        // });

        // Add table
        // doc.autoTable(tableColumn, tableRows, { startY: 50 });

        // Total cost
        // const total = customerData.repairs.reduce((sum, repair) => sum + repair.cost, 0);
        // doc.text(`Total: $${total}`, 14, doc.autoTable.previous.finalY + 20);

        const pdfBlob = doc.output("blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl);

        // Save PDF
        // doc.save('repair-bill.pdf');
    };

    return <Button onClick={generatePDF}>Create Bill</Button>
};

export default GeneratePdf;