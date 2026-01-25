import SaccoAdminNavbar from "@/components/saccoadmin/Navbar";
import React from "react";

function SaccoAdminLayout({ children }) {
  return (
    <>
      <SaccoAdminNavbar />
      {children}
    </>
  );
}

export default SaccoAdminLayout;
