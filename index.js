import { jsPDF } from "jspdf";

// Create document
const doc = new jsPDF();

// Page Config
const pageWidth = doc.internal.pageSize.getWidth();
let linePos = 10;
const leftColumnX = 15;
const rightColumnX = pageWidth / 2;

// Font Sizes
const titleFont = 14;
const headingFont = 12;
const paragraphFont = 10;

// Font Style
const fontName = "helvetica";
const fontBold = "bold";
const fontNormal = "normal";

// ===== Sample Data (from DB or API) =====
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

// ===== Title =====
const title = "Data Report";
doc.setFont(fontName, fontBold).setFontSize(titleFont).setTextColor(60, 130, 225);
let textWidth = doc.getTextWidth(title);
doc.text(title, (pageWidth - textWidth) / 2, linePos);
doc.setTextColor(0, 0, 0);

// ===== Paragraph =====
const paragraph = "Test";
doc.setFont(fontName, fontNormal).setFontSize(paragraphFont);
textWidth = doc.getTextWidth(paragraph);
doc.text(paragraph, (pageWidth - textWidth) / 2, linePos += 5);

// ===== Horizontal Line 1 =====
doc.setLineWidth(0.5);
doc.line(15, linePos += 5, pageWidth - 15, linePos);

// ===== Section 1 Heading =====
doc.setFont(fontName, fontBold).setFontSize(headingFont).setTextColor(60, 130, 225);
doc.text("Device Info", leftColumnX, linePos += 7);
doc.setTextColor(0, 0, 0);

// ===== Left Column 1 - Labels Bold, Values Normal =====
doc.setFontSize(paragraphFont);
linePos += 5;

// Make:
doc.setFont(fontName, fontBold);
doc.text("Make:", leftColumnX, linePos);
doc.setFont(fontName, fontNormal);
doc.text(leftData["Make:"], leftColumnX + doc.getTextWidth("Make:") + 2, linePos);

// Model:
linePos += 5;
doc.setFont(fontName, fontBold);
doc.text("Model:", leftColumnX, linePos);
doc.setFont(fontName, fontNormal);
doc.text(leftData["Model:"], leftColumnX + doc.getTextWidth("Model:") + 2, linePos);

// Serial No:
linePos += 5;
doc.setFont(fontName, fontBold);
doc.text("Serial No:", leftColumnX, linePos);
doc.setFont(fontName, fontNormal);
doc.text(leftData["Serial No:"], leftColumnX + doc.getTextWidth("Serial No:") + 2, linePos);

// Instrument ID:
linePos += 5;
doc.setFont(fontName, fontBold);
doc.text("Instrument ID:", leftColumnX, linePos);
doc.setFont(fontName, fontNormal);
doc.text(leftData["Instrument ID:"], leftColumnX + doc.getTextWidth("Instrument ID:") + 2, linePos);

// ===== Right Column 1 - Same Y Positions =====
let yStart = linePos - (3 * 5); // Go back 3 lines for right column start

// Temperature Resolution:
doc.setFont(fontName, fontBold);
doc.text("Temperature Resolution:", rightColumnX, yStart);
doc.setFont(fontName, fontNormal);
doc.text(rightData["Temperature Resolution:"], rightColumnX + doc.getTextWidth("Temperature Resolution:") + 4, yStart);

// Temperature Accuracy:
yStart += 5;
doc.setFont(fontName, fontBold);
doc.text("Temperature Accuracy:", rightColumnX, yStart);
doc.setFont(fontName, fontNormal);
doc.text(rightData["Temperature Accuracy:"], rightColumnX + doc.getTextWidth("Temperature Accuracy:") + 4, yStart);

// Humidity Resolution:
yStart += 5;
doc.setFont(fontName, fontBold);
doc.text("Humidity Resolution:", rightColumnX, yStart);
doc.setFont(fontName, fontNormal);
doc.text(rightData["Humidity Resolution:"], rightColumnX + doc.getTextWidth("Humidity Resolution:") + 4, yStart);

// Humidity Accuracy:
yStart += 5;
doc.setFont(fontName, fontBold);
doc.text("Humidity Accuracy:", rightColumnX, yStart);
doc.setFont(fontName, fontNormal);
doc.text(rightData["Humidity Accuracy:"], rightColumnX + doc.getTextWidth("Humidity Accuracy:") + 4, yStart);

// ===== Horizontal Line 2 =====
doc.setLineWidth(0.5);
doc.line(15, linePos += 5, pageWidth - 15, linePos);

// ===== Section 2 Heading =====
doc.setFont(fontName, fontBold).setFontSize(headingFont).setTextColor(60, 130, 225);
doc.text("Logger Summary", leftColumnX, linePos += 7);
doc.setTextColor(0, 0, 0);

// ===== Left Column 2 - Labels Bold, Values Normal =====
doc.setFontSize(paragraphFont);
linePos += 5;

