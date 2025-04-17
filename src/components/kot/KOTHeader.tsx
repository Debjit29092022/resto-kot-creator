
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Order } from "@/types";
import { STORES, updateItem } from "@/lib/db";
import { toast } from "sonner";

interface KOTHeaderProps {
  order: Order;
  setOrder: (order: Order) => void;
}

export const KOTHeader = ({ order, setOrder }: KOTHeaderProps) => {
  const navigate = useNavigate();

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

  return (
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
  );
};
