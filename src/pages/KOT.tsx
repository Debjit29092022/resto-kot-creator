
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItem, STORES } from "@/lib/db";
import { Order, Profile } from "@/types";
import { toast } from "sonner";
import { KOTHeader } from "@/components/kot/KOTHeader";
import { KOTContent } from "@/components/kot/KOTContent";
import { PrintStyles } from "@/components/kot/PrintStyles";
import { LoadingSpinner } from "@/components/kot/LoadingSpinner";

const KOT = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const orderData = await getItem<Order>(STORES.ORDERS, parseInt(id));
          if (orderData) {
            setOrder(orderData);
            console.log("Order loaded successfully:", orderData);
          } else {
            toast.error("Order not found");
            navigate("/orders");
          }
        } else {
          toast.error("No order ID provided");
          navigate("/orders");
        }

        const profileData = await getItem<Profile>(STORES.PROFILE, "main");
        if (profileData) {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load order data");
      }
    };

    loadData();
  }, [id, navigate]);

  if (!order) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <KOTHeader order={order} setOrder={setOrder} />
      <KOTContent 
        order={order}
        profile={profile}
        printRef={printRef}
      />
      <PrintStyles />
    </div>
  );
};

export default KOT;
