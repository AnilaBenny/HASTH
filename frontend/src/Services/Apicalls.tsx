import { useDispatch } from "react-redux";
import axiosInstance from "../Axiosconfig/Axiosconfig";
import { toast } from 'react-toastify';
import { updateQuantity, addToCart, clearCart } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const useApiService = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();

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

  const handleReviewEdit=async(productId:string,reviewId:string,reviewStar:any,reviewdescription:string)=>{
    try {
      const response=await axiosInstance.post(`/api/auth/reviewEdit`,{productId,reviewId,reviewStar,reviewdescription})
      console.log(response);
      
      return response.data.data;
    } catch (error) {
      console.error('Error handleReviewEdit:', error);
      toast.error('An error occurred while handleReviewEdit');    
    }
  }

  const handleFailurePayment=async(cart:any)=>{
    try{
      const res = await axiosInstance.post('/api/auth/order', { cart ,paymentMethod:'Razorpay',failure:true});
      console.log(res);
      
      
  
        if (res.status===200) {
          console.log("Order created successfully:");
          dispatch(clearCart());
        
          navigate('/order-confirmation', { state: { order:res?.data.data } });
        } else {
          console.error("Order creation failed");
          alert("Order creation failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during payment processing:", error);
        alert("An error occurred while processing your payment. Please try again.");
      }
  }
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const handleRazorPayment = async (order:any,user:any) => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const orderData = await axiosInstance.post('/api/auth/order/createOnlineOrder', {
      amount: order.totalAmount,
      currency: 'INR',
      receipt: order.orderId,
      paymentMethod:'Razorpay'
    });

    const { amount, id: order_id, currency } = orderData.data;
   
    const options = {
      key: "rzp_test_2sQVid1X3uLewM",
      amount: amount,
      currency: currency,
      name: "Hasth",
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response:any) {
        console.log(response);
        
        try{

        const res = await axiosInstance.post('/api/auth/paymentStatus',{orderId:order._id});
        console.log(res);
        if(res.data.status){
          return true
        }
       

        } catch (error) {
          console.error("Error during payment processing:", error);
          alert("An error occurred while processing your payment. Please try again.");
        }
        
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },

    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
  };

  return {
    handleGoogleSignIn,
    fetchPosts,
    fetchProducts,
    handleAddToCart,
    fetchallLists,
    fetchReports,
    fetchUsers,
    fetchOrders,
    handleReviewEdit,
    handleFailurePayment,
    handleRazorPayment
  };
};

export default useApiService;
