
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  LayoutDashboard,
  Menu as MenuIcon,
  ShoppingBag,
  ChefHat,
  User,
  Settings,
  BarChart3,
  CreditCard,
  Clock,
  Store,
  FileText,
  Utensils
} from "lucide-react";
import { getItem } from "@/lib/db";
import { STORES } from "@/lib/db";
import { Profile } from "@/types";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Menu",
    href: "/menu",
    icon: <MenuIcon className="h-5 w-5" />,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Kitchen Display",
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

const quickActions = [
  {
    title: "New Order",
    href: "/new-order",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Sales Report",
    href: "/dashboard", 
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Recent Orders",
    href: "/orders",
    icon: <Clock className="h-5 w-5" />,
  },
];

const NavigationMenu = () => {
  const { pathname } = useLocation();
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-primary-900 to-primary-950 text-white overflow-hidden">
      <div className="p-4 flex justify-center items-center border-b border-primary-800">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="/lovable-uploads/1da52370-ca5d-4160-bf46-ed3e4876b96c.png" 
            alt="Restaurant Logo" 
            className="h-16 w-auto mb-2 hover:scale-105 transition-transform"
          />
          <h1 className="text-lg font-semibold text-center">{restaurantName}</h1>
        </motion.div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <motion.div 
          className="px-3 space-y-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => (
            <motion.div key={item.href} variants={itemVariants}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white/70 hover:text-white hover:bg-primary-800 transition-all",
                  pathname === item.href && "bg-primary-800 text-white"
                )}
                asChild
              >
                <Link to={item.href}>
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-6 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="px-4 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
            Quick Access
          </h2>
          <motion.div className="space-y-1" variants={containerVariants}>
            {quickActions.map((action, index) => (
              <motion.div 
                key={action.href} 
                variants={itemVariants}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-primary-800 transition-all"
                  asChild
                >
                  <Link to={action.href}>
                    {action.icon}
                    <span className="ml-2">{action.title}</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      <div className="p-4 border-t border-primary-800 bg-primary-900/50">
        <div className="flex items-center">
          <Store className="h-5 w-5 text-primary-300" />
          <div className="ml-2">
            <p className="text-sm font-medium">Restaurant Manager</p>
            <p className="text-xs text-white/50">v1.3.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;
