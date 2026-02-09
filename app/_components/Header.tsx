"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact us", path: "/contact-us" },
];

function Header() {
  const { user } = useUser();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={30} height={30} />
          <h2 className="font-bold text-sm sm:text-base">
            AI TRAVEL AGENT
          </h2>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-6 items-center">
          {menuOptions.map((menu) => (
            <Link key={menu.path} href={menu.path}>
              <span
                className={`text-sm font-medium hover:text-primary transition ${
                  path === menu.path ? "text-primary" : ""
                }`}
              >
                {menu.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <SignInButton mode="modal">
              <Button>Get Started</Button>
            </SignInButton>
          ) : path === "/create-new-trip" ? (
            <Link href="/my-trips">
              <Button>My Trips</Button>
            </Link>
          ) : (
            <Link href="/create-new-trip">
              <Button>Create New Trip</Button>
            </Link>
          )}
          <UserButton />
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* MOBILE MENU PANEL */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-3">
            {menuOptions.map((menu) => (
              <Link
                key={menu.path}
                href={menu.path}
                onClick={() => setOpen(false)}
              >
                <span
                  className={`block text-sm font-medium ${
                    path === menu.path ? "text-primary" : ""
                  }`}
                >
                  {menu.name}
                </span>
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t flex flex-col gap-3">
            {!user ? (
              <SignInButton mode="modal">
                <Button className="w-full">Get Started</Button>
              </SignInButton>
            ) : path === "/create-new-trip" ? (
              <Link href="/my-trips" onClick={() => setOpen(false)}>
                <Button className="w-full">My Trips</Button>
              </Link>
            ) : (
              <Link href="/create-new-trip" onClick={() => setOpen(false)}>
                <Button className="w-full">Create New Trip</Button>
              </Link>
            )}

            <div className="flex justify-center pt-2">
              <UserButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
