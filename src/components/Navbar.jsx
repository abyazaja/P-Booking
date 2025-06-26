import BallLogo from './BallLogo';

const Navbar = () => {
  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo Section */}
          <a href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <BallLogo size={32} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />
            <span className="hidden xs:block text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
              Ball
            </span>
          </a>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="/GuestDashboard" className="text-gray-700 hover:text-ballgreen font-medium transition-colors text-sm xl:text-base">
              Dashboard
            </a>
            <a href="/about" className="text-gray-700 hover:text-ballgreen font-medium transition-colors text-sm xl:text-base">
              About
            </a>
            <a href="/courts" className="text-gray-700 hover:text-ballgreen font-medium transition-colors text-sm xl:text-base">
              Court
            </a>
            <a href="/contact" className="text-gray-700 hover:text-ballgreen font-medium transition-colors text-sm xl:text-base">
              Contact
            </a>
          </div>

          {/* Auth Buttons - Responsive */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <a 
              href="/login" 
              className="text-ballgreen font-semibold hover:text-ballgreen/80 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-ballgreen/10 text-sm sm:text-base"
            >
              Login
            </a>
            <a 
              href="/register" 
              className="bg-ballorange text-white font-semibold hover:bg-ballorange/90 transition-all px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-lg shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Register
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors ml-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;