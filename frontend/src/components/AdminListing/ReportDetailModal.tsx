import React from 'react';

interface Comment {
  userId: string;
  text: string;
  liked: string[];
  createdAt: string;
  updatedAt: string;
}

interface PostDetail {
  _id: string;
  userId: string;
  caption: string;
  images: string[];
  liked: string[];
  video?: string;
  comments: Comment[];
  tags: string;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  user: string;
  rating: number;
  reviewdescription: string;
}

interface ProductDetail {
  _id: string;
  name: string;
  description: string;
  collab: string;
  images: string[];
  brand: string;
  countInStock: number;
  review: Review[];
  isFeatured: boolean;
  price: number;
  popularity: number;
  list: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserDetail {
  _id: string;
  name: string;
  email: string;
  mobile?: number;
  isVerified: boolean;
  isBlocked: boolean;
  image?: string;
  role: 'creative' | 'user';
  skills?: string;
  education?: string;
  specification?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ReportDetailModalProps {
  type: 'post' | 'creative';
  data: PostDetail | ProductDetail | UserDetail;
  onClose: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ type, data, onClose }) => {
  console.log(data,'...');
  
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-scroll">
        <div className="text-right">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>

        {type === 'post' ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Post Details</h2>
            <p><strong>Caption:</strong> {(data as PostDetail).caption}</p>
            {(data as PostDetail).images.length > 0 && (
              <div>
                <strong>Images:</strong>
                <div className="grid grid-cols-2 gap-2 w-48">
                  {(data as PostDetail).images.map((image, index) => (
                    <img key={index} src={`http://localhost:8080/src/uploads/${image}`} alt={`Post image ${index + 1}`} className="w-full h-auto" />
                  ))}
                </div>
              </div>
            )}
            {(data as PostDetail).video && (
              <div>
                <strong>Video:</strong>
                <video controls className="w-full">
                  <source src={`http://localhost:8080/src/uploads/${(data as PostDetail).video}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
             <p><strong>Tags:</strong> 
              {(data as PostDetail).tags.split(',').map((tag, index) => (
                <span key={index} className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm mr-2">
                  #{tag.trim()}
                </span>
              ))}
            </p>
            <p><strong>Likes:</strong> {(data as PostDetail).liked.length}</p>
            
            <p><strong>Created At:</strong> {new Date((data as PostDetail).createdAt).toLocaleDateString()}</p>
            <p><strong>Updated At:</strong> {new Date((data as PostDetail).updatedAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p><strong>Name:</strong> {(data as UserDetail).name}</p>
            <p><strong>Email:</strong> {(data as UserDetail).email}</p>
            {data && (data as UserDetail).mobile && (
              <p><strong>Mobile:</strong> {(data as UserDetail).mobile}</p>
            )}
            <p><strong>Verified:</strong> {(data as UserDetail).isVerified ? 'Yes' : 'No'}</p>
            <p><strong>Blocked:</strong> {(data as UserDetail).isBlocked ? 'Yes' : 'No'}</p>
            {data && (data as UserDetail).image && (
              <div>
                <strong>Profile Image:</strong>
                <img src={(data as UserDetail).image} alt="User profile" className="w-24 h-24 rounded-full" />
              </div>
            )}
            <p><strong>Role:</strong> {(data as UserDetail).role}</p>
            {data && (data as UserDetail).skills && (
              <p><strong>Skills:</strong> {(data as UserDetail).skills}</p>
            )}
            {data && (data as UserDetail).education && (
              <p><strong>Education:</strong> {(data as UserDetail).education}</p>
            )}
            {data && (data as UserDetail).specification && (
              <p><strong>Specification:</strong> {(data as UserDetail).specification}</p>
            )}
            <div>
              <strong>Address:</strong>
              {data && (data as UserDetail).address.length > 0 ? (
                <ul className="list-disc pl-5">
                  {(data as UserDetail).address.map((addr, index) => (
                    <li key={index}>
                      <p><strong>Street:</strong> {addr.street}</p>
                      <p><strong>City:</strong> {addr.city}</p>
                      <p><strong>State:</strong> {addr.state}</p>
                      <p><strong>Zip Code:</strong> {addr.zipCode}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No address information available.</p>
              )}
            </div>
            <p><strong>Created At:</strong> {new Date((data as UserDetail).createdAt).toLocaleDateString()}</p>
            <p><strong>Updated At:</strong> {new Date((data as UserDetail).updatedAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetailModal;
