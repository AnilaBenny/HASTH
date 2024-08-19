import { useEffect, useState, useCallback } from "react";
import SearchBar from "../Userlist/SearchBar";
import axiosInstance from "../../Axiosconfig/Axiosconfig";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from "../Pagination/Pagination";
import ReportDetailModal from "./ReportDetailModal";

interface Report {
  _id: string;
  reportedUserId: string;
  reportedPostId: string;
  type: 'post' | 'creative';
  reason: string;
  createdAt: string;
}

const ReportListing: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<"all" | "post" | "creative">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const reportsPerPage = 8;

  const fetchReports = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/reports?page=${currentPage}&limit=${reportsPerPage}`);
      if (Array.isArray(response.data.data.reports)) {
        const reports = response.data.data.reports;
        setReports(reports);
        applyFilter(reports, filter); // Apply filter to newly fetched reports
      } else {
        console.error("Invalid report data:", response.data.data.reports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = reports.filter(report =>
      report.reason.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredReports(filtered);
  };

  const handleBlockCreative = async (reportId: string) => {
    try {
      const response = await axiosInstance.patch(`/api/auth/handleUserBlock/${reportId}`);
      const updatedUser = response.data.data;

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (currentUser && currentUser._id === updatedUser._id && updatedUser.isBlocked) {
        navigate("/login");
        toast.error("You have been logged out because your account is blocked.");
      } else {
        toast.success("User block status updated successfully.");
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
      toast.error("Failed to toggle block status.");
    }
  };

  const handleDeletePost = async (reportId: string) => {
    try {
      await axiosInstance.delete(`/api/auth/deleteIdea/${reportId}`);
      toast.success("Post has been deleted");

      // Remove deleted report from state
      setReports(prevReports => prevReports.filter(report => report._id !== reportId));
      setFilteredReports(prevFilteredReports => prevFilteredReports.filter(report => report._id !== reportId));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const applyFilter = useCallback((allReports: Report[], filterType: "all" | "post" | "creative") => {
    if (filterType === "all") {
      setFilteredReports(allReports);
    } else {
      const filtered = allReports.filter(report => report.type === filterType);
      setFilteredReports(filtered);
    }
  }, []);


  useEffect(() => {
    applyFilter(reports, filter);
  }, [filter, reports, applyFilter]);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  return (
    <div className="pl-64 flex justify-center items-center">
      <div className="w-full max-w-4xl">
        <div className="text-center my-4">
          <h1 className="text-2xl font-bold">Report Listing</h1>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex items-center">
            {["all", "post", "creative"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as typeof filter)}
                className={`px-4 py-2 mr-2 rounded-lg transition-all ${
                  filter === filterType
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                } hover:bg-blue-700`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                Reported
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentReports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-100 transition-all">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {report.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {report.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {report.type === 'creative' ? (
                    <button
                      onClick={() => handleBlockCreative(report.reportedUserId)}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-full"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeletePost(report.reportedPostId)}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-full"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          itemsPerPage={reportsPerPage}
          totalItems={filteredReports.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
                    
      {selectedReport && (
        <ReportDetailModal
          type={selectedReport.type}
          data={selectedReport.type==='post'?(selectedReport.reportedPostId):selectedReport.reportedUserId}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default ReportListing;
