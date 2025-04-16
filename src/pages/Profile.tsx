
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { STORES, getItem, updateItem, addItem } from "@/lib/db";
import { Profile as ProfileType } from "@/types";
import { toast } from "sonner";
import { Save } from "lucide-react";

const defaultProfile: ProfileType = {
  id: "main",
  restaurantName: "Legendary Baos & Wings",
  address: "",
  phone: "",
  email: "",
  gst: "",
  tagline: "THE SNACKS FOR SNACCS",
};

const Profile = () => {
  const [profile, setProfile] = useState<ProfileType>(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await getItem<ProfileType>(STORES.PROFILE, "main");
      if (profileData) {
        setProfile(profileData);
        if (profileData.logo) {
          setLogoPreview(profileData.logo);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    }
  };

  const handleInputChange = (field: keyof ProfileType, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateItem(STORES.PROFILE, profile);
      toast.success("Profile saved successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
      
      // If updating fails (might not exist yet), try adding
      try {
        await addItem(STORES.PROFILE, profile);
        toast.success("Profile created successfully");
      } catch (addError) {
        console.error("Error creating profile:", addError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image is too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const logoData = event.target?.result as string;
      setLogoPreview(logoData);
      setProfile({ ...profile, logo: logoData });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Restaurant Profile</h1>
      
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div 
              className="w-32 h-32 rounded-full overflow-hidden bg-black flex items-center justify-center mb-2 border-2 border-primary cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Restaurant Logo" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center px-2">
                  <p className="text-sm">Click to upload logo</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
            >
              Change Logo
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurantName">Restaurant Name</Label>
            <Input
              id="restaurantName"
              value={profile.restaurantName}
              onChange={(e) => handleInputChange("restaurantName", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline/Slogan</Label>
            <Input
              id="tagline"
              value={profile.tagline || ""}
              onChange={(e) => handleInputChange("tagline", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              rows={3}
              value={profile.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gst">GST Number (Optional)</Label>
            <Input
              id="gst"
              value={profile.gst || ""}
              onChange={(e) => handleInputChange("gst", e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading} className="ml-auto">
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
