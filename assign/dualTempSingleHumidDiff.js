import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import fs from "fs"
import path from "path";

const width = 1000;
const height = 500;
const chartCanvas = new ChartJSNodeCanvas({ width, height });


// =====> Generating Chart <======
async function generateDualAxisChart(labels, tempData1, tempData2) {
    const config = {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Temperature 1 (°C)',
                    data: tempData1,
                    borderColor: 'red',
                    yAxisID: 'yTemp1',
                    tension: 0.3,
                },
                {
                    label: 'Temperature 2 (°C)',
                    data: tempData2,
                    borderColor: 'blue',
                    yAxisID: 'yTemp2',
                    tension: 0.3,
                },
            ],
        },
        options: {
            responsive: false,
            scales: {
                yTemp1: {
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        font: {
                            size: 14,   // Increased font size
                            weight: 'bold',
                        },
                    },
                    title: {
                        display: true,
                        text: 'Temperature 1 (°C)',
                        font: {
                            size: 16,
                            weight: 'bold',
                        },
                    },
                },
                yTemp2: {
                    type: 'linear',
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                    },
                    title: {
                        display: true,
                        text: 'Temperature 2 (°C)',
                        font: {
                            size: 16,
                            weight: 'bold',
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 16,
                            weight: 'bold',
                        },
                    },
                },
            },
        },
    };

    return await chartCanvas.renderToDataURL(config);
}

