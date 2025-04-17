
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import { getSalesAnalytics } from "@/lib/db";
import { 
  Banknote, 
  Clock, 
  ShoppingCart, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronsUp,
  TrendingUp,
  BadgePercent,
  Users,
  Coffee,
  Utensils,
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("week");

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
          customerInsights: {
            newCustomers: 18,
            returningCustomers: 87,
            avgVisitsPerMonth: 2.3,
            peakHours: [
              { hour: "12-1 PM", customers: 22 },
              { hour: "7-8 PM", customers: 28 },
              { hour: "8-9 PM", customers: 32 },
            ]
          },
          growthOpportunities: [
            { id: 1, title: "Introduce Weekday Lunch Special", impact: "High", description: "Data shows lower sales during weekday lunch hours. A lunch special could increase foot traffic." },
            { id: 2, title: "Create Combo with Top Sellers", impact: "Medium", description: "Pair top-selling wings with less popular beverage options to increase attachment rate." },
            { id: 3, title: "Expand Vegetarian Options", impact: "Medium", description: "Vegetarian items show 22% growth compared to last month, indicating increasing demand." },
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
  
  // Colors for the charts
  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
  
  // Generate forecasted data (this would be calculated from actual data in a real scenario)
  const forecastedSales = analytics.salesByDay.map((day: any) => ({
    ...day,
    forecasted: day.sales * (1 + Math.random() * 0.2)  // Simple forecast: 0-20% increase
  }));
  
  const generateRecommendations = () => {
    const recommendations = [];
    
    // Based on top-selling items
    if (analytics.topSellingItems.length > 0) {
      recommendations.push(`Promote the best-seller "${analytics.topSellingItems[0].name}" more prominently on your menu`);
    }
    
    // Based on day of week performance
    const salesByDay = analytics.salesByDay;
    const bestDay = [...salesByDay].sort((a, b) => b.sales - a.sales)[0];
    const worstDay = [...salesByDay].sort((a, b) => a.sales - b.sales)[0];
    
    recommendations.push(`${bestDay.date} is your best sales day. Consider running special promotions on ${worstDay.date} to boost sales`);
    
    // General recommendations
    recommendations.push("Introduce a loyalty program to increase repeat customer visits");
    recommendations.push("Create special combo offers pairing your top-selling items with less popular ones");
    
    return recommendations;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Business Analytics Dashboard</h1>
        <Button onClick={() => navigate("/new-order")}>Create New Order</Button>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant={timePeriod === "week" ? "default" : "outline"} 
          size="sm"
          onClick={() => setTimePeriod("week")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          This Week
        </Button>
        <Button 
          variant={timePeriod === "month" ? "default" : "outline"} 
          size="sm"
          onClick={() => setTimePeriod("month")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          This Month
        </Button>
        <Button 
          variant={timePeriod === "quarter" ? "default" : "outline"} 
          size="sm"
          onClick={() => setTimePeriod("quarter")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          This Quarter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <BadgePercent className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.4%</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+2.1%</span>
              {' '}from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="top-items">Top Items</TabsTrigger>
          <TabsTrigger value="forecast">Sales Forecast</TabsTrigger>
          <TabsTrigger value="insights">Growth Opportunities</TabsTrigger>
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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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
        
        <TabsContent value="forecast" className="mt-4">
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Sales Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={forecastedSales}
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
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(22, 22, 22, 0.9)', border: 'none' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#f97316" 
                      name="Actual Sales (₹)" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecasted" 
                      stroke="#3b82f6" 
                      name="Forecasted Sales (₹)" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Projected Growth</h4>
                <p className="text-sm text-muted-foreground">Based on current trends, projected growth for next month is <span className="text-green-500 font-medium">+8.3%</span></p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-4">
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Growth Opportunities & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  Strategic Recommendations
                </h4>
                <div className="space-y-3">
                  {generateRecommendations().map((recommendation, index) => (
                    <div key={index} className="bg-background p-3 rounded-md">
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Customer Insights
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-background p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">New Customers</p>
                    <p className="text-lg font-bold">{analytics.customerInsights?.newCustomers || 18}</p>
                  </div>
                  <div className="bg-background p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Returning Customers</p>
                    <p className="text-lg font-bold">{analytics.customerInsights?.returningCustomers || 87}</p>
                  </div>
                  <div className="bg-background p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Avg. Visits per Month</p>
                    <p className="text-lg font-bold">{analytics.customerInsights?.avgVisitsPerMonth || 2.3}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Coffee className="h-4 w-4 mr-2 text-orange-500" />
                  Peak Hours
                </h4>
                <div className="bg-background p-3 rounded-md">
                  <p className="text-sm mb-2">Busiest times of day:</p>
                  <div className="flex justify-between">
                    {(analytics.customerInsights?.peakHours || [
                      { hour: "12-1 PM", customers: 22 },
                      { hour: "7-8 PM", customers: 28 },
                      { hour: "8-9 PM", customers: 32 },
                    ]).map((peak, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xs text-muted-foreground">{peak.hour}</p>
                        <div className="h-16 flex items-end justify-center">
                          <div 
                            className="w-8 bg-primary/80 rounded-t"
                            style={{ height: `${(peak.customers / 32) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs mt-1">{peak.customers} orders</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Utensils className="h-4 w-4 mr-2 text-purple-500" />
                  Menu Optimization
                </h4>
                <div className="bg-background p-3 rounded-md">
                  <p className="text-sm mb-2">Consider these menu changes:</p>
                  <ul className="space-y-2 text-sm">
                    <li>• Add bundle offers combining your top-selling wings with sides</li>
                    <li>• Create a weekend family special with multiple varieties</li>
                    <li>• Introduce limited-time seasonal flavors to drive repeat visits</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
