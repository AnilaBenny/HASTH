import { useEffect, useState, useCallback } from "react";
import SearchBar from "./SearchBar";
import axiosInstance from "../../Axiosconfig/Axiosconfig";
import { User } from "../../interfaces/user/userInterface";
import { useDispatch } from 'react-redux';
import { clearUser } from "../../store/slices/userSlice";

import Pagination from "../Pagination/Pagination";
import ViewUser from "./ViewUser";
const UserList: React.FC = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<"all" | "blocked" | "unblocked">("all");
  const [blockStatus, setBlockStatus] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserModal, setSelectedUserModal] = useState<User | null>(null);
  const [confirmation,setConfirmation]=useState(false)
  const usersPerPage = 8; 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/getAllUsers?page=${currentPage}&limit=${usersPerPage}`);
        console.log(response);
        if (Array.isArray(response.data.data.users)) {
          
          
          const users = response.data.data.users;
          const userData = users.filter((user: any) => user.role === 'user');
          setUsers(userData);
          setFilteredUsers(userData);
          const initialBlockStatus = userData.reduce((acc: any, user: any) => {
            acc[user._id] = user.isBlocked;
            return acc;
          }, {} as Record<string, boolean>);
          setBlockStatus(initialBlockStatus);
        } else {
          console.error("Invalid user data:", response.data.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentPage,filter]); 

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        (user.name.toLowerCase().includes(lowerCaseQuery) ||
         user.email.toLowerCase().includes(lowerCaseQuery)) &&
        (filter === 'all' || user.isBlocked === (filter === 'blocked'))
    );
    setFilteredUsers(filtered);
  };
  
  const handleUserBlock=(userId:any)=>{
    setConfirmation(true);
    setSelectedUser(userId)
  }

  const handleConfirm = async () => {
    try {
      const userId=selectedUser;
      const response = await axiosInstance.patch(
        `/api/auth/handleUserBlock/${userId}`
      );
      const updatedUser = response.data.data;
      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
      setBlockStatus((prevStatus) => ({
        ...prevStatus,
        //@ts-ignore
        [userId]: updatedUser.isBlocked,
      }));



      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log(" currentUser:", currentUser);
      if (currentUser && currentUser?.data?._id === updatedUser?._id && updatedUser?.isBlocked) {
        dispatch(clearUser());
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
      setConfirmation(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  const applyFilter = useCallback(
    (allUsers: User[], filterType: "all" | "blocked" | "unblocked") => {
      if (filterType === "all") {
        setFilteredUsers(allUsers);
      } else {
        const filtered = allUsers.filter(
          (user) => user.isBlocked === (filterType === "blocked")
        );
        setFilteredUsers(filtered);
      }
    },
    []
  );

  useEffect(() => {
    applyFilter(users, filter);
  }, [filter, users, applyFilter]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const handleViewDetails = (user: User) => {
    setSelectedUserModal(user);
  };
  const handleCancel=()=>{
    setConfirmation(false);
    setSelectedUser(null)
  }

  return (
    <div className="pl-64 flex justify-center items-center">
      <div className="w-full max-w-4xl">
        <div className="text-center my-4">
          <h1 className="text-2xl font-bold">User List</h1>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex items-center">
            {["all", "blocked", "unblocked"].map((filterType) => (
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
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100 transition-all">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleUserBlock(user._id)}
                    className={`mr-2 ${
                      blockStatus[user._id]
                        ? "bg-green-500 hover:bg-green-700"
                        : "bg-red-500 hover:bg-red-700"
                    } text-white py-1 px-3 rounded-full`}
                  >
                    {blockStatus[user._id] ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded-full"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          usersPerPage={usersPerPage}
          totalUsers={filteredUsers.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {selectedUserModal && (
        <ViewUser user={selectedUserModal} onClose={() => setSelectedUserModal(null)} />
      )}
{confirmation && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
    <p>Are you sure you want to {selectedUser?.isBlocked ? 'unblock' : 'block'} this user?</p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Yes
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          No
        </button>
      </div>
    </div>
  </div>
)}

    </div>
    
  );
};

export default UserList;
