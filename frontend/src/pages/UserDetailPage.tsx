
import FooterBanner from "../components/Footer/FooterBanner";
import Footer from "../components/Footer/Footer";

import UserDetail from "../components/singleuser/UserDetail";

export default()=>{
    return(
        <>
        <br/>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <UserDetail/>
        </div>
       
        <br/>
        <br/>
        <FooterBanner/>
        <Footer/>
        </>
    )
}
