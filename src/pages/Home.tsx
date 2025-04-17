
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItem, STORES } from "@/lib/db";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Utensils, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar,
  ChefHat,
  Award,
  ArrowRight,
  Star,
  Bell,
  ShoppingBag,
  Users,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import { motion } from "framer-motion";

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

  const testimonials = [
    {
      name: "Priya Sharma",
      comment: "The baos here are absolutely incredible! The flavors are authentic and the service is always top-notch.",
      rating: 5
    },
    {
      name: "Rahul Kapoor",
      comment: "Best wings in the city. The sauces are to die for, and the portions are generous.",
      rating: 5
    },
    {
      name: "Anika Patel",
      comment: "Love the atmosphere and the food. The Tikka Bao is my absolute favorite!",
      rating: 4
    }
  ];

  const specialties = [
    {
      name: "AAM KASHMUNDI WINGS",
      description: "Our signature wings with a perfect blend of mango and spices",
      icon: <Utensils className="h-8 w-8 text-primary" />
    },
    {
      name: "CHICKEN TIKKA BAO",
      description: "Soft, fluffy bao buns filled with flavorful tikka chicken",
      icon: <ChefHat className="h-8 w-8 text-primary" />
    },
    {
      name: "PERI PERI FRIES",
      description: "Crispy fries tossed in our secret peri peri seasoning",
      icon: <Award className="h-8 w-8 text-primary" />
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-900 to-primary-800 text-white py-20 px-6 rounded-2xl mb-16">
        <div className="absolute inset-0 bg-black opacity-20 z-0"></div>
        <div className="absolute inset-0 bg-[url('/lovable-uploads/1da52370-ca5d-4160-bf46-ed3e4876b96c.png')] bg-center bg-no-repeat opacity-10 z-0"></div>
        
        <motion.div 
          className="relative z-10 max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full">
              <Utensils className="h-16 w-16 text-primary-100" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {profile?.restaurantName || "Legendary Baos & Wings"}
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {profile?.tagline || "The Best Wings & Baos in Town!"}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary-900 hover:bg-primary-100"
              onClick={() => navigate("/new-order")}
            >
              Place an Order
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/menu")}
            >
              View Our Menu
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Specialties Section */}
      <motion.section 
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Specialties</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience our chef's signature creations, crafted with fresh ingredients and unique flavor combinations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    {specialty.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{specialty.name}</h3>
                  <p className="text-muted-foreground">{specialty.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section 
        className="mb-16 bg-secondary/50 rounded-2xl p-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <motion.div className="flex-1" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-4">About Our Restaurant</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2018, Legendary Baos & Wings brings together the perfect fusion of Asian and Western flavors. 
              Our chefs combine traditional techniques with innovative twists to create dishes that delight the palate.
            </p>
            <p className="text-muted-foreground mb-6">
              We're passionate about using fresh, locally-sourced ingredients and making everything from scratch - 
              from our pillowy soft bao buns to our signature wing sauces.
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate("/profile")}
            >
              Learn More About Us
            </Button>
          </motion.div>
          <motion.div 
            className="flex-1 grid grid-cols-2 gap-4"
            variants={itemVariants}
          >
            <div className="bg-primary-100 p-6 rounded-lg flex flex-col items-center text-center">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-bold">Skilled Team</h3>
              <p className="text-sm text-muted-foreground">Expert chefs with years of culinary experience</p>
            </div>
            <div className="bg-primary-100 p-6 rounded-lg flex flex-col items-center text-center">
              <Award className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-bold">Quality Food</h3>
              <p className="text-sm text-muted-foreground">Fresh ingredients and authentic recipes</p>
            </div>
            <div className="bg-primary-100 p-6 rounded-lg flex flex-col items-center text-center">
              <Bell className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-bold">Fast Service</h3>
              <p className="text-sm text-muted-foreground">Quick preparation without compromising quality</p>
            </div>
            <div className="bg-primary-100 p-6 rounded-lg flex flex-col items-center text-center">
              <ShoppingBag className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-bold">Online Orders</h3>
              <p className="text-sm text-muted-foreground">Convenient ordering system for takeaway</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="italic mb-4">"{testimonial.comment}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Information */}
      <motion.section 
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold mb-6">Restaurant Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-4 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-lg">Address</h3>
                      <p className="text-muted-foreground">
                        {profile?.address || "123 Flavor Street, Foodie District"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 mr-4 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-muted-foreground">
                        {profile?.phone || "+91 9876543210"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 mr-4 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-muted-foreground">
                        {profile?.email || "info@legendarybw.com"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 mr-4 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-lg">Business Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday: 11:00 AM - 10:00 PM</p>
                      <p className="text-muted-foreground">Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="h-full flex flex-col">
                  <div className="rounded-lg overflow-hidden h-64 mb-6 bg-gray-100">
                    {/* This would be a map in a real implementation */}
                    <div className="h-full flex items-center justify-center bg-muted">
                      <p className="text-center text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        Interactive Map Coming Soon
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="font-semibold text-lg mb-3">Connect With Us</h3>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Facebook className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Instagram className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Twitter className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Legendary Flavors?</h2>
            <p className="mb-6 text-primary-100 max-w-2xl mx-auto">
              Whether you're dining in, taking out, or managing your restaurant, our system has you covered.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary-900 hover:bg-primary-100"
                onClick={() => navigate("/new-order")}
              >
                Create New Order
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate("/dashboard")}
              >
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
};

export default Home;
