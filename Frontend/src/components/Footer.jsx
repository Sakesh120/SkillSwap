function Footer() {
  return (
    <footer className="mt-10 border-t bg-white">
      <div className="app-shell grid grid-cols-1 gap-8 py-10 text-center md:grid-cols-3 md:text-left">
        <div>
          <h2 className="text-fluid-h3 font-[Space_Grotesk] font-bold text-gray-900">
            SkillSwap
          </h2>
          <p className="text-fluid-p mt-2 text-gray-600">
            Learn skills, teach skills, and grow together using a credit-based
            system.
          </p>
        </div>

        <div>
          <h3 className="text-fluid-label mb-3 font-semibold text-gray-800">
            Quick Links
          </h3>
          <ul className="text-fluid-p space-y-2 text-gray-600">
            <li className="cursor-pointer hover:text-blue-500">About</li>
            <li className="cursor-pointer hover:text-blue-500">Contact</li>
            <li className="cursor-pointer hover:text-blue-500">Login</li>
            <li className="cursor-pointer hover:text-blue-500">Sign Up</li>
          </ul>
        </div>

        <div>
          <h3 className="text-fluid-label mb-3 font-semibold text-gray-800">
            Connect
          </h3>
          <ul className="text-fluid-p space-y-2 text-gray-600">
            <li>Email: skillswap@gmail.com</li>
            <li className="cursor-pointer hover:text-blue-500">Instagram</li>
            <li className="cursor-pointer hover:text-blue-500">LinkedIn</li>
            <li className="cursor-pointer hover:text-blue-500">Twitter</li>
          </ul>
        </div>
      </div>

      <div className="text-fluid-caption border-t py-4 text-center text-gray-500">
        Copyright {new Date().getFullYear()} SkillSwap. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
