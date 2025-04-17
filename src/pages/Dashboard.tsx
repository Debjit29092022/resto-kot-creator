
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { getSalesAnalytics } from "@/lib/db";
import { 
  Banknote, 
  Clock, 
  ShoppingCart, 
  ArrowUpRight, 
  TrendingUp,
  ArrowDownRight,
  ChevronsUp
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await getSalesAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Show demo data on error
        setAnalytics({
          totalSales: 14700,
          totalOrders: 105,
          averageOrderValue: 140,
          topSellingItems: [
            { name: "AAM KASHMUNDI WINGS", quantity: 42, revenue: 2100 },
            { name: "CHICKEN TIKKA BAO", quantity: 38, revenue: 1900 },
            { name: "STICKY SOY GINGER WINGS", quantity: 32, revenue: 1600 },
            { name: "PERI PERI FRIES", quantity: 28, revenue: 1400 },
            { name: "WATERMELON COOLER", quantity: 25, revenue: 1250 }
          ],
          salesByDay: [
            { date: 'Mon', sales: 1200, orders: 8 },
            { date: 'Tue', sales: 1500, orders: 10 },
            { date: 'Wed', sales: 2000, orders: 15 },
            { date: 'Thu', sales: 1800, orders: 12 },
            { date: 'Fri', sales: 2400, orders: 18 },
            { date: 'Sat', sales: 3000, orders: 22 },
            { date: 'Sun', sales: 2800, orders: 20 },
          ],
          salesByCategory: [
            { category: "Wings", amount: 6500 },
            { category: "Baos", amount: 4300 },
            { category: "Sides", amount: 2200 },
            { category: "Beverages", amount: 1700 }
          ],
          growth: {
            sales: 12,
            orders: 8,
            average: 4
          }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Colors for the pie chart
  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
  
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
            <div className="text-2xl font-bold">₹{analytics.totalSales.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {analytics.growth.sales >= 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">+{analytics.growth.sales.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">{analytics.growth.sales.toFixed(1)}%</span>
                </>
              )}
              {' '}from last week
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
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {analytics.growth.orders >= 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">+{analytics.growth.orders.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">{analytics.growth.orders.toFixed(1)}%</span>
                </>
              )}
              {' '}from last week
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
            <div className="text-2xl font-bold">₹{analytics.averageOrderValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {analytics.growth.average >= 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">+{analytics.growth.average.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">{analytics.growth.average.toFixed(1)}%</span>
                </>
              )}
              {' '}from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="top-items">Top Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="mt-4">
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.salesByDay}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
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
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                      label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.salesByCategory.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`₹${value}`, 'Revenue']}
                      contentStyle={{ backgroundColor: 'rgba(22, 22, 22, 0.9)', border: 'none' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="top-items" className="mt-4">
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topSellingItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <ChevronsUp className={`h-5 w-5 text-primary`} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-sm font-medium">₹{item.revenue}</p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} units sold
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg. ₹{(item.revenue / item.quantity).toFixed(0)}/unit
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-primary/20">
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{
                            width: `${(item.quantity / analytics.topSellingItems[0].quantity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
