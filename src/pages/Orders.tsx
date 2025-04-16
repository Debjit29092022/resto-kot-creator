
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Clipboard, 
  FileText, 
  Plus, 
  Search,
  ShoppingCart,
  X 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STORES, getAllItems, deleteItem } from "@/lib/db";
import { Order } from "@/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const allOrders = await getAllItems<Order>(STORES.ORDERS);
      // Sort by timestamp, most recent first
      const sortedOrders = allOrders.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const handleCreateOrder = () => {
    navigate("/new-order");
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleDeleteOrder = async (id?: number) => {
    if (!id) return;
    
    try {
      await deleteItem(STORES.ORDERS, id);
      setOrders(orders.filter((order) => order.id !== id));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const handleGenerateKOT = (order: Order) => {
    navigate(`/kot/${order.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by status
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    
    // Filter by search term (table or order number)
    const searchMatch = 
      order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button onClick={handleCreateOrder}>
          <Plus className="mr-2 h-4 w-4" /> New Order
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by table or order number..."
            className="pl-8 bg-secondary w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-secondary">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
          <p className="mt-2 text-muted-foreground">
            Create a new order or adjust your search filters.
          </p>
          <Button className="mt-4" onClick={handleCreateOrder}>
            <Plus className="mr-2 h-4 w-4" /> Create Order
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="bg-secondary">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Table {order.tableNumber}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {order.orderNumber || `Order #${order.id}`}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`${getStatusColor(
                        order.status
                      )} h-2 w-2 rounded-full mr-2`}
                    />
                    <span className="text-sm capitalize">{order.status}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="font-medium">{order.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-medium">₹{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {new Date(order.timestamp).toLocaleString()}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewOrder(order)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleGenerateKOT(order)}
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  KOT
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.orderNumber || (selectedOrder?.id ? `Order #${selectedOrder.id}` : "")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Table {selectedOrder.tableNumber}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedOrder.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`${getStatusColor(
                        selectedOrder.status
                      )} h-2 w-2 rounded-full mr-2`}
                    />
                    <span className="text-sm capitalize">{selectedOrder.status}</span>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="p-3 border-b bg-secondary/50">
                    <h4 className="font-medium">Order Items</h4>
                  </div>
                  <div className="p-3 space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div>
                          <span>{item.quantity}x </span>
                          <span className="font-medium">{item.menuItemName}</span>
                          {item.size && <span className="ml-1 text-muted-foreground">({item.size})</span>}
                        </div>
                        <span>₹{item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between gap-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    if (selectedOrder.id) {
                      handleDeleteOrder(selectedOrder.id);
                      setShowOrderDetails(false);
                    }
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Delete Order
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleGenerateKOT(selectedOrder)}
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  Generate KOT
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
