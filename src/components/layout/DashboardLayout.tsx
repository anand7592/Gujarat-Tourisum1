import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 1. Top Navigation */}
      <Navbar />

      {/* 2. Main Content Area */}
      {/* flex-1 makes this section grow to fill empty space */}
      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>

      {/* 3. Bottom Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;