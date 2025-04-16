
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { STORES, getItem, updateItem, addItem } from "@/lib/db";
import { Settings as SettingsType } from "@/types";
import { toast } from "sonner";
import { Printer, Save } from "lucide-react";

const defaultSettings: SettingsType = {
  id: "main",
  taxRate: 5,
  printerName: "",
  receiptHeader: "",
  receiptFooter: "Thank you for dining with us!",
};

const Settings = () => {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [availablePrinters, setAvailablePrinters] = useState<string[]>([]);

  useEffect(() => {
    loadSettings();
    checkAvailablePrinters();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await getItem<SettingsType>(STORES.SETTINGS, "main");
      if (settingsData) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings");
    }
  };

  const checkAvailablePrinters = async () => {
    try {
      // @ts-ignore - Printer API is not fully typed in TypeScript yet
      if (navigator.printer && navigator.printer.getPrinters) {
        // @ts-ignore
        const printers = await navigator.printer.getPrinters();
        setAvailablePrinters(printers.map((p: any) => p.name));
      }
    } catch (error) {
      console.error("Error checking printers:", error);
    }
  };

  const handleInputChange = (field: keyof SettingsType, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Validate tax rate
      const taxRate = Number(settings.taxRate);
      if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
        toast.error("Please enter a valid tax rate between 0 and 100");
        return;
      }
      
      // Ensure taxRate is a number
      const updatedSettings = {
        ...settings,
        taxRate: taxRate
      };
      
      await updateItem(STORES.SETTINGS, updatedSettings);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
      
      // If updating fails (might not exist yet), try adding
      try {
        await addItem(STORES.SETTINGS, settings);
        toast.success("Settings created successfully");
      } catch (addError) {
        console.error("Error creating settings:", addError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups to test printing.");
      return;
    }
    
    // Create content for test print
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Test</title>
        <style>
          body {
            font-family: monospace;
            width: 80mm;
            margin: 0;
            padding: 10px;
          }
          .header, .footer {
            text-align: center;
            margin: 10px 0;
          }
          .divider {
            border-bottom: 1px dashed #000;
            margin: 10px 0;
          }
          .test-content {
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${settings.receiptHeader || "LEGENDARY BAOS & WINGS"}
        </div>
        <div class="divider"></div>
        <div class="test-content">
          <h3>Printer Test</h3>
          <p>This is a test print from the LBW Billing System</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <p>Time: ${new Date().toLocaleTimeString()}</p>
        </div>
        <div class="divider"></div>
        <div class="footer">
          ${settings.receiptFooter || "Thank you for dining with us!"}
        </div>
      </body>
      </html>
    `);
    
    // Print and close
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    
    toast.success("Sending test print to printer");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={settings.taxRate}
              onChange={(e) => handleInputChange("taxRate", parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              This tax rate will be applied to all orders
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Receipt & Printing Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="printerName">Printer Name</Label>
            <Input
              id="printerName"
              value={settings.printerName || ""}
              onChange={(e) => handleInputChange("printerName", e.target.value)}
              placeholder="Default Printer"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use system default printer
            </p>
            
            {availablePrinters.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Available printers: {availablePrinters.join(", ")}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="receiptHeader">Receipt Header</Label>
            <Textarea
              id="receiptHeader"
              rows={3}
              value={settings.receiptHeader || ""}
              onChange={(e) => handleInputChange("receiptHeader", e.target.value)}
              placeholder="LEGENDARY BAOS & WINGS"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="receiptFooter">Receipt Footer</Label>
            <Textarea
              id="receiptFooter"
              rows={3}
              value={settings.receiptFooter || ""}
              onChange={(e) => handleInputChange("receiptFooter", e.target.value)}
              placeholder="Thank you for dining with us!"
            />
          </div>
          
          <Button variant="outline" onClick={handleTestPrint} className="mt-4">
            <Printer className="mr-2 h-4 w-4" />
            Test Print
          </Button>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading} className="ml-auto">
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
