import React from 'react';
import { User } from '../../interfaces/user/userInterface';

interface ViewUserProps {
  user: User | null;
  onClose: () => void;
}

const ViewUser: React.FC<ViewUserProps> = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
        
        <div className="space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile || 'N/A'}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Skills:</strong> {user.skills || 'N/A'}</p>
          <p><strong>Education:</strong> {user.education || 'N/A'}</p>
          <p><strong>Specification:</strong> {user.specification || 'N/A'}</p>

          {user.address && user.address.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mt-4">Address:</h3>
              {user.address.map((addr, index) => (
                <div key={index} className="ml-4 mt-2">
                  <p><strong>Street:</strong> {addr.street || 'N/A'}</p>
                  <p><strong>City:</strong> {addr.city || 'N/A'}</p>
                  <p><strong>State:</strong> {addr.state || 'N/A'}</p>
                  <p><strong>Zip Code:</strong> {addr.zipCode || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4">
            <strong>Status:</strong>
            <span className={`ml-2 px-2 py-1 rounded-full text-white ${user.isVerified ? 'bg-green-500' : 'bg-red-500'}`}>
              {user.isVerified ? 'Verified' : 'Not Verified'}
            </span>
            <span className={`ml-2 px-2 py-1 rounded-full text-white ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}>
              {user.isBlocked ? 'Blocked' : 'Active'}
            </span>
          </p>
          
          {user.image && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Profile Image:</h3>
              <img src={user.image} alt={`${user.name}'s profile`} className="rounded-lg mt-2 w-full h-48 object-cover"/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
