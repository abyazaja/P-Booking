// src/components/UserHeader.jsx
import BallLogo from './BallLogo';

const Navbar = () => {
  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="w-full pl-12 pr-12 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo kiri */}
          <a href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <BallLogo size={32} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />
            <span className="hidden xs:block text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
              Ball
            </span>
          </a>

          {/* Menu tengah - tetap center */}
          {/* Menu tengah (digeser 5cm ke kanan) */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-6 xl:space-x-8 ml-[3.4cm]">
            <a
              href="#dashboard-section"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('dashboard-section');
              }}
              className="text-gray-700 hover:text-ballgreen font-medium transition-colors text-sm xl:text-base"
            >
              Dashboard
            </a>
            <a
              href="#about-section"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('about-section');
              }}
              className="text-gray-700 hover:text-ballgreen font-medium transition-colors text-sm xl:text-base"
            >
              About
            </a>
            <a
              href="#court-section"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('court-section');
              }}
              className="text-gray-700 hover:text-ballgreen font-medium transition-colors text-sm xl:text-base"
            >
              Court
            </a>
            <a
              href="#contact-section"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('contact-section');
              }}
              className="text-gray-700 hover:text-ballgreen font-medium transition-colors text-sm xl:text-base"
            >
              Contact
            </a>
          </div>


          {/* Tombol Auth kanan */}
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

          {/* Tombol menu mobile */}
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
