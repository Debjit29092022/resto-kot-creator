
import { Order, Profile } from "@/types";
import { Card } from "@/components/ui/card";
import { QrCode } from "lucide-react";

interface KOTContentProps {
  order: Order;
  profile: Profile | null;
  printRef: React.RefObject<HTMLDivElement>;
}

export const KOTContent = ({ order, profile, printRef }: KOTContentProps) => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate subtotal, taxes, and grand total
  const subtotal = order.items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  const cgstRate = 2.5; // 2.5% CGST
  const sgstRate = 2.5; // 2.5% SGST
  const cgstAmount = (subtotal * cgstRate) / 100;
  const sgstAmount = (subtotal * sgstRate) / 100;
  const grandTotal = subtotal + cgstAmount + sgstAmount;

  return (
    <Card className="max-w-md mx-auto bg-white text-black">
      <div id="printRef" ref={printRef} className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold uppercase">
            {profile?.restaurantName || "Legendary Baos & Wings"}
          </h1>
          <p className="text-sm">
            {profile?.address || "123 Flavor Street, Foodie District"}
          </p>
          <p className="text-sm">
            {profile?.phone || "+91 9876543210"} | {profile?.email || "info@legendarybw.com"}
          </p>
          <div className="border-t border-b border-dashed border-gray-400 py-2 mt-3">
            <h2 className="text-lg font-bold">KITCHEN ORDER TICKET</h2>
          </div>
        </div>

        <div className="flex justify-between text-sm mb-4">
          <div>
            <p><span className="font-bold">Order #:</span> {order.id}</p>
            <p><span className="font-bold">Date:</span> {getCurrentDate()}</p>
          </div>
          <div className="text-right">
            <p><span className="font-bold">Time:</span> {getCurrentTime()}</p>
            <p><span className="font-bold">Waiter:</span> {order.waiterName || "Staff"}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Order Details</h3>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody className="border-t border-gray-300">
              {order.items.map((item, index) => (
                <tr key={index} className="border-b border-dashed border-gray-200">
                  <td className="py-2">
                    <div>{item.menuItemName}</div>
                    {item.size && <div className="text-xs text-gray-500">Size: {item.size}</div>}
                    {item.notes && <div className="text-xs text-gray-500">Note: {item.notes}</div>}
                  </td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">₹{Number(item.totalPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-300 pt-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>CGST @ {cgstRate}%:</span>
            <span>₹{cgstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span>SGST @ {sgstRate}%:</span>
            <span>₹{sgstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-dashed border-gray-400 pt-2">
            <span>GRAND TOTAL:</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center items-center flex-col">
          <div className="border-2 border-gray-300 p-2 mb-2 inline-block">
            <QrCode className="h-24 w-24" />
          </div>
          <p className="text-xs text-center text-gray-500">Scan to pay or verify</p>
        </div>

        <div className="mt-6 text-center text-xs border-t border-dashed border-gray-400 pt-3">
          <p className="font-medium">Thank you for your order!</p>
          <p className="text-gray-500 mt-1">Order processed on {new Date(order.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
};
