import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaShoppingCart, FaFilePdf, FaFileExcel, FaDollarSign } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useLocation } from 'react-router-dom';

interface OrderItem {
  product: {
    name: string;
  };
  quantity: number;
}

interface Order {
  orderId: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  userId: {
    name: string;
  };
  items: OrderItem[];
}

interface TimeBasedMetrics {
  orders: number;
  revenue: number;
  delivered: number;
}

export default () => {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [orderStatusData, setOrderStatusData] = useState<{ name: string; value: number; }[]>([]);
  const [orderDetails, setOrderDetails] = useState<Order[]>([]);
  const [timeBasedMetrics, setTimeBasedMetrics] = useState<Record<'daily' | 'weekly' | 'monthly', TimeBasedMetrics>>({
    daily: { orders: 0, revenue: 0, delivered: 0 },
    weekly: { orders: 0, revenue: 0, delivered: 0 },
    monthly: { orders: 0, revenue: 0, delivered: 0 },
  });
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = location.state as Order[];
        console.log(orders);
        setOrderDetails(orders);
    
        let pendingCount = 0;
        let processingCount = 0;
        let shippedCount = 0;
        let deliveredCount = 0;
        let cancelledCount = 0;
     
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const metrics = {
          daily: { orders: 0, revenue: 0, delivered: 0 },
          weekly: { orders: 0, revenue: 0, delivered: 0 },
          monthly: { orders: 0, revenue: 0, delivered: 0 },
        };

        orders.forEach(order => {
          const orderDate = new Date(order.createdAt);
          
          switch (order.orderStatus) {
            case 'Pending':
              pendingCount++;
              break;
            case 'Processing':
              processingCount++;
              break;
            case 'Shipped':
              shippedCount++;
              break;
            case 'Delivered':
              deliveredCount++;
              break;
            case 'Cancelled':
              cancelledCount++;
              break;
            default:
              break;
          }

          if (orderDate >= oneDayAgo) {
            metrics.daily.orders++;
            metrics.daily.revenue += order.totalAmount;
            if (order.orderStatus === 'Delivered') metrics.daily.delivered++;
          }
          if (orderDate >= oneWeekAgo) {
            metrics.weekly.orders++;
            metrics.weekly.revenue += order.totalAmount;
            if (order.orderStatus === 'Delivered') metrics.weekly.delivered++;
          }
          if (orderDate >= oneMonthAgo) {
            metrics.monthly.orders++;
            metrics.monthly.revenue += order.totalAmount;
            if (order.orderStatus === 'Delivered') metrics.monthly.delivered++;
          }
        });

        setTimeBasedMetrics(metrics);

        setOrderStatusData([
          { name: 'Pending', value: pendingCount },
          { name: 'Processing', value: processingCount },
          { name: 'Shipped', value: shippedCount },
          { name: 'Delivered', value: deliveredCount },
          { name: 'Cancelled', value: cancelledCount },
        ]);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchData();
  }, [location.state]);

  const barChartData = [
    { name: 'Orders', value: timeBasedMetrics[timeFrame].orders },
    { name: 'Revenue', value: timeBasedMetrics[timeFrame].revenue },
    { name: 'Delivered', value: timeBasedMetrics[timeFrame].delivered },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(`${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Sales Report`, 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add summary table
    const summaryTableColumn = ["Metric", "Value"];
    const summaryTableRows = [
      ["Total Orders", timeBasedMetrics[timeFrame].orders.toString()],
      ["Delivered Orders", timeBasedMetrics[timeFrame].delivered.toString()],
      ["Total Revenue", `Rs.${timeBasedMetrics[timeFrame].revenue.toFixed(2)}`],
    ];

    doc.autoTable({
      startY: 40,
      head: [summaryTableColumn],
      body: summaryTableRows,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { cellPadding: 5, fontSize: 10 },
    });

    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Order Status Distribution", 14, 22);

    const orderStatusTableColumn = ["Status", "Count"];
    const orderStatusTableRows = orderStatusData.map(item => [item.name, item.value.toString()]);

    doc.autoTable({
      startY: 30,
      head: [orderStatusTableColumn],
      body: orderStatusTableRows,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { cellPadding: 5, fontSize: 10 },
    });

    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Detailed Order Information", 14, 22);

    const orderDetailsTableColumn = ["Order ID", "Status", "Total Amount", "Date", "User", "Products"];
    
    const orderDetailsTableRows = orderDetails.map(order => [
      order.orderId,
      order.orderStatus,
      `Rs.${order.totalAmount.toFixed(2)}`,
      new Date(order.createdAt).toLocaleDateString(),
      order.userId?.name || 'N/A',
      order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')
    ]);

    doc.autoTable({
      startY: 30,
      head: [orderDetailsTableColumn],
      body: orderDetailsTableRows,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { cellPadding: 5, fontSize: 8 },
    });

    doc.save(`${timeFrame}_sales_report.pdf`);
  };

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    
    const summaryWs = XLSX.utils.json_to_sheet([
      { Metric: "Total Orders", Value: timeBasedMetrics[timeFrame].orders },
      { Metric: "Delivered Orders", Value: timeBasedMetrics[timeFrame].delivered },
      { Metric: "Total Revenue", Value: timeBasedMetrics[timeFrame].revenue },
    ]);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    // Order Status sheet
    const orderStatusWs = XLSX.utils.json_to_sheet(orderStatusData);
    XLSX.utils.book_append_sheet(wb, orderStatusWs, "Order Status");

    // Detailed Orders sheet
    const detailedOrdersWs = XLSX.utils.json_to_sheet(orderDetails.map(order => ({
      "Order ID": order.orderId,
      "Status": order.orderStatus,
      "Total Amount": order.totalAmount,
      "Date": new Date(order.createdAt).toLocaleDateString(),
      "User": order.userId?.name,
      "Products": order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')
    })));
    XLSX.utils.book_append_sheet(wb, detailedOrdersWs, "Detailed Orders");

    XLSX.writeFile(wb, `${timeFrame}_sales_report.xlsx`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Sales Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<FaShoppingCart className="text-blue-500 text-3xl" />} title="Orders" value={timeBasedMetrics[timeFrame].orders} />
          <StatCard icon={<FaShoppingCart className="text-purple-500 text-3xl" />} title="Delivered" value={timeBasedMetrics[timeFrame].delivered} />
          <StatCard icon={<FaDollarSign className="text-red-500 text-3xl" />} title="Revenue" value={`Rs.${timeBasedMetrics[timeFrame].revenue.toFixed(2)}`} />
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            {['daily', 'weekly', 'monthly'].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeFrame(frame as 'daily' | 'weekly' | 'monthly')}
                className={`px-6 py-2 rounded-full transition-colors text-sm font-medium ${
                  timeFrame === frame
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-800 hover:bg-gray-200'
                }`}
              >
                {frame.charAt(0).toUpperCase() + frame.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={generatePDF}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <FaFilePdf className="mr-2" /> PDF Report
            </button>
            <button
              onClick={generateExcel}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <FaFileExcel className="mr-2" /> Excel Report
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard title="Overview">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          
          <ChartCard title="Order Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string }> = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center transition-transform hover:scale-105">
    <div className="bg-gray-100 rounded-full p-3 mr-4">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
    {children}
  </div>
);

