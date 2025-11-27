
import DesktopNavLinks from "./DesktopNavLinks";
import UserAvatarMenu from "./UserAvatarMenu";

const Navbar = () => {

  return (
  <nav className="bg-gray-800 text-white shadow-md w-full z-50">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              Gujarat Tourism
            </h1>
          </div>

          {/* Desktop Menu */}
          <DesktopNavLinks />

          {/* Avatar Navigation */}
          <UserAvatarMenu />
        </div>
      </div>
      {/* Right Side: User Info & Logout */}
      
    </nav>
  );
};

export default Navbar;