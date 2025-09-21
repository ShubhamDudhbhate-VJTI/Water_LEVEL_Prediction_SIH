import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Droplets, Database, Upload, Settings, BarChart } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Chatbot", icon: Droplets },
    { href: "/upload-data", label: "Upload Data", icon: Upload },
    { href: "/api-config", label: "API Config", icon: Database },
    { href: "/analytics", label: "Analytics", icon: BarChart },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const NavLinks = ({ mobile = false }) => (
    <div className={`${mobile ? "flex flex-col space-y-2" : "hidden md:flex space-x-1"}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link key={item.href} to={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`${mobile ? "w-full justify-start" : ""} ${
                isActive ? "bg-primary text-primary-foreground" : ""
              }`}
              onClick={() => mobile && setIsOpen(false)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <Droplets className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-primary">AquaBot Assistant</h1>
          </div>

          <NavLinks />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold">AquaBot Assistant</span>
                </div>
                <NavLinks mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};