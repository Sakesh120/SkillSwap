import Button from "./Button";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <div className="app-shell mt-10 flex flex-col items-center px-4 pb-12 text-center sm:pb-16">
      <p className="mb-4 bg-linear-to-r from-blue-600 via-purple-500 to-indigo-500 bg-clip-text text-center font-[Space_Grotesk] text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl xl:max-w-5xl">
        Start Learning Today Without Paying Money
      </p>

      <p className="mb-6 mt-4 text-center font-[Poppins] text-lg text-gray-600 sm:text-2xl lg:text-3xl">
        Teach What You Know. Learn What You Want.
      </p>

      <Link to="/signup">
        <Button text="Join SkillSwap" />
      </Link>
    </div>
  );
}

export default CTA;
