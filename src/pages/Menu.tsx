
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Edit,
  Trash2, 
  Save, 
  X, 
  Leaf,
  Search 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { STORES, getAllItems, addItem, updateItem, deleteItem } from "@/lib/db";
import { MenuItem } from "@/types";
import { toast } from "sonner";

type MenuItemFormData = {
  id?: number;
  category: string;
  name: string;
  price?: number;
  priceOption: "single" | "multiple";
  prices?: {
    "1 PC"?: number;
    "2 PCS"?: number;
    "3 PCS"?: number;
    "4 PCS"?: number;
    "6 PCS"?: number;
    "8 PCS"?: number;
    "12 PCS"?: number;
  };
  description?: string;
  isVeg: boolean;
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<MenuItemFormData>({
    category: "",
    name: "",
    priceOption: "single",
    price: 0,
    prices: {},
    description: "",
    isVeg: false,
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const items = await getAllItems<MenuItem>(STORES.MENU_ITEMS);
      setMenuItems(items);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(items.map((item) => item.category))
      ).sort();
      setCategories(uniqueCategories);
      
      // Set default active category
      if (uniqueCategories.length > 0 && activeCategory === "") {
        setActiveCategory(uniqueCategories[0]);
      }
    } catch (error) {
      console.error("Error loading menu items:", error);
      toast.error("Failed to load menu items");
    }
  };

  const handleAddItem = () => {
    setFormData({
      category: categories.length > 0 ? categories[0] : "",
      name: "",
      priceOption: "single",
      price: 0,
      prices: {},
      description: "",
      isVeg: false,
    });
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    // Convert to form data format
    const itemFormData: MenuItemFormData = {
      id: item.id,
      category: item.category,
      name: item.name,
      priceOption: item.prices ? "multiple" : "single",
      price: item.price || 0,
      prices: item.prices || {},
      description: item.description || "",
      isVeg: item.isVeg,
    };
    
    setFormData(itemFormData);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = async (id?: number) => {
    if (!id) return;
    
    try {
      await deleteItem(STORES.MENU_ITEMS, id);
      setMenuItems(menuItems.filter((item) => item.id !== id));
      toast.success("Menu item deleted successfully");
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiplePriceChange = (size: string, value: string) => {
    const numValue = parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      prices: {
        ...prev.prices,
        [size]: isNaN(numValue) ? 0 : numValue,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // Convert form data to MenuItem format
      const menuItem: MenuItem = {
        ...(formData.id ? { id: formData.id } : {}),
        category: formData.category,
        name: formData.name,
        description: formData.description,
        isVeg: formData.isVeg,
      };
      
      // Add price based on option
      if (formData.priceOption === "single") {
        menuItem.price = formData.price;
      } else {
        menuItem.prices = formData.prices;
      }
      
      if (editMode && formData.id) {
        await updateItem(STORES.MENU_ITEMS, menuItem);
        setMenuItems(
          menuItems.map((item) => (item.id === formData.id ? menuItem : item))
        );
        toast.success("Menu item updated successfully");
      } else {
        const id = await addItem(STORES.MENU_ITEMS, menuItem);
        setMenuItems([...menuItems, { ...menuItem, id }]);
        toast.success("Menu item added successfully");
        
        // Add new category if it doesn't exist
        if (!categories.includes(menuItem.category)) {
          setCategories([...categories, menuItem.category].sort());
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error("Failed to save menu item");
    }
  };

  const handleNewCategory = (categoryName: string) => {
    if (!categories.includes(categoryName) && categoryName.trim() !== "") {
      setCategories([...categories, categoryName].sort());
      setFormData((prev) => ({ ...prev, category: categoryName }));
    }
  };

  const filteredItems = menuItems.filter((item) => {
    // Filter by category
    const categoryMatch = activeCategory === "all" || item.category === activeCategory;
    
    // Filter by search term
    const searchMatch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search menu items..."
            className="pl-8 bg-secondary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="bg-secondary mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All
          </TabsTrigger>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-secondary">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center">
                    {item.isVeg && <Leaf className="h-4 w-4 mr-2 text-green-500" />}
                    {item.name}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEditItem(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{item.category}</div>
              </CardHeader>
              <CardContent>
                {item.description && <p className="text-sm">{item.description}</p>}
                <div className="mt-2">
                  {item.price ? (
                    <p className="font-semibold">₹{item.price}</p>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(item.prices || {}).map(([size, price]) => (
                        <div key={size} className="flex justify-between text-sm">
                          <span>{size}</span>
                          <span className="font-semibold">₹{price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleFormChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <button
                    className="w-full px-2 py-1.5 text-sm text-left hover:bg-secondary"
                    onClick={() => {
                      const newCategory = prompt("Enter new category name");
                      if (newCategory) handleNewCategory(newCategory);
                    }}
                  >
                    + Add new category
                  </button>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleFormChange("description", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Price Type</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Single</span>
                  <Switch
                    checked={formData.priceOption === "multiple"}
                    onCheckedChange={(checked) =>
                      handleFormChange("priceOption", checked ? "multiple" : "single")
                    }
                  />
                  <span className="text-sm">Multiple</span>
                </div>
              </div>

              {formData.priceOption === "single" ? (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) =>
                      handleFormChange("price", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Label htmlFor="price1">1 PC Price (₹)</Label>
                    <Input
                      id="price1"
                      type="number"
                      value={formData.prices?.["1 PC"] || ""}
                      onChange={(e) => handleMultiplePriceChange("1 PC", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label htmlFor="price2">2 PCS Price (₹)</Label>
                    <Input
                      id="price2"
                      type="number"
                      value={formData.prices?.["2 PCS"] || ""}
                      onChange={(e) => handleMultiplePriceChange("2 PCS", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label htmlFor="price3">3 PCS Price (₹)</Label>
                    <Input
                      id="price3"
                      type="number"
                      value={formData.prices?.["3 PCS"] || ""}
                      onChange={(e) => handleMultiplePriceChange("3 PCS", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label htmlFor="price4">4 PCS Price (₹)</Label>
                    <Input
                      id="price4"
                      type="number"
                      value={formData.prices?.["4 PCS"] || ""}
                      onChange={(e) => handleMultiplePriceChange("4 PCS", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label htmlFor="price8">8 PCS Price (₹)</Label>
                    <Input
                      id="price8"
                      type="number"
                      value={formData.prices?.["8 PCS"] || ""}
                      onChange={(e) => handleMultiplePriceChange("8 PCS", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label htmlFor="price12">12 PCS Price (₹)</Label>
                    <Input
                      id="price12"
                      type="number"
                      value={formData.prices?.["12 PCS"] || ""}
                      onChange={(e) => handleMultiplePriceChange("12 PCS", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVeg"
                checked={formData.isVeg}
                onCheckedChange={(checked) =>
                  handleFormChange("isVeg", !!checked)
                }
              />
              <Label
                htmlFor="isVeg"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Vegetarian Item
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              {editMode ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;
