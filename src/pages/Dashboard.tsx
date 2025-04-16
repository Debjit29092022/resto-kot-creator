
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { STORES, getAllItems } from "@/lib/db";
import { Order } from "@/types";
import { Banknote, Clock, ShoppingCart, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const orders = await getAllItems<Order>(STORES.ORDERS);
        
        if (orders.length > 0) {
          // Calculate total sales
          const total = orders.reduce((sum, order) => sum + order.total, 0);
          setTotalSales(total);
          
          // Set total orders
          setTotalOrders(orders.length);
          
          // Calculate average order value
          setAverageOrderValue(total / orders.length);
          
          // Prepare sales data for chart (last 7 days)
          const today = new Date();
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() - (6 - i));
            return {
              date: date.toLocaleDateString(undefined, { weekday: 'short' }),
              fullDate: date,
              sales: 0,
              orders: 0,
            };
          });
          
          // Fill data
          orders.forEach(order => {
            const orderDate = new Date(order.timestamp);
            // Check if order is from the last 7 days
            const dayIndex = last7Days.findIndex(day => 
              orderDate.getDate() === day.fullDate.getDate() && 
              orderDate.getMonth() === day.fullDate.getMonth() &&
              orderDate.getFullYear() === day.fullDate.getFullYear()
            );
            
            if (dayIndex !== -1) {
              last7Days[dayIndex].sales += order.total;
              last7Days[dayIndex].orders += 1;
            }
          });
          
          setSalesData(last7Days.map(day => ({
            date: day.date,
            sales: day.sales,
            orders: day.orders,
          })));
        } else {
          // If no orders exist, show demo data
          setSalesData([
            { date: 'Mon', sales: 1200, orders: 8 },
            { date: 'Tue', sales: 1500, orders: 10 },
            { date: 'Wed', sales: 2000, orders: 15 },
            { date: 'Thu', sales: 1800, orders: 12 },
            { date: 'Fri', sales: 2400, orders: 18 },
            { date: 'Sat', sales: 3000, orders: 22 },
            { date: 'Sun', sales: 2800, orders: 20 },
          ]);
          
          setTotalSales(14700);
          setTotalOrders(105);
          setAverageOrderValue(140);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Show demo data on error
        setSalesData([
          { date: 'Mon', sales: 1200, orders: 8 },
          { date: 'Tue', sales: 1500, orders: 10 },
          { date: 'Wed', sales: 2000, orders: 15 },
          { date: 'Thu', sales: 1800, orders: 12 },
          { date: 'Fri', sales: 2400, orders: 18 },
          { date: 'Sat', sales: 3000, orders: 22 },
          { date: 'Sun', sales: 2800, orders: 20 },
        ]);
        
        setTotalSales(14700);
        setTotalOrders(105);
        setAverageOrderValue(140);
      }
    };
    
    loadDashboardData();
  }, []);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+12%</span> from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+8%</span> from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{averageOrderValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+4%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(22, 22, 22, 0.9)', border: 'none' }}
                />
                <Bar dataKey="sales" fill="#f97316" name="Sales (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
