import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, LogIn } from "lucide-react";

interface AuthRequiredProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function AuthRequired({ children, isOpen, onClose, message }: AuthRequiredProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              Sign In Required
            </DialogTitle>
            <DialogDescription className="text-base">
              {message || "Please sign in or create an account to continue with your booking."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 mt-4">
            <Link to={`/auth?redirect=${encodeURIComponent(window.location.pathname)}`} onClick={onClose}>
              <Button variant="hero" className="w-full gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
            <Link to={`/auth?mode=signup&redirect=${encodeURIComponent(window.location.pathname)}`} onClick={onClose}>
              <Button variant="outline" className="w-full gap-2">
                <User className="w-4 h-4" />
                Create Account
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Creating an account lets you track your bookings, view transaction history, and manage your profile.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{children}</>;
}
