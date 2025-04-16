
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, Coffee, ChefHat } from "lucide-react";
import { 
  STORES, 
  getAllItems, 
  getItemsByIndex, 
  updateItem
} from "@/lib/db";
import { Order } from "@/types";
import { toast } from "sonner";

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    // Set up a polling mechanism to refresh orders every 10 seconds
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      // Get only orders with pending or processing status
      const allOrders = await getAllItems<Order>(STORES.ORDERS);
      const activeOrders = allOrders.filter(
        (order) => order.status === "pending" || order.status === "processing"
      );
      
      // Sort by timestamp, oldest first for pending, then oldest processing
      const sortedOrders = activeOrders.sort((a, b) => {
        // First sort by status (pending comes first)
        if (a.status === "pending" && b.status === "processing") return -1;
        if (a.status === "processing" && b.status === "pending") return 1;
        
        // Then sort by timestamp for same status
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateA - dateB;
      });
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load active orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (order: Order) => {
    try {
      const updatedOrder: Order = { ...order, status: "completed" as const };
      await updateItem(STORES.ORDERS, updatedOrder);
      setOrders(orders.filter((o) => o.id !== order.id));
      toast.success(`Order for Table ${order.tableNumber} marked as completed`);
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error("Failed to update order status");
    }
  };

  const getTimeElapsed = (timestamp: Date) => {
    const orderTime = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes === 1) return "1 minute ago";
    return `${diffInMinutes} minutes ago`;
  };

  const getStatusColor = (status: string, timestamp: Date) => {
    const orderTime = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (status === "pending") {
      if (diffInMinutes > 15) return "bg-red-500";
      if (diffInMinutes > 10) return "bg-yellow-500";
      return "bg-green-500";
    }
    
    return "bg-blue-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kitchen Display</h1>
        <Button variant="outline" onClick={loadOrders}>
          Refresh Orders
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No active orders</h3>
          <p className="mt-2 text-muted-foreground">
            All orders have been completed
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-secondary">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Table {order.tableNumber}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {order.orderNumber || `Order #${order.id}`}
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      order.status,
                      order.timestamp
                    )} text-white uppercase`}
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="text-sm flex items-center mt-1 text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {getTimeElapsed(order.timestamp)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-start justify-between text-sm">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Coffee className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">
                            {item.quantity}x {item.menuItemName}
                          </span>
                        </div>
                        {item.size && (
                          <div className="ml-6 text-xs text-muted-foreground">
                            Size: {item.size}
                          </div>
                        )}
                        {item.notes && (
                          <div className="ml-6 text-xs italic text-yellow-500">
                            Note: {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleCompleteOrder(order)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Kitchen;
