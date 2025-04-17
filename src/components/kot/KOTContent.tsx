
import { Order, Profile } from "@/types";
import { Card } from "@/components/ui/card";

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

  return (
    <Card className="max-w-md mx-auto bg-white text-black">
      <div ref={printRef} className="p-6">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">KITCHEN ORDER TICKET</h1>
          <div className="flex justify-between mt-2 text-sm">
            <span>Date: {getCurrentDate()}</span>
            <span>Time: {getCurrentTime()}</span>
          </div>
          <div className="text-base font-bold mt-1">
            {profile?.restaurantName || "Legendary Baos & Wings"}
          </div>
        </div>

        <div className="flex justify-between text-sm border-t border-b border-dashed border-gray-400 py-1 mt-2">
          <span className="font-bold">Table: {order.tableNumber}</span>
          <span className="font-bold">KOT #: {order.id}</span>
        </div>

        <div className="mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-1">Item</th>
                <th className="text-center py-1">Qty</th>
                <th className="text-right py-1">Notes</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-b border-dashed border-gray-200">
                  <td className="py-1">
                    {item.menuItemName}
                    {item.size && <span className="ml-1">({item.size})</span>}
                  </td>
                  <td className="text-center py-1">{item.quantity}</td>
                  <td className="text-right py-1 text-xs">{item.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center text-sm">
          <p>Waiter: {order.waiterName || "Staff"}</p>
          <p className="mt-1 text-xs">
            {new Date(order.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};
