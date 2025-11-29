import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    userType: "public" | "government";
  } | null;
  onLogout?: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline text-foreground">CivicVoice</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link to="/dashboard/public">
                  <Button
                    variant={
                      isActive("/dashboard/public") ? "default" : "ghost"
                    }
                    className="text-sm"
                  >
                    Dashboard
                  </Button>
                </Link>
                {user.userType === "government" && (
                  <Link to="/dashboard/government">
                    <Button
                      variant={
                        isActive("/dashboard/government") ? "default" : "ghost"
                      }
                      className="text-sm"
                    >
                      Government Panel
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.userType === "government"
                        ? "Government Official"
                        : "Public User"}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="ml-2"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant={isActive("/login") ? "default" : "ghost"}
                    className="text-sm"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="text-sm" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/dashboard/public">
                    <Button
                      variant={
                        isActive("/dashboard/public") ? "default" : "ghost"
                      }
                      className="w-full justify-start"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  {user.userType === "government" && (
                    <Link to="/dashboard/government">
                      <Button
                        variant={
                          isActive("/dashboard/government")
                            ? "default"
                            : "ghost"
                        }
                        className="w-full justify-start"
                      >
                        Government Panel
                      </Button>
                    </Link>
                  )}
                  <div className="px-4 py-2 text-sm">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.userType === "government"
                        ? "Government Official"
                        : "Public User"}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full justify-start">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-900 text-white border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                CivicVoice
              </div>
              <p className="text-sm text-slate-400">
                Bringing transparency to government services through citizen
                feedback.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Public</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link to="/" className="hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/public" className="hover:text-white transition">
                    File Complaint
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Government</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link to="/dashboard/government" className="hover:text-white transition">
                    Government Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
            <p>
              &copy; 2024 CivicVoice. All rights reserved. Promoting
              transparency in government.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
