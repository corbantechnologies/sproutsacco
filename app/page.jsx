"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Wallet,
  Lock,
  Menu as MenuIcon,
  X as XIcon,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-foreground overflow-x-hidden">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo Placeholder - simplified for reliability */}
            <div className="relative h-12 w-12 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Sprout SACCO"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary hidden sm:block">
              Sprout SACCO
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Button
              asChild
              className="rounded-full bg-primary hover:bg-[#045e32] text-white px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/login">Member Login</Link>
            </Button>
          </nav>

          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[280px] bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-out border-l border-gray-100 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 flex justify-between items-center border-b border-gray-100">
            <span className="font-bold text-lg text-primary">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-2 p-5">
            <Link
              href="#features"
              className="px-4 py-3 rounded-xl hover:bg-gray-50 text-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#about"
              className="px-4 py-3 rounded-xl hover:bg-gray-50 text-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 mt-2 border-t border-gray-100">
              <Button
                asChild
                className="w-full justify-center bg-primary text-white rounded-xl h-12 text-base shadow-lg shadow-primary/20"
              >
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Member Login
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-20 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Building2 className="w-4 h-4" />
            <span>Secure • Reliable • Community-Driven</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 drop-shadow-sm">
            Empowering Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Financial Future
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience secure savings, accessible loans, and a cooperative
            community dedicated to your growth. Manage your finances with trust
            and transparency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="h-14 px-8 rounded-full text-lg bg-primary hover:bg-[#045e32] text-white shadow-xl shadow-primary/25 transition-all hover:scale-105"
            >
              <Link href="/login">
                Access Member Portal
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Sprout SACCO?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Wallet,
                title: "Flexible Savings Plans",
                desc: "Tailored savings types designed to meet your specific financial goals with competitive interest rates.",
              },
              {
                icon: Users,
                title: "Community-Driven",
                desc: "We prioritize member welfare and collective growth. Your success is our success.",
              },
              {
                icon: ShieldCheck,
                title: "Secure Platform",
                desc: "Your data and financial transactions are protected with enterprise-grade security measures.",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="group border-0 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-3xl overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-primary">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
      >
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            About Sprout SACCO
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10">
            Sprout SACCO is dedicated to fostering financial inclusion and
            empowerment. We provide a platform for members to save effectively,
            access affordable loans, and manage their finances with ease. Built
            on the foundations of trust, transparency, and community, we are
            here to help you achieve your dreams.
          </p>
          <div className="p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white/20 shadow-lg inline-block">
            <p className="text-primary font-semibold text-lg">
              Trusted by the Community
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action - Member Focus */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-slate-900 opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Already a Member?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Log in to your account to view your savings, apply for loans, and
            manage your profile from anywhere, anytime.
          </p>
          <Button
            asChild
            className="h-14 px-10 rounded-full text-lg bg-white text-slate-900 hover:bg-gray-100 hover:text-primary shadow-xl shadow-white/10 transition-all font-bold"
          >
            <Link href="/login">Access Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 relative">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Sprout SACCO
                </h3>
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} All rights reserved
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link
                href="#about"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Login
              </Link>
            </div>

            <p className="text-sm text-gray-400">
              Powered by{" "}
              <span className="font-semibold text-gray-600">
                Corban Technologies LTD
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
