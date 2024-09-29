import  { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FaUserCircle, FaShoppingCart, FaBox, FaUserEdit, FaNewspaper } from 'react-icons/fa';
import useApiService from '../../Services/Apicalls';
import axiosInstance from '../../Axiosconfig/Axiosconfig';

interface User {
  _id: string;
  name: string;
  role: string;
  image: string;
}

interface Report {
  _id: string;
  reportedUserId: User;
  reason: string;
}

interface OrderData {
  daily: Record<string, number>;
  weekly: Record<string, number>;
  monthly: Record<string, number>;
}

export default () => {
  const [timeFrame, setTimeFrame] = useState('daily');
  const [data, setData] = useState({
    users: 0,
    orders: 0,
    products: 0,
    creatives: 0,
    posts: 0
  });
  const [orderData, setOrderData] = useState<OrderData>({
    daily: {},
    weekly: {},
    monthly: {}
  });
  const [newUsers, setNewUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const lineChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const service = useApiService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await service.fetchallLists(timeFrame);
        setData(fetchedData);
        
        const fetchedUsers = await service.fetchUsers();
        setNewUsers(fetchedUsers);
        
        const fetchedReports = await service.fetchReports();
        setReports(fetchedReports.reports);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/admin/allorders');
        if (Array.isArray(response.data.data.orders)) {
          processOrderData(response.data.data.orders);
        } else {
          console.error("Invalid order data:", response.data.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
    fetchOrders();
  }, [timeFrame]);

  useEffect(() => {
    if (data) {
      drawLineChart();
      drawPieChart();
    }
  }, [data, orderData, timeFrame]);

  const processOrderData = (orders: any[]) => {
    const daily: Record<string, number> = {};
    const weekly: Record<string, number> = {};
    const monthly: Record<string, number> = {};


    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); 


    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28); 

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const amount = order.totalAmount;

      // Daily totals (last 7 days)
      if (date >= sevenDaysAgo) {
        const dayKey = date.toISOString().split('T')[0];
        daily[dayKey] = (daily[dayKey] || 0) + amount;
      }

      // Weekly totals (last 4 weeks)
      if (date >= fourWeeksAgo) {
        const weekNumber = Math.floor((date.getTime() - fourWeeksAgo.getTime()) / (7 * 24 * 60 * 60 * 1000));
        const weekKey = `Week ${weekNumber + 1}`;
        weekly[weekKey] = (weekly[weekKey] || 0) + amount;
      }

      // Monthly totals (keep as is, showing all months)
      const monthKey = date.toLocaleString('default', { month: 'short' });
      monthly[monthKey] = (monthly[monthKey] || 0) + amount;
    });

    // Ensure all 7 days are represented in daily data
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dayKey = date.toISOString().split('T')[0];
      if (!daily[dayKey]) {
        daily[dayKey] = 0;
      }
    }

    // Ensure all 4 weeks are represented in weekly data
    for (let i = 1; i <= 4; i++) {
      const weekKey = `Week ${i}`;
      if (!weekly[weekKey]) {
        weekly[weekKey] = 0;
      }
    }

    setOrderData({ daily, weekly, monthly });
  };

  const drawLineChart = () => {
    if (!lineChartRef.current) return;

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(lineChartRef.current).selectAll("*").remove();

    const svg = d3.select(lineChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    let processedData: [string, number][];
    let xAxisFormat: (d: string) => string;
  
    if (timeFrame === 'daily') {
      const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
      processedData = lastSevenDays.map(day => [day, orderData.daily[day] || 0]);
      xAxisFormat = d => new Date(d).toLocaleDateString();
    } else if (timeFrame === 'weekly') {
      processedData = Object.entries(orderData.weekly).slice(-4);
      xAxisFormat = d => d;
    } else {
      processedData = Object.entries(orderData.monthly).slice(-5);
      xAxisFormat = d => d;
    }
  
    const x = d3.scalePoint()
      .range([0, width])
      .domain(processedData.map(d => d[0]));
    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(processedData, d => d[1]) || 0]);
  
    const line = d3.line<[string, number]>()
      .x(d => x(d[0]) || 0)
      .y(d => y(d[1]));
  
    svg.append("path")
      .datum(processedData)
      .attr("fill", "none")
      .attr("stroke", "#4CAF50")
      .attr("stroke-width", 2)
      .attr("d", line);
  
    svg.selectAll(".dot")
      .data(processedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d[0]) || 0)
      .attr("cy", d => y(d[1]))
      .attr("r", 4)
      .attr("fill", "#4CAF50");
  
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(xAxisFormat))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
  
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `₹${d}`));
  
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Order Sales`);
  
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Sales Amount (₹)");
  };

  const drawPieChart = () => {
    if (!pieChartRef.current) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const filteredData = Object.entries(data).filter(([_, value]) => value !== 0);
  
    d3.select(pieChartRef.current).selectAll("*").remove();
    const svg = d3.select(pieChartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const tooltip = d3.select(pieChartRef.current)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");
  
    const color = d3.scaleOrdinal<string>()
      .domain(filteredData.map(([key, _]) => key))
      .range(d3.schemeSet2);
  
    const pie = d3.pie<[string, number]>()
      .value(d => d[1]);
  
    const dataReady = pie(filteredData);
  
    const arcGenerator = d3.arc<d3.PieArcDatum<[string, number]>>()
      .innerRadius(0)
      .outerRadius(radius);
  
    svg.selectAll('slices')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', d => color(d.data[0]))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`${d.data[0]}: ${d.data[1]}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
  
    svg.selectAll('slices')
      .data(dataReady)
      .enter()
      .append('text')
      .text(d => d.data[0])
      .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 10);
  };

  if (!data) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 ms-60">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <FaUserCircle className="text-blue-500 text-3xl mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Users</p>
              <p className="text-2xl font-bold text-gray-800">{data.users}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <FaShoppingCart className="text-green-500 text-3xl mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Orders</p>
              <p className="text-2xl font-bold text-gray-800">{data.orders}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <FaBox className="text-yellow-500 text-3xl mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Products</p>
              <p className="text-2xl font-bold text-gray-800">{data.products}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <FaUserEdit className="text-purple-500 text-3xl mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Creatives</p>
              <p className="text-2xl font-bold text-gray-800">{data.creatives}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <FaNewspaper className="text-red-500 text-3xl mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Posts</p>
              <p className="text-2xl font-bold text-gray-800">{data.posts}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-4 mb-8">
          {['daily', 'weekly', 'monthly'].map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-4 py-2 rounded-md transition-colors ${
                timeFrame === frame
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-200'
              }`}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Order Sales</h2>
            <div ref={lineChartRef} className="line-chart p-8"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Metrics Distribution</h2>
            {(data.users === 0 &&
                data.orders === 0 &&
                data.products === 0 &&
                data.creatives === 0 &&
                data.posts === 0) ? (
                <>There is no data available.</>
                ) : (
                <div ref={pieChartRef} className="pie-chart ms-16"></div>
                )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">New Users</h2>
            <ul className="space-y-4">
              {newUsers && newUsers.length > 0 ? (
                newUsers.map((user:any, index:any) => (
                  <li key={index} className="flex items-center">
                    <img src={`https://hasth.mooo.com/src/uploads/${user?.image}` || 'defaultImagePath'} alt="User" className="mr-4 text-gray-400 w-8" />
                    <div>
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.role}</p>
                    </div>
                  </li>
                ))
              ) : (
                <p>No users available.</p>
              )}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Reported Users</h2>
            <ul className="space-y-4">
              {reports && reports.length > 0 ? (
                reports.map((user:any, index:any) => (
                  <li key={index} className="flex items-center">
                    {user?.reportedUserId?.image&&<img src={`https://hasth.mooo.com/src/uploads/${user?.reportedUserId?.image}` || 'defaultImagePath'} alt="User" className="mr-4 text-gray-400 w-8" />}
                    <div>
                      <p className="font-medium text-gray-800">
                        {user?.reportedUserId?.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user?.reason || 'No reason provided'}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p>No reports available.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};