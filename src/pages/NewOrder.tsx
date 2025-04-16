
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ChevronRight,
  Clipboard,
  Leaf,
  Minus,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STORES, getAllItems, getItemsByIndex, addItem, getItem } from "@/lib/db";
import { MenuItem, Order, OrderItem, Settings } from "@/types";
import { toast } from "sonner";

const NewOrder = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [taxRate, setTaxRate] = useState(5); // Default 5%
  
  const [tableNumber, setTableNumber] = useState("");
  const [waiterName, setWaiterName] = useState("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // Calculate totals whenever cart changes
  useEffect(() => {
    const newSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const newTax = (newSubtotal * taxRate) / 100;
    const newTotal = newSubtotal + newTax;
    
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [cart, taxRate]);

  const loadData = async () => {
    try {
      // Get all menu items
      const items = await getAllItems<MenuItem>(STORES.MENU_ITEMS);
      setMenuItems(items);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(items.map((item) => item.category))
      ).sort();
      setCategories(uniqueCategories);
      
      // Set default active category
      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0]);
      }
      
      // Load settings
      const settings = await getItem<Settings>(STORES.SETTINGS, "main");
      if (settings && settings.taxRate) {
        setTaxRate(settings.taxRate);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load menu items");
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setNotes("");
    
    // If item has multiple prices, open dialog to select size
    if (item.prices) {
      const sizes = Object.keys(item.prices);
      setSelectedSize(sizes[0] || "");
      setIsAddDialogOpen(true);
    } else {
      // If item has a single price, add directly to cart
      const newItem: OrderItem = {
        id: Date.now(),
        menuItemId: item.id || 0,
        menuItemName: item.name,
        quantity: 1,
        unitPrice: item.price || 0,
        totalPrice: item.price || 0,
      };
      
      setCart([...cart, newItem]);
      toast.success(`Added ${item.name} to order`);
    }
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItem) return;
    
    // Set price and initialize other required properties
    let unitPrice = 0;
    let totalPrice = 0;
    
    if (selectedItem.prices && selectedSize) {
      unitPrice = selectedItem.prices[selectedSize] || 0;
      totalPrice = unitPrice * quantity;
    } else {
      unitPrice = selectedItem.price || 0;
      totalPrice = unitPrice * quantity;
    }
    
    const newItem: OrderItem = {
      id: Date.now(),
      menuItemId: selectedItem.id || 0,
      menuItemName: selectedItem.name,
      quantity: quantity,
      unitPrice: unitPrice,
      totalPrice: totalPrice,
      notes: notes,
      size: selectedItem.prices && selectedSize ? selectedSize : undefined,
    };
    
    setCart([...cart, newItem]);
    setIsAddDialogOpen(false);
    toast.success(`Added ${selectedItem.name} to order`);
  };

  const handleUpdateCartItem = (id: number, quantity: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const updatedQuantity = Math.max(1, quantity); // Ensure minimum quantity is 1
        return {
          ...item,
          quantity: updatedQuantity,
          totalPrice: item.unitPrice * updatedQuantity,
        };
      }
      return item;
    });
    
    setCart(updatedCart);
  };

  const handleRemoveCartItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cannot place an empty order");
      return;
    }
    
    if (!tableNumber) {
      toast.error("Table number is required");
      return;
    }
    
    try {
      // Generate order number (e.g., LBW-2023001)
      const timestamp = new Date();
      const orderNumber = `LBW-${timestamp.getTime().toString().slice(-6)}`;
      
      const order: Order = {
        orderNumber,
        tableNumber,
        items: cart,
        subtotal,
        tax,
        total,
        timestamp,
        status: "pending",
        waiterName: waiterName || undefined,
      };
      
      const orderId = await addItem<Order>(STORES.ORDERS, order);
      
      toast.success("Order placed successfully");
      navigate(`/kot/${orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

  // Filter menu items by category and search term
  const filteredItems = menuItems.filter((item) => {
    const categoryMatch = activeCategory === "" || item.category === activeCategory;
    
    const searchMatch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] gap-4">
      {/* Menu Section (Left) */}
      <div className="md:w-3/5 h-full overflow-y-auto pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">New Order</h1>
          <Button variant="outline" onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>

        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-secondary"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="bg-secondary mb-4 flex flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className="bg-secondary cursor-pointer hover:bg-secondary/80"
                onClick={() => handleAddToCart(item)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium flex items-center">
                      {item.isVeg && <Leaf className="h-4 w-4 mr-1 text-green-500" />}
                      {item.name}
                    </h3>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  )}
                  <div className="mt-2 text-sm">
                    {item.price ? (
                      <span className="font-semibold">₹{item.price}</span>
                    ) : (
                      <span className="font-semibold">
                        ₹{Object.values(item.prices || {}).sort((a, b) => a - b)[0]} - 
                        ₹{Object.values(item.prices || {}).sort((a, b) => a - b).pop()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>

      {/* Order Section (Right) */}
      <div className="md:w-2/5 h-full overflow-y-auto">
        <Card className="bg-secondary h-full flex flex-col">
          <CardHeader>
            <CardTitle>Current Order</CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tableNumber">Table Number*</Label>
                  <Input
                    id="tableNumber"
                    placeholder="Enter table number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waiterName">Waiter Name</Label>
                  <Input
                    id="waiterName"
                    placeholder="Enter waiter name"
                    value={waiterName}
                    onChange={(e) => setWaiterName(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Order Items</h3>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No items added to the order yet</p>
                    <p className="text-sm">Select menu items from the left</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center pb-2 border-b border-border">
                        <div className="flex-1">
                          <div className="font-medium">{item.menuItemName}</div>
                          {item.size && (
                            <div className="text-xs text-muted-foreground">{item.size}</div>
                          )}
                          {item.notes && (
                            <div className="text-xs italic text-muted-foreground">{item.notes}</div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateCartItem(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <div>₹{item.totalPrice.toFixed(2)}</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleRemoveCartItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax ({taxRate}%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2">
            <div className="w-full space-y-2">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handlePlaceOrder}
                disabled={cart.length === 0 || !tableNumber}
              >
                Place Order & Generate KOT
                <Clipboard className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  if (cart.length > 0) {
                    if (confirm("Are you sure you want to clear the order?")) {
                      setCart([]);
                      setTableNumber("");
                      setWaiterName("");
                    }
                  } else {
                    navigate("/orders");
                  }
                }}
              >
                {cart.length > 0 ? "Clear Order" : "Cancel"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to Order</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-2">
              <h3 className="font-medium flex items-center">
                {selectedItem.isVeg && <Leaf className="h-4 w-4 mr-1 text-green-500" />}
                {selectedItem.name}
              </h3>
              
              {selectedItem.prices && (
                <div className="space-y-2">
                  <Label htmlFor="size">Select Size</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(selectedItem.prices).map(([size, price]) => (
                        <SelectItem key={size} value={size}>
                          {size} - ₹{price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="E.g., Extra spicy, No onions, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleConfirmAddToCart}>
              <Plus className="mr-2 h-4 w-4" />
              Add to Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewOrder;
