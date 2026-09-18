"use client";

import React, { useRef } from "react";
import { formatPrice } from "@/lib/products";
import type { CartItem } from "@/context/CartContext";
import type { DeliveryMethod } from "@/types/order";
import {
  FaPrint,
  FaWhatsapp,
  FaFilePdf,
  FaPhone,
  FaLocationDot,
  FaTruckFast,
} from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export interface InvoiceData {
  orderId: string;
  orderDate: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  deliveryMethod: DeliveryMethod;
  paymentMethod: string;
  couponCode?: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceData;
}

// Convert amount to words helper for Indian Rupees
function numberToWords(amount: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function convertChunk(num: number): string {
    let str = "";
    if (num >= 100) {
      str += ones[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }
    if (num >= 20) {
      str += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }
    if (num > 0) {
      str += ones[num] + " ";
    }
    return str.trim();
  }

  if (amount === 0) return "Zero Rupees Only";

  let num = Math.round(amount);
  let words = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remainder = num;

  if (crore > 0) words += convertChunk(crore) + " Crore ";
  if (lakh > 0) words += convertChunk(lakh) + " Lakh ";
  if (thousand > 0) words += convertChunk(thousand) + " Thousand ";
  if (remainder > 0) words += convertChunk(remainder);

  return words.trim() + " Rupees Only";
}

/**
 * Generates an isolated, ultra-clean HTML printable document and triggers browser print
 * This guarantees 100% reliability with ZERO blank pages in Chrome, Safari, and mobile!
 */
export function printInvoiceDocument(data: InvoiceData) {
  const printWindow = window.open("", "_blank", "width=850,height=900");
  if (!printWindow) {
    alert("Please allow popups to print/save invoice");
    return;
  }

  const itemsRows = data.items
    .map(
      (item, idx) => `
      <tr>
        <td style="text-align: center; color: #666;">${idx + 1}</td>
        <td><strong>${item.product.name}</strong></td>
        <td style="color: #666;">${item.product.category_name || "Crackers"}</td>
        <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
        <td style="text-align: right;">₹${item.product.price.toLocaleString("en-IN")}</td>
        <td style="text-align: right; font-weight: bold;">₹${(
          item.product.price * item.quantity
        ).toLocaleString("en-IN")}</td>
      </tr>
    `
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice #${data.orderId} - ATM Crackers</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      padding: 16px;
      color: #18181b;
      background: #fff;
      font-size: 12px;
      line-height: 1.4;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #18181b;
      padding-bottom: 12px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #09090b;
    }
    .brand-sub {
      font-size: 10px;
      font-weight: 800;
      color: #b91c1c;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 1px;
    }
    .company-info {
      font-size: 11px;
      color: #3f3f46;
      margin-top: 6px;
      line-height: 1.45;
    }
    .company-info strong {
      color: #09090b;
    }
    .meta-box {
      text-align: right;
    }
    .badge {
      display: inline-block;
      background: #18181b;
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .meta-line {
      font-size: 11px;
      color: #52525b;
      margin-bottom: 2px;
    }
    .meta-line strong {
      color: #09090b;
    }
    .customer-grid {
      display: flex;
      justify-content: space-between;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 14px;
    }
    .col {
      width: 48%;
    }
    .sec-title {
      font-size: 9px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
    }
    .cust-name {
      font-size: 13px;
      font-weight: 800;
      color: #09090b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      border: 1px solid #cbd5e1;
    }
    th {
      background: #f1f5f9;
      text-align: left;
      padding: 7px 10px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #334155;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      padding: 7px 10px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 11px;
    }
    .total-grid {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .words-box {
      width: 55%;
    }
    .words-val {
      font-style: italic;
      background: #f8fafc;
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #1e293b;
      margin-top: 3px;
    }
    .lorry-note {
      font-size: 10px;
      color: #b45309;
      background: #fffbeb;
      border: 1px solid #fde68a;
      padding: 6px 8px;
      border-radius: 6px;
      margin-top: 8px;
      line-height: 1.35;
    }
    .calc-box {
      width: 40%;
    }
    .calc-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-size: 11px;
      color: #475569;
    }
    .calc-grand {
      display: flex;
      justify-content: space-between;
      padding-top: 6px;
      border-top: 2px solid #09090b;
      font-size: 14px;
      font-weight: 900;
      color: #b91c1c;
      margin-top: 4px;
    }
    .footer-box {
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 10px;
      color: #64748b;
    }
    .sign-box {
      text-align: right;
    }
    .sign-line {
      border-bottom: 1px solid #94a3b8;
      width: 140px;
      margin-bottom: 4px;
      margin-left: auto;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand-title">ATM CRACKERS</div>
        <div class="brand-sub">Premium Sivakasi Fireworks</div>
        <div class="company-info">
          12/476/4 RATHINAPURI NAGAR, MEENAMPATTI Anuppankulam<br>
          Sivakasi, Tamil Nadu, India<br>
          <strong>Email:</strong> ATMCRACKERS@GMAIL.COM • <strong>Phone:</strong> +91 8056566845<br>
          <strong>GSTIN: 33ACHFA6073E1ZN</strong>
        </div>
      </div>
      <div class="meta-box">
        <span class="badge">Tax Invoice / Bill</span>
        <div class="meta-line">Invoice No: <strong>INV-${data.orderId}</strong></div>
        <div class="meta-line">Order Date: <strong>${data.orderDate}</strong></div>
        <div class="meta-line">Payment: <strong>Cash on Delivery (MANUAL)</strong></div>
        <div class="meta-line">Transport: <strong>Sivakasi Lorry Service</strong></div>
      </div>
    </div>

    <div class="customer-grid">
      <div class="col">
        <div class="sec-title">Billed &amp; Shipped To:</div>
        <div class="cust-name">${data.customer.fullName}</div>
        <div>${data.customer.streetAddress}</div>
        <div>${data.customer.city}, ${data.customer.state || "Tamil Nadu"} - <strong>${data.customer.pincode}</strong></div>
        ${data.customer.landmark ? `<div><em>Landmark: ${data.customer.landmark}</em></div>` : ""}
      </div>
      <div class="col" style="text-align: right;">
        <div class="sec-title">Contact &amp; Delivery Hub:</div>
        <div><strong>Mobile:</strong> +91 ${data.customer.phone}</div>
        ${data.customer.email ? `<div><strong>Email:</strong> ${data.customer.email}</div>` : ""}
        <div><strong>Dispatch:</strong> Sivakasi Fireworks Hub</div>
        <div><strong>Freight Terms:</strong> To-Pay at Delivery Godown</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 30px; text-align: center;">#</th>
          <th>Item Description</th>
          <th>Category</th>
          <th style="width: 50px; text-align: center;">Qty</th>
          <th style="width: 90px; text-align: right;">Rate</th>
          <th style="width: 100px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="total-grid">
      <div class="words-box">
        <div class="sec-title">Amount in Words:</div>
        <div class="words-val">${numberToWords(data.grandTotal)}</div>
        <div class="lorry-note">
          <strong>Lorry Transport Notice:</strong> Crackers are dispatched via registered fireworks parcel lorry transport. Freight charges are calculated based on your destination pincode &amp; weight, and paid directly by buyer at the parcel office upon pickup (To-Pay basis).
        </div>
      </div>
      <div class="calc-box">
        <div class="calc-row">
          <span>Items Subtotal:</span>
          <strong>₹${data.subtotal.toLocaleString("en-IN")}</strong>
        </div>
        ${
          data.discount > 0
            ? `<div class="calc-row" style="color: #16a34a;">
                <span>Discount (${data.couponCode || "Coupon"}):</span>
                <strong>-₹${data.discount.toLocaleString("en-IN")}</strong>
              </div>`
            : ""
        }
        <div class="calc-row">
          <span>Transport Freight:</span>
          <strong style="color: #b45309;">To-Pay at Parcel Office</strong>
        </div>
        <div class="calc-grand">
          <span>Grand Total:</span>
          <span>₹${data.grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <div class="footer-box">
      <div>
        <strong>Terms:</strong> Fireworks goods once dispatched cannot be cancelled in transit. Direct factory Sivakasi packing.
      </div>
      <div class="sign-box">
        <div class="sign-line"></div>
        <strong>For ATM CRACKERS</strong><br>
        Authorized Signatory • Sivakasi
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function InvoiceModal({ isOpen, onClose, data }: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  function handlePrint() {
    printInvoiceDocument(data);
  }

  // Construct complete WhatsApp bill text
  const itemsText = data.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ₹${(
          item.product.price * item.quantity
        ).toLocaleString("en-IN")}`
    )
    .join("\n");

  const whatsappMessage = `Hi ATM Crackers,
I have placed order #${data.orderId} for ₹${data.grandTotal.toLocaleString("en-IN")}. Please confirm dispatch.

🧾 *TAX INVOICE / BILL DETAILS*
----------------------------------
*Order ID:* ${data.orderId}
*Date:* ${data.orderDate}
*Customer:* ${data.customer.fullName} (+91 ${data.customer.phone})
*Address:* ${data.customer.streetAddress}, ${data.customer.city} - ${data.customer.pincode}

📦 *ITEMS ORDERED:*
${itemsText}
----------------------------------
*Subtotal:* ₹${data.subtotal.toLocaleString("en-IN")}
${data.discount > 0 ? `*Promo Discount:* -₹${data.discount.toLocaleString("en-IN")}\n` : ""}*Transport Freight:* To-Pay at Parcel Office by Customer
💰 *Grand Total:* ₹${data.grandTotal.toLocaleString("en-IN")}
💳 *Payment:* Cash on Delivery (MANUAL)

*ATM CRACKERS*
12/476/4 RATHINAPURI NAGAR, MEENAMPATTI Anuppankulam
GSTIN: 33ACHFA6073E1ZN
Email: ATMCRACKERS@GMAIL.COM`;

  const whatsappUrl = `https://wa.me/918056566845?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice #${data.orderId} - ATM Crackers`,
          text: whatsappMessage,
        });
      } catch {
        // Fallback to direct link
        window.open(whatsappUrl, "_blank");
      }
    } else {
      window.open(whatsappUrl, "_blank");
    }
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 my-auto overflow-hidden animate-slide-up">
        {/* Modal Top Action Bar */}
        <div className="bg-zinc-950 text-white px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <FaFilePdf className="text-crimson text-2xl" />
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                Tax Invoice & Delivery Bill
              </h3>
              <p className="text-[11px] text-zinc-400">
                GSTIN: 33ACHFA6073E1ZN • ATM CRACKERS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-crimson text-white text-xs font-bold rounded-xl hover:bg-[#991B1B] transition-all cursor-pointer shadow-md active:scale-95"
              title="Print or Save as PDF"
            >
              <FaPrint /> Print / Save as PDF
            </button>

            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#1ebd5a] transition-all cursor-pointer shadow-md active:scale-95"
              title="Share Bill via WhatsApp"
            >
              <FaWhatsapp className="text-sm" /> Send Bill via WhatsApp
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <IoClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* ─── On-Screen Preview ─── */}
        <div
          ref={invoiceRef}
          className="p-6 sm:p-10 bg-white text-zinc-900 text-sm max-h-[75vh] overflow-y-auto"
        >
          {/* Header Box */}
          <div className="border-b-2 border-zinc-900 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center p-1 border border-zinc-800 shrink-0">
                    <img
                      src="/images/logo.png"
                      alt="ATM Crackers"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black font-display tracking-tight text-zinc-900 leading-none">
                      ATM CRACKERS
                    </h1>
                    <span className="text-[10px] font-bold text-crimson uppercase tracking-widest block mt-0.5">
                      Premium Sivakasi Fireworks
                    </span>
                  </div>
                </div>

                <div className="text-xs text-zinc-600 space-y-0.5 leading-relaxed font-medium">
                  <p>12/476/4 RATHINAPURI NAGAR, MEENAMPATTI Anuppankulam</p>
                  <p>Sivakasi, Tamil Nadu, India</p>
                  <p className="flex items-center gap-2 pt-0.5">
                    <span>
                      <strong>Email:</strong> ATMCRACKERS@GMAIL.COM
                    </span>
                    <span>•</span>
                    <span>
                      <strong>Phone:</strong> +91 8056566845
                    </span>
                  </p>
                  <p className="text-zinc-900 font-bold text-xs pt-0.5">
                    GSTIN: 33ACHFA6073E1ZN
                  </p>
                </div>
              </div>

              <div className="sm:text-right bg-zinc-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none w-full sm:w-auto border sm:border-0 border-zinc-100">
                <span className="inline-block px-3 py-1 bg-zinc-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-md mb-2">
                  Tax Invoice / Bill
                </span>
                <div className="text-xs text-zinc-600 space-y-1">
                  <p>
                    <span className="text-zinc-400">Invoice No:</span>{" "}
                    <strong className="text-zinc-900 font-bold">
                      INV-{data.orderId}
                    </strong>
                  </p>
                  <p>
                    <span className="text-zinc-400">Date:</span>{" "}
                    <strong className="text-zinc-900">{data.orderDate}</strong>
                  </p>
                  <p>
                    <span className="text-zinc-400">Payment:</span>{" "}
                    <strong className="text-emerald-700 font-semibold">
                      Cash on Delivery (MANUAL)
                    </strong>
                  </p>
                  <p>
                    <span className="text-zinc-400">Transport:</span>{" "}
                    <strong className="text-zinc-900">
                      Sivakasi Lorry Transport (To-Pay)
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs">
            <div>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FaLocationDot className="text-crimson" /> Billed &amp; Shipped To:
              </p>
              <p className="font-bold text-zinc-900 text-sm">
                {data.customer.fullName}
              </p>
              <p className="text-zinc-600 mt-0.5">
                {data.customer.streetAddress}
              </p>
              <p className="text-zinc-600">
                {data.customer.city},{" "}
                {data.customer.state || "Tamil Nadu"} -{" "}
                <span className="font-bold text-zinc-900">
                  {data.customer.pincode}
                </span>
              </p>
              {data.customer.landmark && (
                <p className="text-zinc-500 italic mt-0.5">
                  Landmark: {data.customer.landmark}
                </p>
              )}
            </div>

            <div className="sm:border-l sm:border-zinc-200 sm:pl-4 space-y-1.5">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FaPhone className="text-zinc-500" /> Contact Info:
              </p>
              <p className="text-zinc-700">
                <strong>Mobile:</strong> +91 {data.customer.phone}
              </p>
              {data.customer.email && (
                <p className="text-zinc-700">
                  <strong>Email:</strong> {data.customer.email}
                </p>
              )}
              <p className="text-[11px] text-amber-700 font-medium pt-1">
                Lorry Freight: To be paid directly upon parcel collection
              </p>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="mb-6 overflow-hidden rounded-xl border border-zinc-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-200 font-bold text-zinc-700 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 text-center w-10">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {data.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50">
                    <td className="py-2.5 px-3 text-center text-zinc-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">
                      {item.product.name}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500">
                      {item.product.category_name || "Crackers"}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-zinc-800">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-600 font-medium">
                      {formatPrice(item.product.price)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-zinc-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pt-2">
            <div className="text-xs text-zinc-500 max-w-sm">
              <p className="font-bold text-zinc-800 mb-1">Amount in Words:</p>
              <p className="italic text-zinc-700 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                {numberToWords(data.grandTotal)}
              </p>
              <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <FaTruckFast className="text-amber-600 text-base shrink-0 mt-0.5" />
                <p>
                  <strong>Lorry Transport Notice:</strong> Lorry service freight charges are calculated based on your destination pincode &amp; weight. Payable directly by buyer at the parcel office upon pickup (To-Pay basis).
                </p>
              </div>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs border-t sm:border-t-0 pt-3 sm:pt-0">
              <div className="flex justify-between text-zinc-600">
                <span>
                  Items Subtotal ({data.items.reduce((s, i) => s + i.quantity, 0)} items):
                </span>
                <span className="font-semibold text-zinc-900">
                  {formatPrice(data.subtotal)}
                </span>
              </div>

              {data.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Festival Promo Discount:</span>
                  <span className="font-semibold">
                    −{formatPrice(data.discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600 items-center">
                <span>Transport / Freight:</span>
                <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                  To-Pay at Parcel Office
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-zinc-900 pt-2 border-t-2 border-zinc-900">
                <span>Grand Total:</span>
                <span className="text-crimson text-lg font-black">
                  {formatPrice(data.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Declaration & Signatory Seal */}
          <div className="border-t border-zinc-200 pt-5 mt-4 flex flex-col sm:flex-row justify-between items-end gap-4 text-xs text-zinc-500">
            <div>
              <p className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider mb-1">
                Terms &amp; Conditions:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-zinc-500">
                <li>Goods once booked cannot be cancelled during festive transit.</li>
                <li>Delivery is handled via authorized Sivakasi fireworks transport logistics.</li>
                <li>Freight charges are to-pay directly at destination parcel godown.</li>
              </ul>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="inline-block border-b-2 border-zinc-400 w-40 pb-1 mb-1.5 text-center">
                <span className="text-[10px] text-zinc-400 italic">
                  Factory Seal &amp; Sign
                </span>
              </div>
              <p className="font-bold text-zinc-900 text-xs">
                For ATM CRACKERS
              </p>
              <p className="text-[10px] text-zinc-500">
                Authorized Signatory • Sivakasi
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-500">
            💡 Select <strong>Save as PDF</strong> in the print preview window to download the PDF file.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-crimson text-white text-xs font-bold rounded-xl hover:bg-[#991B1B] transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <FaPrint /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
