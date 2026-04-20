import Button from "./Button";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <div className="app-shell mt-10 flex flex-col items-center px-4 pb-12 text-center sm:pb-16">
      <p className="text-fluid-h2 mb-4 bg-linear-to-r from-blue-600 via-purple-500 to-indigo-500 bg-clip-text text-center font-[Space_Grotesk] font-bold tracking-tight text-transparent xl:max-w-5xl">
        Start Learning Today Without Paying Money
      </p>

      <p className="text-fluid-lead mb-6 mt-4 text-center font-[Poppins] text-gray-600">
        Teach What You Know. Learn What You Want.
      </p>

      <Link to="/signup">
        <Button text="Join SkillSwap" />
      </Link>
    </div>
  );
}

export default CTA;
