
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Menu, 
  Bell, 
  Search, 
  X, 
  Plus,
  Calendar,
  User
} from "lucide-react";
import { getItem } from "@/lib/db";
import { STORES } from "@/lib/db";
import { Profile } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState("Legendary Baos & Wings");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getItem<Profile>(STORES.PROFILE, "main");
        if (profile && profile.restaurantName) {
          setRestaurantName(profile.restaurantName);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
    
    // Format current date
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  return (
    <header className="h-16 w-full border-b border-border flex items-center px-4 sticky top-0 bg-background z-10 shadow-sm">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 ml-4 flex items-center">
        <h1 className="text-xl font-semibold text-primary hidden sm:block">{restaurantName}</h1>
        <div className="ml-4 text-sm text-muted-foreground hidden md:flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {currentDate}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          className="hidden md:flex"
          onClick={() => navigate("/new-order")}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
        
        {searchOpen ? (
          <div className="flex items-center mr-2">
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 bg-secondary"
              autoFocus
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchOpen(false)}
              className="ml-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-auto">
              <div className="flex items-start p-3 hover:bg-secondary">
                <div className="rounded-full bg-primary/10 p-2 mr-3">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-muted-foreground">Order #1234 has been placed</p>
                  <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start p-3 hover:bg-secondary">
                <div className="rounded-full bg-orange-500/10 p-2 mr-3">
                  <ChefHat className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Kitchen update</p>
                  <p className="text-xs text-muted-foreground">Order #1233 is ready for pickup</p>
                  <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
