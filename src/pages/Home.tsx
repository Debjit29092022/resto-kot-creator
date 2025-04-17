
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItem, STORES } from "@/lib/db";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Restaurant, UtensilsCrossed, Phone, Mail, MapPin, Users, KanbanSquare, 
  LineChart, Settings, ChefHat, CalendarClock } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getItem<Profile>(STORES.PROFILE, "main");
        if (profileData) {
          setProfile(profileData);
        } else {
          // Create default profile if none exists
          const defaultProfile: Profile = {
            id: "main",
            restaurantName: "Legendary Baos & Wings",
            address: "123 Flavor Street, Foodie District",
            phone: "+91 9876543210",
            email: "info@legendarybw.com",
            tagline: "The Best Wings & Baos in Town!",
          };
          setProfile(defaultProfile);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

  // Navigation buttons data
  const navigationButtons = [
    { label: "Dashboard", icon: <LineChart className="h-5 w-5" />, path: "/dashboard" },
    { label: "Menu", icon: <UtensilsCrossed className="h-5 w-5" />, path: "/menu" },
    { label: "Orders", icon: <KanbanSquare className="h-5 w-5" />, path: "/orders" },
    { label: "Kitchen", icon: <ChefHat className="h-5 w-5" />, path: "/kitchen" },
    { label: "Profile", icon: <Users className="h-5 w-5" />, path: "/profile" },
    { label: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings" },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/30 rounded-lg p-8 mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Restaurant className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">
          {profile?.restaurantName || "Legendary Baos & Wings"}
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          {profile?.tagline || "The Best Wings & Baos in Town!"}
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => navigate("/dashboard")}>
            View Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/new-order")}>
            Create New Order
          </Button>
        </div>
      </div>

      {/* Navigation Section */}
      <h2 className="text-2xl font-bold mb-4">Quick Navigation</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {navigationButtons.map((button, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:bg-secondary transition-colors"
            onClick={() => navigate(button.path)}
          >
            <CardContent className="flex flex-col items-center p-6">
              {button.icon}
              <span className="mt-2">{button.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Restaurant Info */}
      <h2 className="text-2xl font-bold mb-4">Restaurant Information</h2>
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-muted-foreground">
                  {profile?.address || "123 Flavor Street, Foodie District"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-muted-foreground">
                  {profile?.phone || "+91 9876543210"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">
                  {profile?.email || "info@legendarybw.com"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CalendarClock className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Business Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Sunday: 11:00 AM - 10:00 PM
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="mt-auto">
        <Card className="bg-secondary">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Start Your Day?</h3>
            <p className="mb-4">Manage orders, track sales, and more with our restaurant management system.</p>
            <Button 
              className="w-full sm:w-auto" 
              size="lg" 
              onClick={() => navigate("/new-order")}
            >
              Create New Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
