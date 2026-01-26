"use client";

import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import React, { useState } from "react";

function SaccoAdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header className="bg-[#ea1315] text-white sticky top-0 z-50">
        <div className="mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">Sprout SACCO</h1>

          <Button
            variant="outline"
            className="border-white cursor-pointer text-black hover:bg-white hover:"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[200px] sm:w-[300px] bg-white text-black transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out border-l border-[#ea1315] shadow-lg`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold ">Menu</h2>
            <Button
              variant="ghost"
              className="p-2 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <XIcon className="h-5 w-5 text-black" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-6 p-4">
            <Link
              href="/sacco-admin/dashboard"
              className="text-lg hover:"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/sacco-admin/reports"
              className="text-lg hover:"
              onClick={() => setIsMenuOpen(false)}
            >
              Reports
            </Link>
            <Link
              href="/sacco-admin/loan-applications"
              className="text-lg hover:"
              onClick={() => setIsMenuOpen(false)}
            >
              Loan Applications
            </Link>
            <Link
              href="/sacco-admin/personal"
              className="text-lg hover:"
              onClick={() => setIsMenuOpen(false)}
            >
              Personal
            </Link>
            <Link
              href="/sacco-admin/members"
              className="text-lg hover:"
              onClick={() => setIsMenuOpen(false)}
            >
              Members
            </Link>
            <Link
              href="/sacco-admin/personal/guarantorprofile"
              className="text-lg hover:"
              onClick={() => setIsMenuOpen(false)}
            >
              Guarantor Profile
            </Link>
            <Link
              href="/sacco-admin/transact"
              className="text-lg hover:"
              onClick={() => setIsMenuOpen(false)}
            >
              Transact
            </Link>
            <Link
              href="/sacco-admin/withdrawals"
              className="text-lg hover:"
              onClick={() => setIsMenuOpen(false)}
            >
              Withdrawals
            </Link>
            <Link
              href="/sacco-admin/settings"
              className="text-lg hover:"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setIsMenuOpen(false);
                signOut({ callbackUrl: "/login" });
              }}
              className="border-primary text-primary hover:bg-primary hover:text-white text-base py-2"
            >
              Logout
            </Button>
          </nav>
        </div>
      </div>

      {/* Overlay for Sidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default SaccoAdminNavbar;
