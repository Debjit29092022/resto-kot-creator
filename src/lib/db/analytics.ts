
import { STORES } from './constants';
import { getAllItems } from './indexedDB';

// Fetch analytics data
export const getSalesAnalytics = async (): Promise<any> => {
  try {
    // Get all orders from IndexedDB
    const orders = await getAllItems(STORES.ORDERS);
    
    // Calculate metrics
    const totalSales = orders.reduce((sum, order: any) => sum + Number(order.total), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Get top-selling items
    const itemCounts: Record<string, { count: number, total: number }> = {};
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        if (!itemCounts[item.menuItemName]) {
          itemCounts[item.menuItemName] = { count: 0, total: 0 };
        }
        itemCounts[item.menuItemName].count += Number(item.quantity);
        itemCounts[item.menuItemName].total += Number(item.totalPrice);
      });
    });
    
    // Convert to array and sort by count (highest first)
    const topSellingItems = Object.entries(itemCounts)
      .map(([name, data]) => ({
        name,
        quantity: data.count,
        revenue: data.total
      }))
      .sort((a, b) => b.quantity - a.quantity);
    
    // Calculate sales by day for the last 7 days
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
    
    // Fill data for the last 7 days
    orders.forEach((order: any) => {
      const orderDate = new Date(order.timestamp);
      // Check if order is from the last 7 days
      const dayIndex = last7Days.findIndex(day => 
        orderDate.getDate() === day.fullDate.getDate() && 
        orderDate.getMonth() === day.fullDate.getMonth() &&
        orderDate.getFullYear() === day.fullDate.getFullYear()
      );
      
      if (dayIndex !== -1) {
        last7Days[dayIndex].sales += Number(order.total);
        last7Days[dayIndex].orders += 1;
      }
    });
    
    const salesByDay = last7Days.map(day => ({
      date: day.date,
      sales: day.sales,
      orders: day.orders,
    }));
    
    // Calculate sales by category
    const categoryTotals: Record<string, number> = {};
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        // Determine the category based on the item name (simplified approach)
        let category = "Other";
        if (item.menuItemName.includes("WINGS")) {
          category = "Wings";
        } else if (item.menuItemName.includes("BAO")) {
          category = "Baos";
        } else if (item.menuItemName.includes("FRIES")) {
          category = "Sides";
        } else if (item.menuItemName.includes("COOLER") || item.menuItemName.includes("COKE") || item.menuItemName.includes("WATER")) {
          category = "Beverages";
        }
        
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += Number(item.totalPrice);
      });
    });
    
    const salesByCategory = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount
      }))
      .sort((a, b) => b.amount - a.amount);
    
    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      topSellingItems: topSellingItems.slice(0, 5), // top 5
      salesByDay,
      salesByCategory,
      // Calculate growth rates (comparing to previous days)
      growth: {
        sales: calculateGrowthRate(salesByDay, 'sales'),
        orders: calculateGrowthRate(salesByDay, 'orders'),
        average: averageOrderValue > 0 ? 
          ((Number(averageOrderValue) / (Number(totalSales) - Number(averageOrderValue) || 1)) * 100) : 0
      }
    };
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    throw error;
  }
};

// Helper function to calculate growth rate
export const calculateGrowthRate = (data: any[], key: string): number => {
  if (!data || data.length < 2) return 0;
  
  // Calculate total for the most recent half of the period
  const midpoint = Math.floor(data.length / 2);
  const recentTotal = data.slice(midpoint).reduce((sum, day) => sum + Number(day[key] || 0), 0);
  const previousTotal = data.slice(0, midpoint).reduce((sum, day) => sum + Number(day[key] || 0), 0);
  
  if (previousTotal === 0) return 0;
  
  return ((recentTotal - previousTotal) / previousTotal) * 100;
};