// Start Date & Time:
doc.setFont(fontName, fontBold);
doc.text("Start Date & Time:", leftColumnX, linePos);
doc.setFont(fontName, fontNormal);
doc.text(leftData["Make:"], leftColumnX + doc.getTextWidth("Start Date & Time:") + 4, linePos);

// End Date & Time:
linePos += 5;
doc.setFont(fontName, fontBold);
doc.text("End Date & Time:", leftColumnX, linePos);
doc.setFont(fontName, fontNormal);
doc.text(leftData["Model:"], leftColumnX + doc.getTextWidth("End Date & Time:") + 4, linePos);

// Recording Interval:
linePos += 5;
doc.setFont(fontName, fontBold);
doc.text("Recording Interval:", leftColumnX, linePos);
doc.setFont(fontName, fontNormal);
doc.text(leftData["Serial No:"], leftColumnX + doc.getTextWidth("Recording Interval:") + 4, linePos);

// ===== Right Column 2 - Same Y Positions =====
yStart = linePos - (2 * 5); // Go back 3 lines for right column start

// Sending Interval:
doc.setFont(fontName, fontBold);
doc.text("Sending Interval:", rightColumnX, yStart);
doc.setFont(fontName, fontNormal);
doc.text(rightData["Temperature Resolution:"], rightColumnX + doc.getTextWidth("Sending Interval:") + 4, yStart);

// Min Set Temperature:
yStart += 5;
doc.setFont(fontName, fontBold);
doc.text("Min Set Temperature:", rightColumnX, yStart);
doc.setFont(fontName, fontNormal);
doc.text(rightData["Temperature Accuracy:"], rightColumnX + doc.getTextWidth("Min Set Temperature:") + 4, yStart);

// Min Set Humidity:
yStart += 5;
doc.setFont(fontName, fontBold);
doc.text("Min Set Humidity:", rightColumnX, yStart);
doc.setFont(fontName, fontNormal);
doc.text(rightData["Humidity Resolution:"], rightColumnX + doc.getTextWidth("Min Set Humidity:") + 4, yStart);

// ===== Horizontal Line 3 =====
doc.setLineWidth(0.5);
doc.line(15, linePos += 5, pageWidth - 15, linePos);

// ===== Section 3 Heading =====
doc.setFont(fontName, fontBold).setFontSize(headingFont).setTextColor(60, 130, 225);
doc.text("Observed Report Summary", leftColumnX, linePos += 7);
doc.setTextColor(0, 0, 0);

// ===== Left Column 3 - Labels Bold, Values Normal =====
doc.setFontSize(paragraphFont);
linePos += 5;

// Min Temperature:
doc.setFont(fontName, fontBold);
doc.text("Min Temperature:", leftColumnX, linePos);
doc.setFont(fontName, fontNormal);
doc.text(leftData["Make:"], leftColumnX + doc.getTextWidth("Min Temperature:") + 2, linePos);

// Max Temperature:
linePos += 5;
doc.setFont(fontName, fontBold);
doc.text("Max Temperature:", leftColumnX, linePos);
doc.setFont(fontName, fontNormal);
doc.text(leftData["Model:"], leftColumnX + doc.getTextWidth("Max Temperature:") + 2, linePos);

// MKT:
linePos += 5;
doc.setFont(fontName, fontBold);
doc.text("MKT:", leftColumnX, linePos);
doc.setFont(fontName, fontNormal);
doc.text(leftData["Serial No:"], leftColumnX + doc.getTextWidth("MKT:") + 2, linePos);

// ===== Right Column 3 - Same Y Positions =====
yStart = linePos - (2 * 5); // Go back 3 lines for right column start

// Min Humidity:
doc.setFont(fontName, fontBold);
doc.text("Min Humidity:", rightColumnX, yStart);
doc.setFont(fontName, fontNormal);
doc.text(rightData["Temperature Resolution:"], rightColumnX + doc.getTextWidth("Min Humidity:") + 4, yStart);

// Max Humidity:
yStart += 5;
doc.setFont(fontName, fontBold);
doc.text("Max Humidity:", rightColumnX, yStart);
doc.setFont(fontName, fontNormal);
doc.text(rightData["Temperature Accuracy:"], rightColumnX + doc.getTextWidth("Max Humidity:") + 4, yStart);

// Avg Temperature:
yStart += 5;
doc.setFont(fontName, fontBold);
doc.text("Avg Temperature:", rightColumnX, yStart);
doc.setFont(fontName, fontNormal);
doc.text(rightData["Humidity Resolution:"], rightColumnX + doc.getTextWidth("Avg Temperature:") + 4, yStart);

// ===== Horizontal Line 4 =====
doc.setLineWidth(0.5);
doc.line(15, linePos += 5, pageWidth - 15, linePos);

// ===== Section 4 Heading =====
doc.setFont(fontName, fontBold).setFontSize(headingFont).setTextColor(60, 130, 225);
doc.text("Trend", leftColumnX, linePos += 7);
doc.setTextColor(0, 0, 0);


// ===== Save PDF =====
doc.save("a.pdf");
