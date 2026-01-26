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
      <header className="bg-[#174271] text-white sticky top-0 z-50 shadow-sm">
        <div className="mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/sacco-admin/dashboard"
            className="flex items-center gap-2"
          >
            <span className="text-xl md:text-2xl font-bold tracking-tight">
              Sprout SACCO{" "}
              <span className="text-[10px] font-normal uppercase tracking-[2px] opacity-70 ml-1">
                Admin
              </span>
            </span>
          </Link>

          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[280px] bg-white text-slate-900 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out border-l shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#174271]">Admin Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-slate-100 rounded-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col p-4 overflow-y-auto h-full">
            {[
              { label: "Dashboard", href: "/sacco-admin/dashboard" },
              { label: "Reports", href: "/sacco-admin/reports" },
              {
                label: "Loan Applications",
                href: "/sacco-admin/loan-applications",
              },
              { label: "Members", href: "/sacco-admin/members" },
              { label: "Personal Profile", href: "/sacco-admin/personal" },
              {
                label: "Guarantor Profile",
                href: "/sacco-admin/personal/guarantorprofile",
              },
              { label: "Transact", href: "/sacco-admin/transact" },
              { label: "Withdrawals", href: "/sacco-admin/withdrawals" },
              { label: "Settings", href: "/sacco-admin/settings" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 text-[14px] font-medium transition-colors hover:bg-slate-50 hover:text-[#174271] rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-auto pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="w-full border-[#174271] text-[#174271] hover:bg-[#174271] hover:text-white"
              >
                Logout
              </Button>
            </div>
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
