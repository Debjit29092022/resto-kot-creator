
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getItem, getItemsByIndex, updateItem, STORES } from "@/lib/db";
import { Order, Profile } from "@/types";
import { toast } from "sonner";
import { ArrowLeft, Printer } from "lucide-react";

const KOT = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const orderData = await getItem<Order>(STORES.ORDERS, parseInt(id));
          if (orderData) {
            setOrder(orderData);
          } else {
            toast.error("Order not found");
            navigate("/orders");
          }
        } else {
          toast.error("No order ID provided");
          navigate("/orders");
        }

        const profileData = await getItem<Profile>(STORES.PROFILE, "main");
        if (profileData) {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load order data");
      }
    };

    loadData();
  }, [id, navigate]);

  const handlePrint = async () => {
    try {
      if (!order) return;

      // Mark order as processing
      if (order.status === "pending") {
        const updatedOrder = { ...order, status: "processing" as const };
        await updateItem(STORES.ORDERS, updatedOrder);
        setOrder(updatedOrder);
      }

      // Use standard printing functionality
      window.print();
      toast.success("KOT sent to printer");
      
    } catch (error) {
      console.error("Error printing KOT:", error);
      toast.error("Failed to print KOT");
    }
  };

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

  if (!order) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print KOT
        </Button>
      </div>

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

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printRef, #printRef * {
            visibility: visible;
          }
          #printRef {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm; /* Standard thermal printer width */
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default KOT;
