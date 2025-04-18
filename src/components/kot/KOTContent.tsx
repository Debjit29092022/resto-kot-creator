
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Order, Profile } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Printer, Download, QrCode } from "lucide-react";
import QRCode from "react-qr-code";

interface KOTContentProps {
  order: Order;
  profile: Profile | null;
  printRef: React.RefObject<HTMLDivElement>;
}

export const KOTContent = ({ order, profile, printRef }: KOTContentProps) => {
  const qrValue = `upi://pay?pa=yourupi@bank&pn=RestaurantName&am=${order.total}`;
  const qrRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // Calculate CGST and SGST (each 2.5%)
  const taxPercentage = order.taxPercentage || 5;
  const halfTaxPercentage = taxPercentage / 2;
  const subtotal = Number(order.subtotal || 0);
  const halfTaxAmount = (subtotal * (halfTaxPercentage / 100));

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4 lg:justify-end">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print KOT
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="overflow-hidden bg-white dark:bg-background print:shadow-none">
        <div className="p-6 print:p-0" ref={printRef}>
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">
              {profile?.restaurantName || "Legendary Baos & Wings"}
            </h1>
            <p className="text-muted-foreground">
              {profile?.address || "123 Flavor Street, Foodie District"}
            </p>
            <p className="text-muted-foreground">
              {profile?.phone || "Phone: +91 9876543210"}
            </p>
          </div>

          <div className="mb-6 flex justify-between text-sm">
            <div>
              <p>
                <span className="font-medium">Order #:</span> {order.orderNumber || order.id}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(order.timestamp).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Time:</span>{" "}
                {new Date(order.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p>
                <span className="font-medium">Type:</span> {order.orderType || "Dine In"}
              </p>
              {order.orderType === "Dine In" && order.tableNumber && (
                <p>
                  <span className="font-medium">Table:</span> {order.tableNumber}
                </p>
              )}
              <p>
                <span className="font-medium">Status:</span> {order.status}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="pb-2 text-left">Item</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b dark:border-gray-800">
                    <td className="py-2 text-left">
                      <div className="font-medium">{item.menuItemName}</div>
                      {item.size && (
                        <div className="text-xs text-muted-foreground">
                          Size: {item.size}
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-xs text-muted-foreground">
                          Note: {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(Number(item.price || item.unitPrice))}
                    </td>
                    <td className="py-2 text-right">
                      {formatCurrency(Number(item.totalPrice))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 border-t pt-4 dark:border-gray-700">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>{formatCurrency(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between mb-1 text-sm">
              <span>CGST ({halfTaxPercentage}%):</span>
              <span>{formatCurrency(halfTaxAmount)}</span>
            </div>
            <div className="flex justify-between mb-1 text-sm">
              <span>SGST ({halfTaxPercentage}%):</span>
              <span>{formatCurrency(halfTaxAmount)}</span>
            </div>
            {order.discount && order.discount > 0 && (
              <div className="flex justify-between mb-1">
                <span>Discount:</span>
                <span>-{formatCurrency(Number(order.discount))}</span>
              </div>
            )}
            <div className="flex justify-between mt-2 border-t pt-2 dark:border-gray-700 font-bold">
              <span>Total:</span>
              <span>{formatCurrency(Number(order.total))}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="mb-4 bg-white p-2 rounded" ref={qrRef}>
              <QRCode value={qrValue} size={120} />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Scan to pay via UPI
            </p>
          </div>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p className="mb-1">Thank you for dining with us!</p>
            <p>GSTIN: 07AABCS1429B1Z</p>
            <p>This is a computer-generated receipt and does not require a signature.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
