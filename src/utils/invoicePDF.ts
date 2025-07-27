import jsPDF from "jspdf";
import QRCode from "qrcode";

export interface InvoiceOrder {
  orderNumber: string;
  createdAt: string | Date;
  user?: {
    name?: string;
    email?: string;
    address?: string;
    document?: string;
    dv?: string;
  };
  emitter?: {
    point?: string;
  };
  cufe?: string;
  protocol?: string;
  paymentDueDate?: string;
  paymentMethod?: string;
  orderItems: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  total?: number;
}

export async function generateInvoicePDF(order: InvoiceOrder): Promise<jsPDF> {
  const doc = new jsPDF();
  const rowHeight = 6;

  doc.setFontSize(9);
  doc.setFont("bold");
  doc.text("DGI", 105, 12, { align: "center" });
  doc.text("Comprobante Auxiliar de Factura Electrónica", 105, 16, { align: "center" });
  doc.text("Factura de Operación Interna", 105, 20, { align: "center" });

  let y = 28;
  doc.setFont("bold");
  doc.text("Emisor: Fumigadora Professional Technical Pest Control", 15, y);
  doc.setFont("normal");
  doc.text(`RUC: 123456789`, 15, y + 3);
  doc.text(`DV: 01`, 15, y + 6);
  doc.text(`Dirección: David, Chiriquí`, 15, y + 9);

  const qrDataUrl = await QRCode.toDataURL(`https://fumigadorapt.com/validar/${order.orderNumber}`);
  doc.addImage(qrDataUrl, "PNG", 150, 10, 45, 45);

  y += 15;
  doc.setFont("bold");
  doc.text("Cliente:", 15, y);
  doc.setFont("normal");
  doc.text(order.user?.name || "", 35, y);
  doc.text(`RUC/Cédula/Pasaporte: ${order.user?.document || ""}`, 15, y + 3);
  doc.text(`DV: ${order.user?.dv || ""}`, 15, y + 6);
  doc.text(`Dirección: ${order.user?.address || ""}`, 15, y + 9);

  y += 16;
  doc.setFont("bold");
  doc.text("Número:", 15, y);
  doc.setFont("normal");
  doc.text(order.orderNumber, 35, y);
  doc.text("Fecha de Emisión:", 15, y + 3);
  doc.text(new Date(order.createdAt).toLocaleDateString(), 50, y + 3);
  doc.text("Punto de Facturación:", 15, y + 6);
  doc.text(order.emitter?.point || "999", 50, y + 6);

  const rightAlignedX = 140;
  doc.setFontSize(8);
  doc.text(
    "Consulte por la clave de acceso en: https://dgi-fep.mef.gob.pa/Consulta/FacturasPorCUFE",
    rightAlignedX,
    y,
    { align: "center" }
  );
  doc.text(`CUFE: FEO120000${order.orderNumber} ${order.cufe || ""}`, rightAlignedX, y + 3, { align: "center" });
  doc.text(`Protocolo de autorización: ${order.protocol || "20240000000000000000"}, de ${new Date(order.createdAt).toLocaleDateString()}`, rightAlignedX, y + 6, { align: "center" });

  // Tabla de productos
  y = 70;
  doc.setFontSize(9);
  const startX = 15;
  const colWidths = [10, 50, 15, 15, 20, 20, 15, 15, 20];
  const headers = ["No.", "Descripción", "Cantidad", "Unidad", "Valor Unitario", "Descuento", "Monto", "ITBMS", "Valor Item"];
  const colX: number[] = [];
  colWidths.forEach((width, i) => {
    colX[i] = i === 0 ? startX : colX[i - 1] + colWidths[i - 1];
  });

  doc.setFont("bold");
  headers.forEach((header, i) => {
    doc.text(header, colX[i] + 1, y + 4);
    doc.rect(colX[i], y, colWidths[i], rowHeight);
  });
  y += rowHeight;
  doc.setFont("normal");

  let subtotal = 0;
  order.orderItems.forEach((item: any, idx: number) => {
    const unitPrice = Number(item.unitPrice);
    const quantity = Number(item.quantity);
    const totalItem = unitPrice * quantity;
    subtotal += totalItem;

    const rowY = y;
    colWidths.forEach((width, i) => {
      doc.rect(colX[i], rowY, width, rowHeight);
    });

    doc.text(String(idx + 1), colX[0] + 1, rowY + 4);
    const description = item.productName;
    const descMaxWidth = colWidths[1] - 2;
    let shortDesc = description;
    if (doc.getTextWidth(description) > descMaxWidth) {
      for (let i = description.length; i > 0; i--) {
        const substr = description.substring(0, i) + "...";
        if (doc.getTextWidth(substr) <= descMaxWidth) {
          shortDesc = substr;
          break;
        }
      }
    }
    doc.text(shortDesc, colX[1] + 1, rowY + 4);
    doc.text(String(quantity), colX[2] + 1, rowY + 4);
    doc.text("UND", colX[3] + 1, rowY + 4);
    doc.text(`$${unitPrice.toFixed(2)}`, colX[4] + 1, rowY + 4);
    doc.text("0.00", colX[5] + 1, rowY + 4);
    doc.text(`$${totalItem.toFixed(2)}`, colX[6] + 1, rowY + 4);
    doc.text("0.00", colX[7] + 1, rowY + 4);
    doc.text(`$${totalItem.toFixed(2)}`, colX[8] + colWidths[8] - 1, rowY + 4, { align: "right" });

    y += rowHeight;
  });

  const itbms = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + itbms).toFixed(2);

  const valorItemX = colX[8];           
  const valorItemWidth = colWidths[8];  
  const totalLabelX = valorItemX - 17; 

   doc.rect(valorItemX, y, valorItemWidth, rowHeight);

   doc.text("Valor Total", totalLabelX, y + 4);

   doc.text(`$${(subtotal).toFixed(2)}`, valorItemX + valorItemWidth - 2, y + 4, { align: "right" });

  y += rowHeight; 
  y += 6;

  const leftStartX = 15;
  const leftColWidths = [38, 22, 30];
  const leftTableWidth = leftColWidths.reduce((a, b) => a + b, 0);
  const desgloseData = [["54.00", "Exento", "0.00"], ["0.00", "7", "0.00"], ["54.00", "10", itbms.toFixed(2)], ["0.00", "15", "0.00"]];

  doc.setFont("bold");
  doc.rect(leftStartX, y, leftTableWidth, rowHeight);
  doc.text("Desglose ITBMS", leftStartX + leftTableWidth / 2, y + 4, { align: "center" });

  const leftHeaders = ["Monto Base", "%", "Impuesto"];
  const leftColX = [leftStartX];
  leftColWidths.forEach((w, i) => (leftColX[i + 1] = leftColX[i] + w));

  let rowY = y + rowHeight;
  leftHeaders.forEach((header, i) => {
    doc.text(header, leftColX[i] + 2, rowY + 4);
    doc.rect(leftColX[i], rowY, leftColWidths[i], rowHeight);
  });

  doc.setFont("normal");
  rowY += rowHeight;
  desgloseData.forEach((row) => {
    row.forEach((cell, i) => {
      const content = i === 2 ? `$${cell}` : cell;
      const alignRight = i === 0 || i === 2;
      doc.text(content, leftColX[i] + (alignRight ? leftColWidths[i] - 2 : 2), rowY + 4, {
        align: alignRight ? "right" : "left",
      });
      doc.rect(leftColX[i], rowY, leftColWidths[i], rowHeight);
    });
    rowY += rowHeight;
  });

  doc.setFont("bold");
  doc.text("Total", leftColX[0] + 2, rowY + 4);
  doc.text(`$${itbms.toFixed(2)}`, leftColX[2] + leftColWidths[2] - 2, rowY + 4, { align: "right" });
  doc.rect(leftColX[0], rowY, leftColWidths[0] + leftColWidths[1], rowHeight);
  doc.rect(leftColX[2], rowY, leftColWidths[2], rowHeight);

  const leftTableHeight = rowY + rowHeight - y;

  const rightStartX = 175;
  const rightColWidth = 20;
  const rightY = y + 1;
  const rightLabels = ["Total Neto", "Monto Exento ITBMS", "Monto Gravado ITBMS", "ITBMS", "Total Impuesto", "Total"];
  const rightValues = [subtotal.toFixed(2), "0.00", subtotal.toFixed(2), itbms.toFixed(2), itbms.toFixed(2), total.toFixed(2)];

  for (let i = 0; i <= rightLabels.length; i++) {
    const py = rightY + i * rowHeight;
    doc.line(rightStartX, py, rightStartX + rightColWidth, py);
  }
  doc.line(rightStartX, rightY, rightStartX, rightY + rightLabels.length * rowHeight);
  doc.line(rightStartX + rightColWidth, rightY, rightStartX + rightColWidth, rightY + rightLabels.length * rowHeight);

  rightLabels.forEach((label, i) => {
    const py = rightY + i * rowHeight + 4;
    doc.setFont(i >= 3 ? "bold" : "normal");
    doc.text(label, rightStartX - 2, py, { align: "right" });
    doc.text(`$${rightValues[i]}`, rightStartX + rightColWidth - 2, py, { align: "right" });
  });

  y += Math.max(leftTableHeight, rightLabels.length * rowHeight) + 10;

  doc.setFontSize(9);

  doc.setFont("bold");
  doc.rect(15, y, 90, 6);
  doc.text("Información de Pago a Plazo", 60, y + 4, { align: "center" });
  y += 6;

  doc.setFont("bold");
  doc.rect(15, y, 30, 6);
  doc.rect(45, y, 30, 6);
  doc.rect(75, y, 30, 6);
  doc.text("Cuota", 30, y + 4, { align: "center" });
  doc.text("Fecha de Vencimiento", 60, y + 4, { align: "center" });
  doc.text("Valor", 90, y + 4, { align: "center" });

  y += 6;
  doc.setFont("normal");
  doc.rect(15, y, 30, 6);
  doc.rect(45, y, 30, 6);
  doc.rect(75, y, 30, 6);
  doc.text("1", 44, y + 4, { align: "right" });
  doc.text(order.paymentDueDate || "0/0/0000", 74, y + 4, { align: "right" });
  doc.text(`$${total.toFixed(2)}`, 104, y + 4, { align: "right" });

  y -= 18;
  doc.setFontSize(9);

  const resumenStartX = 155;
  const resumenColWidths = [20, 20];
  const resumenTableWidth = resumenColWidths.reduce((a, b) => a + b, 0);

  const resumenLabels = ["Crédito", "Total Pagado", "Vuelto"];
  const resumenValues = [
    order.paymentMethod || "Crédito",
    `$${total.toFixed(2)}`,
    "0.00"
  ];

  doc.text("Resumen de Pago", resumenStartX + resumenColWidths[0] - 2, y + 4, { align: "right" });
  y += rowHeight;

  doc.setFont("normal");
  resumenLabels.forEach((label, i) => {
    const rowY = y + i * rowHeight;

    doc.rect(resumenStartX + resumenColWidths[0], rowY, resumenColWidths[1], rowHeight);

    doc.text(label, resumenStartX + resumenColWidths[0] - 2, rowY + 4, { align: "right" });

    doc.text(resumenValues[i], resumenStartX + resumenTableWidth - 2, rowY + 4, { align: "right" });
  });

  y += resumenLabels.length * rowHeight;

  doc.setFontSize(7);
  doc.setFont("italic");
  doc.text("Generado desde Facturador Gratuito SFEFP, validado por la DGI. Decreto 766 de 29/12/2020 y sus modificaciones. Ley 256 de 26/11/2021.", 15, 285);
  doc.text("Resolución No.201-9775 de 20 de octubre de 2023.", 15, 289);
  doc.text("Página 1 de 1", 195, 289, { align: "right" });

  return doc;
}
