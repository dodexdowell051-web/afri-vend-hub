import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import AfrivendLogo from "@/components/AfrivendLogo";
import RoleSelectionDialog from "@/components/RoleSelectionDialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(15,95,61,0.5)] hover:scale-[1.02]">
              <AfrivendLogo variant="full" iconSize={48} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Home
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                About
              </Link>
              {user && profile?.role === "seller" && (
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Dashboard
                </Link>
              )}
              {user && (
                <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Marketplace
                </Link>
              )}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <User className="w-4 h-4" />
                      {profile?.first_name || "Account"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to={profile?.role === "seller" ? "/dashboard" : "/marketplace"}>
                        {profile?.role === "seller" ? "Dashboard" : "Marketplace"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="default" 
                  onClick={() => setSignInDialogOpen(true)}
                  className="px-6"
                >
                  Sign in
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <nav className="flex flex-col gap-4">
                <Link 
                  to="/" 
                  className="text-foreground font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-foreground font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                {user && profile?.role === "seller" && (
                  <Link 
                    to="/dashboard" 
                    className="text-foreground font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {user && (
                  <Link 
                    to="/marketplace" 
                    className="text-foreground font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Marketplace
                  </Link>
                )}
                <div className="pt-4 border-t border-border">
                  {user ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSignInDialogOpen(true);
                      }}
                    >
                      Sign in
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Role Selection Dialog */}
      <RoleSelectionDialog 
        open={signInDialogOpen} 
        onOpenChange={setSignInDialogOpen} 
      />
    </>
  );
};

export default Header;
