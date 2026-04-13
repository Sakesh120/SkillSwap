function Footer() {
  return (
    <footer className="bg-white border-t mt-10">
      
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Logo / About */}
        <div>
          <h2 className="font-[Space_Grotesk] text-2xl font-bold text-gray-900">
            SkillSwap
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Learn skills, teach skills, and grow together using a credit-based system.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:text-blue-500 cursor-pointer">About</li>
            <li className="hover:text-blue-500 cursor-pointer">Contact</li>
            <li className="hover:text-blue-500 cursor-pointer">Login</li>
            <li className="hover:text-blue-500 cursor-pointer">Sign Up</li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Connect</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Email: skillswap@gmail.com</li>
            <li className="hover:text-blue-500 cursor-pointer">Instagram</li>
            <li className="hover:text-blue-500 cursor-pointer">LinkedIn</li>
            <li className="hover:text-blue-500 cursor-pointer">Twitter</li>
          </ul>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="border-t text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} SkillSwap. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;