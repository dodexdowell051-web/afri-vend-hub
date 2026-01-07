import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Store, ArrowRight } from "lucide-react";
import AfrivendLogo from "./AfrivendLogo";

interface RoleSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoleSelectionDialog = ({ open, onOpenChange }: RoleSelectionDialogProps) => {
  const navigate = useNavigate();

  const handleSelect = (role: "buyer" | "seller") => {
    onOpenChange(false);
    navigate(`/signup?role=${role}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 rounded-2xl">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <AfrivendLogo variant="full" iconSize={48} />
          </div>

          <DialogHeader className="text-center mb-8">
            <DialogTitle className="text-2xl font-bold mb-2">
              How would you like to use Afrivend?
            </DialogTitle>
            <p className="text-muted-foreground">
              Choose your path to get started
            </p>
          </DialogHeader>

          {/* Role Cards */}
          <div className="grid gap-4">
            {/* Buyer Card */}
            <button
              onClick={() => handleSelect("buyer")}
              className="group relative flex items-center gap-4 p-5 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ShoppingCart className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Continue as Buyer
                </h3>
                <p className="text-sm text-muted-foreground">
                  Shop products from trusted sellers across Africa
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>

            {/* Seller Card - More prominent */}
            <button
              onClick={() => handleSelect("seller")}
              className="group relative flex items-center gap-4 p-5 rounded-xl border-2 border-secondary bg-gradient-to-r from-secondary/5 to-accent/5 hover:border-secondary hover:from-secondary/10 hover:to-accent/10 transition-all duration-200 text-left"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                <Store className="w-7 h-7 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Continue as Seller
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sell products and manage your store with ease
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Already have account */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button 
              onClick={() => {
                onOpenChange(false);
                navigate("/login");
              }}
              className="text-primary font-medium hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionDialog;
