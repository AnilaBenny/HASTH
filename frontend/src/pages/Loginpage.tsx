import React from "react";
import Login from "../components/Login/Login";
import FooterBanner from "../components/Footer/FooterBanner";
import Footer from "../components/Footer/Footer";

const Loginpage:React.FC=()=>{
    return(
        <>
        <Login/>
        <br/>
        <br/>
        <FooterBanner/>
        <Footer/>
        </>
    )
}
export default Loginpage;