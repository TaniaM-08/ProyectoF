"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { Download, Eye } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const generateInvoicePDF = async (order: any) => {
    const doc = new jsPDF();
    const rowHeight = 6;

    // Encabezado fiscal
    doc.setFontSize(9);
    doc.setFont("bold");
    doc.text("DGI", 105, 12, { align: "center" });
    doc.text("Comprobante Auxiliar de Factura Electrónica", 105, 16, { align: "center" });
    doc.text("Factura de Operación Interna", 105, 20, { align: "center" });

    // Emisor y QR
    let y = 28;
    doc.setFont("bold");
    doc.text("Emisor: Fumigadora Professional Technical Pest Control", 15, y);
    doc.setFont("normal");
    doc.text(`RUC: 123456789`, 15, y + 3);
    doc.text(`DV: 01`, 15, y + 6);
    doc.text(`Dirección: David, Chiriquí`, 15, y + 9);

    const qrDataUrl = await QRCode.toDataURL(`https://fumigadorapt.com/validar/${order.orderNumber}`);
    doc.addImage(qrDataUrl, "PNG", 150, 10, 45, 45);

    // Cliente
    y += 15;
    doc.setFont("bold");
    doc.text("Cliente:", 15, y);
    doc.setFont("normal");
    doc.text(order.user?.name || "", 35, y);
    doc.text(`RUC/Cédula/Pasaporte: ${order.user?.document || ""}`, 15, y + 3);
    doc.text(`DV: ${order.user?.dv || ""}`, 15, y + 6);
    doc.text(`Dirección: ${order.user?.address || ""}`, 15, y + 9);

    // Datos de factura
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
// Fila de total al final de la tabla de productos (solo última columna con borde)
const valorItemX = colX[8];           // Última columna ("Valor Item")
const valorItemWidth = colWidths[8];  // Ancho de esa columna
const totalLabelX = valorItemX - 17;  // Posición del texto "Valor Total" afuera de la tabla

// Dibujar borde solo para la celda de total
doc.rect(valorItemX, y, valorItemWidth, rowHeight);

// Texto "Valor Total" alineado a la derecha, afuera de la tabla
doc.text("Valor Total", totalLabelX, y + 4);

// Valor total dentro de la celda, alineado a la derecha
doc.text(`$${(subtotal).toFixed(2)}`, valorItemX + valorItemWidth - 2, y + 4, { align: "right" });

y += rowHeight; // Avanza la Y para lo siguiente

    y += 6;

    // Tabla izquierda: Desglose ITBMS
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

    // Tabla derecha (totales)
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

    // Tabla Izquierda: Información de Pago a Plazo
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
    doc.text(order.paymentDueDate || "30/08/2024", 74, y + 4, { align: "right" });
    doc.text(`$${total.toFixed(2)}`, 104, y + 4, { align: "right" });

    y -= 18;
  doc.setFontSize(9);

  // Ajuste fino para acercar la tabla al margen derecho
  const resumenStartX = 155;
  const resumenColWidths = [20, 20];
  const resumenTableWidth = resumenColWidths.reduce((a, b) => a + b, 0);

  const resumenLabels = ["Crédito", "Total Pagado", "Vuelto"];
  const resumenValues = [
    order.paymentMethod || "Crédito",
    `$${total.toFixed(2)}`,
    "0.00"
  ];

  // Título alineado a la derecha con los demás textos
  doc.text("Resumen de Pago", resumenStartX + resumenColWidths[0] - 2, y + 4, { align: "right" });
  y += rowHeight;

  doc.setFont("normal");
  resumenLabels.forEach((label, i) => {
    const rowY = y + i * rowHeight;

    // Dibujar solo las celdas de valores
    doc.rect(resumenStartX + resumenColWidths[0], rowY, resumenColWidths[1], rowHeight);

    // Etiqueta alineada a la derecha, justo antes del valor
    doc.text(label, resumenStartX + resumenColWidths[0] - 2, rowY + 4, { align: "right" });

    // Valor alineado a la derecha dentro de su celda
    doc.text(resumenValues[i], resumenStartX + resumenTableWidth - 2, rowY + 4, { align: "right" });
  });

  y += resumenLabels.length * rowHeight;


  // Pie de página legal
  doc.setFontSize(7);
  doc.setFont("italic");
  doc.text("Generado desde Facturador Gratuito SFEFP, validado por la DGI. Decreto 766 de 29/12/2020 y sus modificaciones. Ley 256 de 26/11/2021.", 15, 285);
  doc.text("Resolución No.201-9775 de 20 de octubre de 2023.", 15, 289);
  doc.text("Página 1 de 1", 195, 289, { align: "right" });

  return doc;
  }


  const handleDownloadInvoice = async (order: any) => {
    const doc = await generateInvoicePDF(order);
    doc.save(`factura_${order.orderNumber}.pdf`);
  };

  const handleViewInvoice = async (order: any) => {
    const doc = await generateInvoicePDF(order);
    window.open(doc.output("bloburl"), "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800">
        Cargando compras...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mt-10 max-w-6xl mx-auto p-8 relative">
        <div className="relative flex items-center justify-center mb-10">
          <button
            onClick={() => window.history.back()}
            className="absolute left-0 inline-flex items-center gap-2 text-[#94C11F] border border-[#94C11F] px-4 py-2 rounded-md hover:bg-[#e5f3c7] transition"
          >
            ← Volver
          </button>

          <h2 className="text-4xl font-bold text-[#94C11F] text-center">
            Compras Realizadas
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-800 border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#f0f9e3] text-[#5d8000] text-left">
                <th className="p-3 font-semibold">N° Factura</th>
                <th className="p-3 font-semibold">Cliente</th>
                <th className="p-3 font-semibold">Correo</th>
                <th className="p-3 font-semibold">Fecha</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr
                  key={order.id}
                  className="hover:bg-[#f9fdf4] transition"
                >
                  <td className="p-3">{order.orderNumber}</td>
                  <td className="p-3">{order.user?.name}</td>
                  <td className="p-3">{order.user?.email}</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">${Number(order.total || 0).toFixed(2)}</td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="flex items-center gap-2 bg-[#94C11F] text-white px-4 py-1.5 rounded-md hover:bg-[#7da10c] focus-visible:ring-2 focus-visible:ring-[#bfdc5f] transition"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </button>
                    <button
                      onClick={() => handleViewInvoice(order)}
                      className="flex items-center gap-2 border border-[#94C11F] text-[#94C11F] px-4 py-1.5 rounded-md hover:bg-[#e5f3c7] focus-visible:ring-2 focus-visible:ring-[#bfdc5f] transition"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center text-gray-500 mt-6">
              No hay compras registradas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}