import {
  Search,
  Bookmark,
  Plus,
  HelpCircle,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Palette,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PersonalizeView from "../component/topbar/PersonalizeView";
import { ThemeLanguageDemo } from "@/components/ThemeLanguageDemo";
import RoleSwitcher from "@/components/RoleSwitcher";

function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // const { theme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    window.location.href = "/login";
  };
  return (
    <header
      className={`bg-background border-b border-border ${
        location.pathname === "/entry" ? "blur-sm pointer-events-none" : ""
      }`}
    >
      <div className="max-w-9xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-foreground">Mukut</h1>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-foreground font-medium">XYZ Builders</span>
              <span className="text-muted-foreground">Hatirpool Branch</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
            </button>

            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>

            <button
              onClick={() =>
                navigate("/app/sales/new", {
                  state: { fromTopbar: true, from: location.pathname },
                })
              }
              disabled={
                location.pathname === "/app/sales/new" ||
                location.pathname.startsWith("/app/sales/edit")
              }
              className={`transition-colors ${
                location.pathname === "/app/sales/new" ||
                location.pathname.startsWith("/app/sales/edit")
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Plus className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-border"></div>

            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>

            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Palette className="w-5 h-5" />
              </button>

              {showThemeDropdown && (
                <div className="absolute right-0 mt-2 bg-white  py-1 z-50">
                  <PersonalizeView />
                </div>
                // onClose={() => setShowThemeDropdown(false)}
              )}
            </div>

            <RoleSwitcher />

            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="fixed top-0 text-muted-foreground hover:text-foreground transition-colors left-1/2">
              <ThemeLanguageDemo />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <User className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Sayed"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role || "Role"}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
