
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  Clipboard,
  Home,
  Menu as MenuIcon,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Menu",
    href: "/menu",
    icon: <MenuIcon className="h-5 w-5" />,
  },
  {
    title: "KOT",
    href: "/kot",
    icon: <Clipboard className="h-5 w-5" />,
  },
  {
    title: "Kitchen",
    href: "/kitchen",
    icon: <ChefHat className="h-5 w-5" />,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="h-screen w-64 bg-black border-r border-border flex flex-col">
      <div className="p-4 flex justify-center items-center">
        <img 
          src="lovable-uploads/1da52370-ca5d-4160-bf46-ed3e4876b96c.png" 
          alt="LBW Logo" 
          className="h-24 w-auto"
        />
      </div>
      
      <div className="px-3 py-2">
        <div className="mt-2 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              asChild
            >
              <Link to={item.href}>
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="mt-auto p-4 text-sm text-muted-foreground text-center">
        <div>Legendary Baos & Wings</div>
        <div className="text-xs">Restaurant Billing System</div>
      </div>
    </div>
  );
};

export default Sidebar;
