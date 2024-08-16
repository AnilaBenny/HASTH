import React from 'react';
import UserProfile from '../components/singleuser/UserProfile';

const SingleUserProfile: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <UserProfile/>
    </div>
  );
};

export default SingleUserProfile;
