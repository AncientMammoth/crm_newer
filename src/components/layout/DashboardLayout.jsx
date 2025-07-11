import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar"; // Assuming you have this component
import RegularNavbar from "./RegularNavbar"; // Assuming you have this component

const DashboardLayout = () => {
  // In a real application, you would get the user's role from a more secure location,
  // like a context provider or a Redux store after they log in.
  const userRole = localStorage.getItem("userRole"); // Assuming role is stored in localStorage

  return (
    <div>
      {userRole === "admin" ? <AdminNavbar /> : <RegularNavbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;