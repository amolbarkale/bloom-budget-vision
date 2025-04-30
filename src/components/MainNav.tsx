import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  PlusCircle,
  BarChartHorizontal,
  Target,
  User,
  LogOut,
} from "lucide-react";

const MainNav = () => {
  const { signOut } = useAuth();

  return (
    <nav className="bg-background py-4 border-b sticky top-0 z-10">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-budget-primary mr-4">
            BudgetBloom
          </h1>

          <div className="hidden sm:flex space-x-1">
            <NavLinkButton to="/dashboard" icon={<Home size={18} />}>
              Home
            </NavLinkButton>
            <NavLinkButton to="/add-expense" icon={<PlusCircle size={18} />}>
              Add
            </NavLinkButton>
            <NavLinkButton
              to="/history"
              icon={<BarChartHorizontal size={18} />}
            >
              History
            </NavLinkButton>
            <NavLinkButton to="/goals" icon={<Target size={18} />}>
              Goals
            </NavLinkButton>
            <NavLinkButton to="/profile" icon={<User size={18} />}>
              Profile
            </NavLinkButton>
          </div>
        </div>

        <div className="hidden sm:block">
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut size={16} className="mr-1" /> Logout
          </Button>
        </div>

        {/* Mobile navigation */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-between z-10">
          <NavLinkIcon to="/dashboard" icon={<Home size={20} />} label="Home" />
          <NavLinkIcon
            to="/add-expense"
            icon={<PlusCircle size={20} />}
            label="Add"
          />
          <NavLinkIcon
            to="/history"
            icon={<BarChartHorizontal size={20} />}
            label="History"
          />
          <NavLinkIcon to="/goals" icon={<Target size={20} />} label="Goals" />
          <NavLinkIcon
            to="/profile"
            icon={<User size={20} />}
            label="Profile"
          />
        </div>
      </div>
    </nav>
  );
};

const NavLinkButton = ({ to, icon, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }`
      }
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </NavLink>
  );
};

const NavLinkIcon = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center px-4 py-1 text-xs ${
          isActive ? "text-primary font-medium" : "text-muted-foreground"
        }`
      }
    >
      <span className="mb-1">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default MainNav;