const generateChart = async (labels, data, label, color) => {
    const config = {
        type: "line",
        data: {
            labels,
            datasets: [{
                label,
                data,
                borderColor: color,
                borderWidth: 2,
                fill: false,
                pointRadius: 1
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    }
    return await chartCanvas.renderToDataURL(config);
};

// =====> Sample Data <=====
const leftData = {
    "Make:": "Vega",
    "Model:": "Alpha",
    "Serial No:": "ALP-BA0680",
    "Instrument ID:": "BA0680"
};

const rightData = {
    "Temperature Resolution:": " 0.1 °C",
    "Temperature Accuracy:": "± 0.1 °C",
    "Humidity Resolution:": "0.1 %",
    "Humidity Accuracy:": " ± 0.1 %"
};

const dynamic = {
    reportname: "Test",
    email: "vega@gmail.com"
}

const dummyData = Array.from({ length: 100 }, (_, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + i * 10);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedTimestamp = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    return {
        sr: i + 1,
        timestamp: formattedTimestamp,
        temperature1: (20 + Math.random() * 10).toFixed(2),
        temperature2: (20 + Math.random() * 10).toFixed(2),
        humidity: (40 + Math.random() * 20).toFixed(2),
    };
});

const labels = dummyData.map((d) => d.timestamp);
const tempData1 = dummyData.map((d) => d.temperature1);
const tempData2 = dummyData.map((d) => d.temperature2);
const humidData = dummyData.map((d) => d.humidity);


const dualChart = await generateDualAxisChart(
    labels,
    tempData1,
    tempData2
);

const humidChart = await generateChart(
    labels,
    humidData,
    "Humidity"
)


// ======> PDF Generation <======
const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginRightX = pageWidth / 2;
    const marginX = 15;
    const marginY = pageHeight - 15;
    let currentLine = 20;
    const totalPagesExp = "{total}";
    const imagePath = path.resolve('./vega-logo.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    const imageData = `data:image/png;base64,${imageBase64}`;

    // ======> PDF Header <=====
    const headerText = (reportType) => {
        doc.addImage(imageData, "PNG", 15, 5, 22, 11)

        // === Title ===
        doc.setFontSize(11).setFont(undefined, "bold").setTextColor('#003366');
        doc.text("Data Report", pageWidth / 2, 11, { align: "center" });
        // === Subtitle ===
        doc.setFontSize(8).setTextColor(0, 0, 0);
        doc.text(reportType, pageWidth / 2, 16, { align: "center" });
        // === Line ===
        doc.setLineWidth(0.08);
        doc.line(marginX, 19, pageWidth - 15, 19);
    }

    // ======> PDF Footer <=====
    const footerText = (pageNum, totalPages) => {
        const timestamp = new Date().toLocaleString();
        doc.setFontSize(8);
        const prefixText = "Report Generated by: ";
        const emailX = marginX + doc.getTextWidth(prefixText);
        doc.text(`${prefixText}`, marginX, marginY);
        doc.setTextColor("#003366");
        doc.textWithLink(dynamic.email, emailX, marginY, {
            url: `mailto:${dynamic.email}`,
        });
        const afterEmail = ` @ ${timestamp} (GMT-00:00)`;
        const afterEmailX = emailX + doc.getTextWidth(dynamic.email);
        doc.setTextColor(0, 0, 0);
        doc.text(afterEmail, afterEmailX, marginY);
        doc.text(
            "This is a computer-generated report, no signature is required ***",
            marginX,
            marginY + 5
        );
        const rightX = pageWidth - marginX;
        doc.text(`Page ${pageNum} of ${totalPages}`, rightX, marginY, {
            align: "right",
        });
        doc.text("Copyright © Vega™", rightX, marginY + 5, { align: "right" });
    };

    // ======> Page 1 <======

    // ====== Title ======
    headerText("Dummy");

    // ===== Section 1 Heading =====
    doc.setFontSize(10).setFont(undefined, "bold").setTextColor('#003366');
    doc.text("Device Info", marginX, currentLine += 5);
    doc.setTextColor(0, 0, 0);

    // ===== Left Column 1 =====
    doc.setFontSize(8);
    currentLine += 5;

    // Make:
    doc.setFont(undefined, "bold");
    doc.text("Make:", marginX, currentLine);
    doc.setFont(undefined, "normal");
    doc.text(leftData["Make:"], marginX + doc.getTextWidth("Make:") + 2, currentLine);

    // Model:
    currentLine += 5;
    doc.setFont(undefined, "bold");
    doc.text("Model:", marginX, currentLine);
    doc.setFont(undefined, "normal");
    doc.text(leftData["Model:"], marginX + doc.getTextWidth("Model:") + 2, currentLine);

    // Serial No:
    currentLine += 5;
    doc.setFont(undefined, "bold");
    doc.text("Serial No:", marginX, currentLine);
    doc.setFont(undefined, "normal");
    doc.text(leftData["Serial No:"], marginX + doc.getTextWidth("Serial No:") + 2, currentLine);

    // Instrument ID:
    currentLine += 5;
    doc.setFont(undefined, "bold");
    doc.text("Instrument ID:", marginX, currentLine);
    doc.setFont(undefined, "normal");
    doc.text(leftData["Instrument ID:"], marginX + doc.getTextWidth("Instrument ID:") + 2, currentLine);

    // ===== Right Column 1 =====
    let yStart = currentLine - (3 * 5);

    // Temperature Resolution:
    doc.setFont(undefined, "bold");
    doc.text("Temperature Resolution:", marginRightX, yStart);
    doc.setFont(undefined, "normal");
    doc.text(rightData["Temperature Resolution:"], marginRightX + doc.getTextWidth("Temperature Resolution:") + 4, yStart);

    // Temperature Accuracy:
    yStart += 5;
    doc.setFont(undefined, "bold");
    doc.text("Temperature Accuracy:", marginRightX, yStart);
    doc.setFont(undefined, "normal");
    doc.text(rightData["Temperature Accuracy:"], marginRightX + doc.getTextWidth("Temperature Accuracy:") + 4, yStart);

    // Humidity Resolution:
    yStart += 5;
    doc.setFont(undefined, "bold");
    doc.text("Humidity Resolution:", marginRightX, yStart);
    doc.setFont(undefined, "normal");
    doc.text(rightData["Humidity Resolution:"], marginRightX + doc.getTextWidth("Humidity Resolution:") + 4, yStart);

    // Humidity Accuracy:
    yStart += 5;
    doc.setFont(undefined, "bold");
    doc.text("Humidity Accuracy:", marginRightX, yStart);
    doc.setFont(undefined, "normal");
    doc.text(rightData["Humidity Accuracy:"], marginRightX + doc.getTextWidth("Humidity Accuracy:") + 4, yStart);

    // ===== Horizontal Line 2 =====
    doc.setLineWidth(0.3);
    doc.line(marginX, currentLine += 5, pageWidth - 15, currentLine);

    // ===== Section 2 Heading =====
    doc.setFont(undefined, "bold").setFontSize(11).setTextColor("#003366");
    doc.text("Logger Summary", marginX, currentLine += 7);
    doc.setTextColor(0, 0, 0);

    // ===== Left Column 2 =====
    doc.setFontSize(8);
    currentLine += 5;

    // Start Date & Time:
    doc.setFont(undefined, "bold");
    doc.text("Start Date & Time:", marginX, currentLine);
    doc.setFont(undefined, "normal");
    doc.text(leftData["Make:"], marginX + doc.getTextWidth("Start Date & Time:") + 2, currentLine);

    // End Date & Time:
    currentLine += 5;
    doc.setFont(undefined, "bold");
    doc.text("End Date & Time:", marginX, currentLine);
    doc.setFont(undefined, "normal");
    doc.text(leftData["Model:"], marginX + doc.getTextWidth("End Date & Time:") + 2, currentLine);

    // Recording Interval:
    currentLine += 5;
    doc.setFont(undefined, "bold");
    doc.text("Recording Interval:", marginX, currentLine);
    doc.setFont(undefined, "normal");
    doc.text(leftData["Serial No:"], marginX + doc.getTextWidth("Recording Interval:") + 2, currentLine);

    // ===== Right Column 2 =====
    yStart = currentLine - (2 * 5);

    // Sending Interval:
    doc.setFont(undefined, "bold");
    doc.text("Sending Interval:", marginRightX, yStart);
    doc.setFont(undefined, "normal");
    doc.text(rightData["Temperature Resolution:"], marginRightX + doc.getTextWidth("Sending Interval:") + 2, yStart);

    // === Min & Max Set Temperature ===
    yStart += 5;
    doc.setFont(undefined, "bold");
    doc.text("Min Set Temperature:", marginRightX, yStart);

    const minTempLabel = "Min Set Temperature:";
    const minTempValue = rightData["Temperature Accuracy:"].trim();
    const maxTempLabel = "/ Max Set Temperature:";
    const maxTempValue = rightData["Humidity Accuracy:"].trim();

    const minTempLabelWidth = doc.getTextWidth(minTempLabel);
    const minTempValueWidth = doc.getTextWidth(minTempValue);
    const maxTempLabelWidth = doc.getTextWidth(maxTempLabel);

    const xAfterMinTemp = marginRightX + minTempLabelWidth + 2;
    const xAfterMinValue = xAfterMinTemp + minTempValueWidth + 2;

    doc.setFont(undefined, "normal");
    doc.text(minTempValue, xAfterMinTemp, yStart);
    doc.setFont(undefined, "bold");
    doc.text(maxTempLabel, xAfterMinValue, yStart);
    doc.setFont(undefined, "normal");
    doc.text(maxTempValue, xAfterMinValue + maxTempLabelWidth + 2, yStart);

    // === Min & Max Set Humidity ===
    yStart += 5;
    doc.setFont(undefined, "bold");
    doc.text("Min Set Humidity:", marginRightX, yStart).setFont(undefined, "bold");

    const minHumLabel = "Min Set Humidity:";
    const minHumValue = rightData["Humidity Resolution:"].trim();
    const maxHumLabel = "/ Max Set Humidity:";
    const maxHumValue = rightData["Humidity Accuracy:"].trim();

    const minHumLabelWidth = doc.getTextWidth(minHumLabel);
    const minHumValueWidth = doc.getTextWidth(minHumValue);
    const maxHumLabelWidth = doc.getTextWidth(maxHumLabel);

    const xAfterMinHum = marginRightX + minHumLabelWidth + 2;
    const xAfterMinHumValue = xAfterMinHum + minHumValueWidth + 2;

    doc.setFont(undefined, "normal");
    doc.text(minHumValue, xAfterMinHum, yStart);
    doc.setFont(undefined, "bold");
    doc.text(maxHumLabel, xAfterMinHumValue, yStart);
    doc.setFont(undefined, "normal");
    doc.text(maxHumValue, xAfterMinHumValue + maxHumLabelWidth + 2, yStart);

    // ===== Horizontal Line 3 =====
    doc.setLineWidth(0.3);
    doc.line(marginX, currentLine += 5, pageWidth - 15, currentLine);

    // ===== Section 3 Heading =====
    doc.setFont(undefined, "bold").setFontSize(10).setTextColor('#003366');
    doc.text("Observed Report Summary", marginX, currentLine += 7);
    doc.setTextColor(0, 0, 0);

    // ===== Left Column 3 - Labels Bold, Values Normal =====
    doc.setFontSize(8);
    currentLine += 5;

    // Min Temperature:
    doc.setFont(undefined, "bold");
    doc.text("Min Temperature:", marginX, currentLine);
    doc.setFont(undefined, "normal");
    doc.text(leftData["Make:"], marginX + doc.getTextWidth("Min Temperature:") + 2, currentLine);

    // Max Temperature:
    currentLine += 5;
    doc.setFont(undefined, "bold");
    doc.text("Max Temperature:", marginX, currentLine);
    doc.setFont(undefined, "normal");
    doc.text(leftData["Model:"], marginX + doc.getTextWidth("Max Temperature:") + 2, currentLine);

    // MKT:
    currentLine += 5;
    doc.setFont(undefined, "bold");
    doc.text("MKT:", marginX, currentLine);
    doc.setFont(undefined, "normal");
    doc.text(leftData["Serial No:"], marginX + doc.getTextWidth("MKT:") + 2, currentLine);

    // ===== Right Column 3 - Same Y Positions =====
    yStart = currentLine - (2 * 5);

    // Min Humidity:
    doc.setFont(undefined, "bold");
    doc.text("Min Humidity:", marginRightX, yStart);
    doc.setFont(undefined, "normal");
    doc.text(rightData["Temperature Resolution:"], marginRightX + doc.getTextWidth("Min Humidity:") + 2, yStart);

    // Max Humidity:
    yStart += 5;
    doc.setFont(undefined, "bold");
    doc.text("Max Humidity:", marginRightX, yStart);
    doc.setFont(undefined, "normal");
    doc.text(rightData["Temperature Accuracy:"], marginRightX + doc.getTextWidth("Max Humidity:") + 2, yStart);

    // Avg Temperature & Avg Humidity :
    yStart += 5;
    doc.setFont(undefined, "bold");

    const avgTemLabel = "Avg Temperature:";
    const avgTempValue = rightData["Humidity Resolution:"].trim();
    const avgHumLabel = "/ Avg Humidity:";
    const avgHumValue = rightData["Humidity Accuracy:"].trim();

    const avgTemLabelWidth = doc.getTextWidth(avgTemLabel);
    const avgTempValueWidth = doc.getTextWidth(avgTempValue);
    const avgHumLabelWidth = doc.getTextWidth(avgHumLabel);

    const xAfterAvgTemp = marginRightX + avgTemLabelWidth + 2;
    const xAfterAvgTempValue = xAfterAvgTemp + avgTempValueWidth + 2;

    doc.setFont(undefined, "bold");
    doc.text(avgTemLabel, marginRightX, yStart);
    doc.setFont(undefined, "normal");
    doc.text(minHumValue, xAfterAvgTemp, yStart);
    doc.setFont(undefined, "bold");
    doc.text(avgHumLabel, xAfterAvgTempValue, yStart);
    doc.setFont(undefined, "normal");
    doc.text(avgHumValue, xAfterAvgTempValue + avgHumLabelWidth + 2, yStart);

    // ===== Horizontal Line 4 =====
    doc.setLineWidth(0.08);
    doc.line(marginX, currentLine += 5, pageWidth - 15, currentLine);

    // ===== Section 4 Heading =====
    doc.setFont(undefined, "bold").setFontSize(10).setTextColor('#003366');
    doc.text("Trend", marginX, currentLine += 7);
    doc.setTextColor(0, 0, 0);

    // ====== Temperature Dual Chart  ======
    doc.setFont(undefined, "bold").setFontSize(11);
    doc.text("Temperature", marginX, currentLine += 7);
    doc.addImage(dualChart, "PNG", 15, currentLine += 5, pageWidth - 30, 60);

    // ====== HUmidity Chart  ======
    doc.setFont(undefined, "bold").setFontSize(11);
    doc.text("Humidity", marginX, currentLine += 70);
    doc.addImage(humidChart, "PNG", 15, currentLine += 5, pageWidth - 30, 60);

    footerText(1, totalPagesExp);


    // ======> Table Pages <======

    let currentPage = 2;
    let chunked = dummyData.reduce((acc, val, i) => {
        const idx = Math.floor(i / 40);
        if (!acc[idx]) acc[idx] = [];
        acc[idx].push(val);
        return acc;
    }, []);

    chunked.forEach((data, index) => {
        doc.addPage();
        // ===== Title =====
        headerText("Dummy");

        autoTable(doc, {
            startY: 24,
            headStyles: {
                halign: "center",
                valign: "middle",
                lineColor: [0, 0, 0],
                fillColor: ["#003366"],
                lineWidth: 0.2,
            },
            bodyStyles: {
                halign: "center",
                valign: "middle",
                lineColor: [0, 0, 0],
                lineWidth: 0.2,
                fontSize: 8,
                cellPadding: 1.4,
            },
            head: [["Sr. No.", "Timestamp", "Temperature 1 (°C)", "Temperature 2 (°C)", "Humidity"]],
            body: data.map((row) => [
                row.sr,
                row.timestamp,
                row.temperature1,
                row.temperature2,
                row.humidity
            ]),
            theme: "grid",
            margin: { left: marginX, right: marginX },
            didParseCell: function (dataCell) {
                if (dataCell.section === 'body') {
                    const colIndex = dataCell.column.index;

                    if (colIndex === 2) {
                        const temp = parseFloat(dataCell.cell.raw);
                        if (temp < 25.0) {
                            dataCell.cell.styles.textColor = [255, 165, 0]; // yellow-orange
                        } else if (temp >= 30.0) {
                            dataCell.cell.styles.textColor = [255, 0, 0]; // red
                        }
                    }
                    if (colIndex === 3) {
                        const temp = parseFloat(dataCell.cell.raw);
                        if (temp < 25.0) {
                            dataCell.cell.styles.textColor = [255, 165, 0]; // yellow-orange
                        } else if (temp >= 30.0) {
                            dataCell.cell.styles.textColor = [255, 0, 0]; // red
                        }
                    }
                }
            }
        });

        footerText(currentPage, chunked.length + 1);
        currentPage++;
    });
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    doc.save("pdfs/Dual_Temp_Single_Humid_Diff_Graphs.pdf");

}

generatePDF();
