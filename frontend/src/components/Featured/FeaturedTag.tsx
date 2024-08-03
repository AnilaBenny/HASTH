import React from 'react';

interface FeaturedTagProps {
  image?: { image: string; name:string; description: string }[]; 
  tags?: string[];
}

const FeaturedTag: React.FC<FeaturedTagProps> = ({ image, tags }) => {
  return (
    <div className="flex justify-center p-4">
      <div className="tagcard block p-6 bg-gradient-to-t from-blue-300 to-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <div className="flex flex-wrap justify-between items-center">
          {image && image.length > 0 ? (
            <>
              {image.map((img, index) => (
                <div key={index} className="mb-6 flex items-center">
                  <img
                    src={img.image}
                    alt="Profile"
                    className="w-16 h-16 object-cover rounded-full border-2 mr-4"
                  />
                  <div className='flex flex-col'>
                  <p className="text-center text-gray-700 dark:text-gray-300">
                    {img.name}
                  </p>
                  <p className="text-center text-gray-700 dark:text-gray-300">
                    {img.description}
                  </p>
                  </div>
                  
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-2">
                {tags && tags.length > 0 && tags.map((tag, index) => (
                  <button
                    key={index}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeaturedTag;
