import { useDispatch } from "react-redux";
import axiosInstance from "../Axiosconfig/Axiosconfig";
import { toast } from 'react-toastify';
import { updateQuantity, addToCart } from "../store/slices/cartSlice";

const useApiService = () => {
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    window.location.href = 'http://localhost:8080/api/auth/google';
  };

  const fetchPosts = async (currentPage: number, postsPerPage: number, setPosts: (posts: any[]) => void) => {
    try {
      const response = await axiosInstance.get(`/api/auth/posts?page=${currentPage}&limit=${postsPerPage}`);
      if (Array.isArray(response.data.data)) {
        setPosts(response.data.data);
      } else {
        console.error("Invalid post data:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchProducts = async (
    currentPage: number,
    productsPerPage: number,
    setProducts: (products: any[]) => void,
    setFilteredProducts: (products: any[]) => void
  ) => {
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

  const handleAddToCart = async (productId: string, cart: any, userId: string) => {
    try {
      const response = await axiosInstance.post('/api/auth/addtocart', { productId, userId });
      
      if (response.data.status) {
        if (cart && cart.items) {
          const existingCartItem = cart.items.find((item: any) => item.productId._id === productId);
          
          if (existingCartItem) {
            dispatch(updateQuantity({
              itemId: existingCartItem._id,
              quantity: existingCartItem.quantity + 1
            }));
            toast.success('Product quantity updated in cart');
          } else {
            dispatch(addToCart(response.data.data));
            toast.success('Product added to cart successfully');
          }
        } else {
          dispatch(addToCart(response.data.data));
          toast.success('Product added to cart successfully');
        }
      } else {
        if (response.data.message === 'PRODUCT_LIMIT_EXCEEDED') {
          toast.error('You cannot add more than 5 products to your cart');
        } else if (response.data.error === 'OUT_OF_STOCK') {
          toast.error('Product is out of stock');
        } else {
          toast.error('Failed to add product to cart');
        }
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('An error occurred while adding the product to cart');
    }
  };

  const fetchallLists=async(timeFrame:string)=>{
    try {
      const response=await axiosInstance.get(`/api/auth/allListNumber?timeFrame=${timeFrame}`)
      return response.data.data;
      
    } catch (error) {
      console.error('Error fetchallLists:', error);
      toast.error('An error occurred while fetchallLists');
    }
  };
  const fetchUsers=async()=>{
    try {
      const response=await axiosInstance.get(`/api/auth/getAllUsers`);

      
      return response.data.data.users;

      
    } catch (error) {
      console.error('Error fetchUsers:', error);
      toast.error('An error occurred while fetchUsers');
    }
  }
  const fetchReports=async()=> {
    try {
      const response=await axiosInstance.get(`/api/auth/reports`)
      return response.data.data;
      
    } catch (error) {
      console.error('Error fetchReports:', error);
      toast.error('An error occurred while fetchReports');
    }
  }

  const fetchOrders=async()=>{
    try {
      const response=await axiosInstance.get(`/api/auth/admin/allorders`)
      return response.data.data.orders;
    } catch (error) {
      console.error('Error fetchOrders:', error);
      toast.error('An error occurred while fetchOrders');    
    }
  }

  return {
    handleGoogleSignIn,
    fetchPosts,
    fetchProducts,
    handleAddToCart,
    fetchallLists,
    fetchReports,
    fetchUsers,
    fetchOrders
  };
};

export default useApiService;
