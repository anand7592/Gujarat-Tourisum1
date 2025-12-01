import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Map,
  Package,
  Building2,
  Star,
  Calendar,
  LogOut,
} from "lucide-react";


// 1. Import useNavigate hook from react-router-dom
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "@/context/AuthContext";

function UserAvatarMenu() {
   const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };



  // Function to handle navigation
  interface NavigationHandler {
    (path: string): void;
  }

  const handleNavigation: NavigationHandler = (path: string): void => {
    navigate(path);
  };



  return (
    <>
      {/* Avatar Navigation */}
      <div className="flex items-center">
        <div className="flex items-center gap-4">
           
           {/* Right Side: User Info */}
    
        <span className="text-sm text-gray-600 pr-1">
          Welcome, <strong>{user?.firstName}</strong>
        </span>
      </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button">
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/148118898?s=400&v=4"
                  alt="@user"
                />
                <AvatarFallback>GT</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            {/* MOBILE-ONLY NAV ITEMS (same as desktop menu) */}
            <DropdownMenuItem
              className="md:hidden cursor-pointer"
              // Update: Call handleNavigation with the route path
              onClick={() => handleNavigation("/dashboard")} 
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="md:hidden cursor-pointer"
              // Update: Call handleNavigation with the route path
              onClick={() => handleNavigation("/dashboard/user")}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Manage Users</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="md:hidden cursor-pointer"
              // Update: Call handleNavigation with the route path
              onClick={() => handleNavigation("/dashboard/place")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              <span>Manage Place</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="md:hidden cursor-pointer"
              // Update: Call handleNavigation with the route path
              onClick={() => handleNavigation("/dashboard/subplace")}
            >
              <Map className="mr-2 h-4 w-4" />
              <span>Manage Sub Place</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="md:hidden cursor-pointer"
              // Update: Call handleNavigation with the route path
              onClick={() => handleNavigation("/dashboard/package")}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Manage Package</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="md:hidden cursor-pointer"
              // Update: Call handleNavigation with the route path
              onClick={() => handleNavigation("/dashboard/hotel")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              <span>Manage Hotel</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="md:hidden cursor-pointer"
              // Update: Call handleNavigation with the route path
              onClick={() => handleNavigation("/dashboard/rating")}
            >
              <Star className="mr-2 h-4 w-4" />
              <span>Manage Rating</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="md:hidden cursor-pointer"
              // Update: Call handleNavigation with the route path
              onClick={() => handleNavigation("/dashboard/bookings")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>Bookings</span>
            </DropdownMenuItem>

            {/* LOGOUT – VISIBLE ON ALL SCREENS */}
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer mt-1 border-t border-gray-100"
              onClick={handleLogout} // Keep handleLogout or replace with navigation
            >
              <LogOut className="mr-2 h-4 w-4 text-red-600" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export default UserAvatarMenu;