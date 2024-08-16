import React, { useState } from 'react';

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'products'>('posts');

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cover Photo */}
      <div className="relative">
        <img
          src={coverPhoto}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
        {/* Profile Picture */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 w-32 h-32 rounded-full overflow-hidden border-4 border-white">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 text-center mt-16">
        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
        <p className="text-gray-600 mt-2">{bio}</p>
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Edit Profile
        </button>
        <div className="flex justify-around mt-4 text-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{products}</h2>
            <p className="text-gray-600">Products</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{posts}</h2>
            <p className="text-gray-600">Posts</p>
          </div>
         
        </div>
      </div>

      {/* Tabs for Posts and Products */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 ${
            activeTab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          } rounded-l`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 ${
            activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          } rounded-r`}
        >
          Products
        </button>
      </div>

      {/* Display Content Based on Selected Tab */}
      <div className="p-4">
        {activeTab === 'posts' ? (
          <div>
            {/* Render user's posts here */}
            <p>Showing user's posts...</p>
          </div>
        ) : (
          <div>
            {/* Render user's products here */}
            <p>Showing user's products...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
