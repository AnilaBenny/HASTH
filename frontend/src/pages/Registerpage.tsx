import React from "react";
import FooterBanner from "../components/Footer/FooterBanner";
import Footer from "../components/Footer/Footer";
import Register from "../components/Register/Register";

const Registerpage:React.FC=()=>{
    return(
        <>
        <br/>
        <Register/>
        <br/>
        <br/>
        <FooterBanner/>
        <Footer/>
        </>
    )
}
export default Registerpage;