import BallLogo from './BallLogo';

const Footer = () => {
  return (
    <footer className="bg-white/90 backdrop-blur-md border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <BallLogo size={20} className="sm:w-6 sm:h-6" />
            <span className="text-gray-600 text-xs sm:text-sm">
              © 2025 Ball. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 order-1 sm:order-2">
            <a href="/privacy" className="hover:text-ballgreen transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-ballgreen transition-colors">
              Terms of Service
            </a>
            <a href="/support" className="hover:text-ballgreen transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;