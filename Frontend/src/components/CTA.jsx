import Button from "./Button";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <div className=" flex flex-col items-center text-center mt-10 ">
      <p className=" font-[Space_Grotesk] 
text-3xl md:text-5xl 
font-bold 
bg-linear-to-r from-blue-600 via-purple-500 to-indigo-500 
text-transparent bg-clip-text 
tracking-tight
text-center mb-4
">
        Start Learning Today Without Paying Money
      </p>

      <p className="mb-6 font-[Poppins] 
text-lg md:text-3xl 
mt-4 
text-gray-600 
text-center 
">
        Teach What You Know. Learn What You Want.
      </p>

     <Link to="/signup"><Button text="Join SkillSwap" >  </Button>
      </Link> 
    </div>
  );
}

export default CTA;