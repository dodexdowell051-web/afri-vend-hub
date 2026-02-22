import { Link } from "react-router-dom";
import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";
import AfrivendLogo from "@/components/AfrivendLogo";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <div className="flex items-center gap-3">
                <AfrivendLogo variant="icon" iconSize={40} />
                <span className="text-2xl font-bold text-primary-foreground">Afrivend</span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Africa's trusted marketplace for buyers and sellers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/marketplace" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Featured Sellers
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Sellers */}
          <div>
            <h4 className="font-semibold mb-4">Sellers</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/seller" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Start Selling
                </Link>
              </li>
              <li>
                <Link to="/seller" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Seller Guide
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/seller" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2025 Afrivend. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Built for African entrepreneurs 🌍
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
