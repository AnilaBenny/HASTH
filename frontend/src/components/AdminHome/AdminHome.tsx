import  { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FaUserCircle, FaShoppingCart, FaBox, FaUserEdit, FaNewspaper } from 'react-icons/fa';
import useApiService from '../../Services/Apicalls';

interface User{
  _id:string
}
interface Report{
  _id:string
}

export default () => {
  const [timeFrame, setTimeFrame] = useState('daily');
  const [data, setData] = useState<any>({
    users: 0,
    orders: 0,
    products: 0,
    creatives: 0,
    posts: 0
  });
  const [newUsers, setNewUsers] = useState<User[]|null>(null);
  const [reports, setReports] = useState<Report[]|null>(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const service = useApiService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await service.fetchallLists(timeFrame);
        setData(fetchedData);
        const fetchUsers=await service.fetchUsers();
 
        setNewUsers(fetchUsers);
        const fetchReports=await service.fetchReports();
 
        setReports(fetchReports.reports);

      } catch (error) {
        console.error('Error fetching data:', error);

        setData({
          users: Math.floor(Math.random() * 1000),
          orders: Math.floor(Math.random() * 500),
          products: Math.floor(Math.random() * 2000),
          creatives: Math.floor(Math.random() * 300),
          posts: Math.floor(Math.random() * 100)
        });
      }
    };

    fetchData();
  }, [timeFrame]);

  useEffect(() => {
    if (data) {
      drawBarChart();
      drawPieChart();
    }
  }, [data]);

  const drawBarChart = () => {
    const margin = { top: 20, right: 30, bottom: 60, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    d3.select(barChartRef.current).selectAll("*").remove();
    const svg = d3.select(barChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    let processedData:any;
    let xAxisFormat: (d: string) => string;
    if (timeFrame === 'daily') {
      const today = new Date();
      processedData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return [date.toISOString().split('T')[0], data[date.toISOString().split('T')[0]] || 0];
      }).reverse();
      xAxisFormat = d => new Date(d).toLocaleDateString();
    } else if (timeFrame === 'weekly') {
      processedData = Array.from({ length: 7 }, (_, i) => [`Week ${i + 1}`, data[`Week ${i + 1}`] || 0]);
      xAxisFormat = d => d;
    } else if (timeFrame === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      processedData = months.slice(0, 7).map(month => [month, data[month] || 0]);
      xAxisFormat = d => d;
    } else {
      processedData = Object.entries(data);
      xAxisFormat = d => d;
    }
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    const y = d3.scaleLinear()
      .range([height, 0]);
    x.domain(processedData.map((d:any) => d[0]));
    //@ts-ignore
    y.domain([0, d3.max(processedData, d => d[1]) || 0]);
    svg.selectAll(".bar")
      .data(processedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d:any) => x(d[0]) || 0)
      .attr("width", x.bandwidth())
      .attr("y", (d:any) => y(d[1]))
      .attr("height", (d:any) => height - y(d[1]))
      .attr("fill", "#4CAF50");
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(xAxisFormat))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
    svg.append("g")
      .call(d3.axisLeft(y));
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Statistics`);
  };

  const drawPieChart = () => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const filteredData:any= Object.entries(data).filter(([_, value]) => value !== 0);
  
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
  
    const color = d3.scaleOrdinal()
      .domain(filteredData.map(([key, _]:any) => key))
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
      //@ts-ignore
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">Bar Chart</h2>
            <div ref={barChartRef} className="bar-chart p-8"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Pie Chart</h2>
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
                                        <img src={`https://hasth.mooo.com/src/uploads/${user?.reportedUserId?.image}` || 'defaultImagePath'} alt="User" className="mr-4 text-gray-400 w-8" />
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

 