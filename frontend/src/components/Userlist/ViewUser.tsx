import React from 'react';
import { User } from '../../interfaces/user/userInterface';
import { X, Mail, Phone, Briefcase, Book, GraduationCap, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface ViewUserProps {
  user: User | null;
  onClose: () => void;
}

const ViewUser: React.FC<ViewUserProps> = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 w-11/12 max-w-2xl shadow-2xl relative my-8">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div className="flex items-center mb-6">
          {user.image && (
            <img 
              src={`http://localhost:8080/src/uploads/${user.image}`} 
              alt={`${user.name}'s profile`} 
              className="w-20 h-20 rounded-full object-cover mr-4 border-2 border-blue-500"
            />
          )}
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-lg text-gray-600">{user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<Mail />} label="Email" value={user.email} />
          <InfoItem icon={<Phone />} label="Mobile" value={user.mobile || 'N/A'} />
          <InfoItem icon={<Briefcase />} label="Skills" value={user.skills || 'N/A'} />
          <InfoItem icon={<Book />} label="Education" value={user.education || 'N/A'} />
          <InfoItem icon={<GraduationCap />} label="Specification" value={user.specification || 'N/A'} />
        </div>

        {user.address && user.address.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Address</h3>
            {user.address.map((addr, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg mb-3">
                <InfoItem icon={<MapPin />} label="Street" value={addr.street || 'N/A'} />
                <InfoItem label="City" value={addr.city || 'N/A'} />
                <InfoItem label="State" value={addr.state || 'N/A'} />
                <InfoItem label="Zip Code" value={addr.zipCode || 'N/A'} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <StatusBadge 
            isActive={user.isVerified} 
            activeText="Verified" 
            inactiveText="Not Verified" 
            activeColor="bg-green-500" 
            inactiveColor="bg-yellow-500"
          />
          <StatusBadge 
            isActive={!user.isBlocked} 
            activeText="Active" 
            inactiveText="Blocked" 
            activeColor="bg-blue-500" 
            inactiveColor="bg-red-500"
          />
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon?: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center">
    {icon && <span className="text-blue-500 mr-2">{icon}</span>}
    <span className="font-semibold text-gray-700 mr-2">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

const StatusBadge: React.FC<{ 
  isActive: boolean; 
  activeText: string; 
  inactiveText: string;
  activeColor: string;
  inactiveColor: string;
}> = ({ isActive, activeText, inactiveText, activeColor, inactiveColor }) => (
  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium flex items-center ${isActive ? activeColor : inactiveColor}`}>
    {isActive ? <CheckCircle size={16} className="mr-1" /> : <XCircle size={16} className="mr-1" />}
    {isActive ? activeText : inactiveText}
  </span>
);

export default ViewUser;