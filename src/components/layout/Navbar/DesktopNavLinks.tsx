import {
  LayoutDashboard,
  Users,
  MapPin,
  Map,
  Package,
  Building2,
  Star,
  Calendar,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
function DesktopNavLinks() {
  return (
    <div className="flex">
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <NavLink
          to="/dashboard"
          className="items-center gap-2 hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        <Link
          to="dashboard/user"
          className="items-center gap-2 hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          <Users className="w-4 h-4" />
          <span>Users</span>
        </Link>

        <Link
          to="/dashboard/place"
          className="items-center gap-2 hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          <MapPin className="w-4 h-4" />
          <span>Place</span>
        </Link>

        <Link
          to="/dashboard/subplace"
          className="items-center gap-2 hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          <Map className="w-4 h-4" />
          <span>Sub Place</span>
        </Link>

        <Link
          to="/dashboard/package"
          className="items-center gap-2 hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          <Package className="w-4 h-4" />
          <span>Package</span>
        </Link>

        <Link
          to="/dashboard/hotel"
          className="items-center gap-2 hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          <Building2 className="w-4 h-4" />
          <span>Hotel</span>
        </Link>

        <Link
          to="/dashboard/rating"
          className="items-center  gap-2 hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          <Star className="w-4 h-4" />
          <span>Rating</span>
        </Link>

        <Link
          to="/dashboard/bookings"
          className="items-center gap-2 hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          <Calendar className="w-4 h-4" />
          <span>Bookings</span>
        </Link>
      </div>
    </div>
  );
}

export default DesktopNavLinks;
