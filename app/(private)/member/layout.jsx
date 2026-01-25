import MemberNavbar from "@/components/members/Navbar";
import React from "react";

const metadata = {
  title: "Member Dashboard",
  description: "Member Dashboard",
};

function MemberLayout({ children }) {
  return (
    <div>
      <MemberNavbar />
      {children}
    </div>
  );
}

export default MemberLayout;
