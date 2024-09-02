import axiosInstance from "../Axiosconfig/Axiosconfig";

export default {
     handleSubmit : async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/api/auth/register', values);

      if (response.data && response.data.status) {
        navigate('/verifyOtp');
        localStorage.removeItem('userEmail');
        localStorage.setItem('userEmail', values.email);
      } else {
        toast.warn(response.data.data);
      }
    } catch (err) {
      console.error('Error during registration:', err);
      toast.error('User registration failed');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  },
  handleGoogleSignIn : async () => {
    window.location.href = 'http://localhost:8080/api/auth/google';
  },
  fetchPosts : async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/posts?page=${currentPage}&limit=${postsPerPage}`);
      if (Array.isArray(response.data.data)) {
        console.log(response.data.data);
        
        setPosts(response.data.data);
      } else {
        console.error("Invalid post data:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  },
   fetchProducts: async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/products?page=${currentPage}&limit=${productsPerPage}`);
      if (Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } else {
        console.error("Invalid product data:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

}