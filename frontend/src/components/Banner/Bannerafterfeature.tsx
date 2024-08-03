import './Banner.css';

type BannerafterfeatureProps = {
  title: string;
  description: string;
  imageUrl: string;
  reverse?: boolean; 
  tags?:boolean;
};

const Bannerafterfeature: React.FC<BannerafterfeatureProps> = ({ title, description, imageUrl, reverse = false ,tags=false}) => {
  return (
    <div className={`relative flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} justify-evenly items-center p-6`}>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt="Banner"
          className="bannerimage max-w-full md:max-w-sm mb-4 md:mb-0"
        />
      </div>

      <div className="text-content p-4">
        <h1 className="text-center md:text-left text-5xl font-bold text-blue-950">
          {title}
        </h1>
        <h3 className="text-center md:text-left text-xl text-blue-950 mt-4">
          {description}
        </h3>
        <br/>
        {tags&&(
          <div className='flex flex-col justify-center'>
          <div className='flex flex-wrap justify-between'>
          <button className="bg-blue-300 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-4">Expert Instruction</button>
          <button className="bg-blue-300 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-4">Lifetime Access</button>
          <button className="bg-blue-300 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-4">connect with others</button>
          </div>
          <br/>
          <br/>
          <br/>
          <button className="bg-blue-950 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">Get Started</button>
          </div>
        )
        }
      </div>
    </div>
  );
};

export default Bannerafterfeature;
