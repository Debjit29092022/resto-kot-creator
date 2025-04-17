
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import NewOrder from "./pages/NewOrder";
import KOT from "./pages/KOT";
import Kitchen from "./pages/Kitchen";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { initDB, initSQLiteDB } from "./lib/db";

const queryClient = new QueryClient();

const App = () => {
  // Initialize the database when the app loads
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        await initSQLiteDB();
        console.log("Databases initialized successfully");
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };
    
    initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/new-order" element={<NewOrder />} />
              <Route path="/kot/:id" element={<KOT />} />
              <Route path="/kitchen" element={<Kitchen />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
