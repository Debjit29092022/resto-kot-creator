
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Bell, Search, X } from "lucide-react";
import { getItem } from "@/lib/db";
import { STORES } from "@/lib/db";
import { Profile } from "@/types";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState("Legendary Baos & Wings");

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
  }, []);

  return (
    <header className="h-16 w-full border-b border-border flex items-center px-4 sticky top-0 bg-background z-10">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 ml-4">
        <h1 className="text-xl font-semibold text-primary">{restaurantName}</h1>
      </div>
      
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
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
