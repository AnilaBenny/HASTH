import './Banner.css';

const Banner = () => {
  return (
    <div className="relative flex flex-col md:flex-row justify-evenly items-center p-4">
      <div className="relative">
        <img 
          src="/images/banner1.jpg" 
          alt="Banner"
          className="banner-image max-w-full md:max-w-sm mb-4 md:mb-0"
        />
        <div className="bulb-container absolute inset-0 flex justify-center items-center">
          <img 
            src="/images/banner2.png" 
            alt="Bulb"
            className="bulb-image"
          />
        </div>
      </div>

      <h1 className="text-center md:text-left text-5xl font-bold text-blue-950 p-4">
        A Helping Hasth for your idea, and we help you take your product into society.
      </h1>
    </div>
  );
};

export default Banner;
