import { useNavigate } from "react-router-dom";


function Footer() {
  const navigate=useNavigate()
  const handleClick=()=>{
    navigate('/admin')
  }
    return (
      <footer className="bg-blue-100 text-center text-gray-600 dark:bg-cyan-950 dark:text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="mb-8">
              <h5 className="text-lg font-semibold mb-4">About Us</h5>
              <p className="text-sm">
                We are committed to providing the best experience for users.
              </p>
            </div>
            <div className="mb-8">
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul>
                <li className="mb-2">
                  <a href="" className="text-sm hover:text-blue-600 transition-colors">Home</a>
                </li>
                <li className="mb-2">
                  <a href="" className="text-sm hover:text-blue-600 transition-colors">Innovations</a>
                </li>
                <li className="mb-2">
                  <a href="" className="text-sm hover:text-blue-600 transition-colors">Products</a>
                </li>
                <li className="mb-2">
                  <a href="" className="text-sm hover:text-blue-600 transition-colors">Blog</a>
                </li>
              </ul>
            </div>
            <div className="mb-8">
              <h5 className="text-lg font-semibold mb-4">Tags</h5>
              <ul>
                <li className="mb-2">
                  <a href="" className="text-sm hover:text-blue-600 transition-colors">Innovations</a>
                </li>
                <li className="mb-2">
                  <a href="" className="text-sm hover:text-blue-600 transition-colors">Technology</a>
                </li>
                <li className="mb-2">
                  <a href="" className="text-sm hover:text-blue-600 transition-colors">Home</a>
                </li>
                <li className="mb-2">
                  <a href="" className="text-sm hover:text-blue-600 transition-colors">Society</a>
                </li>
              </ul>
            </div>
            <div className="mb-8">
              <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
              <p className="text-sm mb-2">cherthala,alappuzha,kerala</p>
              <p className="text-sm mb-2">City, State 12345</p>
              <p className="text-sm mb-2">Email: hasth@gmail.com</p>
              <p className="text-sm mb-2">Phone: +91 8956342357</p>
              <p className="text-sm mb-2 cursor-pointer" onClick={handleClick}>
      admin
    </p>
              
            </div>
          </div>
        </div>
        <div className="bg-blue-200 dark:bg-cyan-950 py-4">
          <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
            &copy; 2024 HASTH. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  