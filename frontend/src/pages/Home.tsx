import Banner from "../components/Banner/Banner";
import Bannerafterfeature from "../components/Banner/Bannerafterfeature";
import FeaturedTag from "../components/Featured/FeaturedTag";
import Featuredproducts from "../components/Featured/Featuredproducts";
import Featuredinnovations from "../components/Featured/Feturedinnovations";
import Footer from "../components/Footer/Footer";
import FooterBanner from "../components/Footer/FooterBanner";
const Home:React.FC=()=>{
return(
<>
<Banner/>
<br/>
<Featuredproducts title='Featured Products'/>
<br/>
<Featuredinnovations/>
<br/>
<Featuredproducts title='Recommendation for you'/>
<br/>
<br/>
<FeaturedTag tags={['Innovation', 'Creativity', 'Technology']}/>
<br/>
<Bannerafterfeature 
        title="The future belongs to those who believe in the beauty of their dreams."
        description="Transform your surroundings. One solution. One delivery. One success at a time."
        imageUrl="/images/banner3.jpg"
      />
      <br />
      <Bannerafterfeature 
        title="What is HASTH?"
        description="The Hasth project is a collaborative platform designed to connect innovators, creatives, and users to bring innovative ideas to life. It provides a space where users can share, develop, and commercialize their concepts, with features for buying and selling products, as well as collaborative tools like chat and video calls. The platform also ensures ideas can be patented and products licensed, fostering a supportive environment for innovation and creativity. Admins oversee the activities to maintain quality and security."
        imageUrl="/images/banner4.png"
        reverse 
      />
      <br/>
      <h2 className=" p-9 text-3xl font-bold text-blue-950">What our users are saying</h2>
      <br/>
      <FeaturedTag image={[{image:"images/banner3.jpg",name:'Anila Benny', description:"testimonial"},{image:"images/banner3.jpg",name:'Anila Benny', description:"testimonial"},{image:"images/banner3.jpg",name:'Anila Benny', description:"testimonial"},]}/>
      <br/>
      <br/>
      <Bannerafterfeature 
        title="Come create with us"
        description="Become an creator and change lives including your own"
        imageUrl="/images/banner5.jpg"
        reverse
        tags
      />
      <br/>
      <br/>
      <FooterBanner/>
      <Footer/>
</>
)
}
export default Home;