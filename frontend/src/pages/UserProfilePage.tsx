import React from 'react';
import UserProfile from '../components/singleuser/UserProfile';

const UserProfilePage: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <UserProfile />
        </div>
    );
};

export default UserProfilePage;