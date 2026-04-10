import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import Button from "./Button";


function Hero() {
  return (
    
    <div
    
      className="h-screen flex flex-col justify-center items-center text-center text-white pt-20"
      style={{
        backgroundImage: "url('/hero.png')", // put image in public folder
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
        <Navbar />
      {/* overlay */}
      
    
        <h1 className="text-transparent bg-clip-text bg-linear-to-r to-emerald-500 from-sky-400 text-9xl font-bold mb-4">
          SKILL SWAP
        </h1>

        <p className="text-2xl italic font-medium leading-relaxed text-heading text-black mb-8">
          Learn Skills. Teach Skills. Earn Credits.
        </p>


 <Link to="/signup">
        <Button  text="Get Started" 
        >
       
    </Button>
      </Link>

    </div>
  );
}

export default Hero;