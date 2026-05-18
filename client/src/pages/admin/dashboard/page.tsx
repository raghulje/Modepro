import { useState } from "react";
import {
  Home,
  Layout,
  Info,
  Package,
  Images,
  FileText,
  Mail,
  Users,
  LogOut,
  History,
  ScrollText,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { images } from "../../../lib/assets";
import HomePageManagement from "./components/HomePageManagement";
import HeaderFooterManagement from "./components/HeaderFooterManagement";
import AboutPageManagement from "./components/AboutPageManagement";
import ProductsPageManagement from "./components/ProductsPageManagement";
import GalleryPageManagement from "./components/GalleryPageManagement";
import CmsPagesManagement from "./components/CmsPagesManagement";
import SMTPConfiguration from "./components/SMTPConfiguration";
import UserManagement from "./components/UserManagement";
import ActivityLogsPage from "./components/ActivityLogsPage";
import VersionHistoryPage from "./components/VersionHistoryPage";

type MainTab =
  | "home"
  | "header-footer"
  | "about"
  | "products"
  | "gallery"
  | "pages"
  | "smtp"
  | "users"
  | "logs"
  | "versions";

const BRAND = "#0798bc";

const mainTabs: { id: MainTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "header-footer", label: "Header & Footer", icon: Layout },
  { id: "about", label: "About", icon: Info },
  { id: "products", label: "Products", icon: Package },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "pages", label: "CMS Pages", icon: FileText },
  { id: "smtp", label: "SMTP", icon: Mail },
  { id: "users", label: "Users", icon: Users },
  { id: "logs", label: "Activity Logs", icon: ScrollText },
  { id: "versions", label: "Versions", icon: History },
];

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("home");

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={images.logo} alt="Modepro" className="h-10" />
              <div>
                <h1 className="text-xl font-bold" style={{ color: BRAND }}>
                  Modepro CMS
                </h1>
                <p className="text-xs text-[#6B7280]">Content Management System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-sm font-medium text-[#1F2937]">
                Welcome,{" "}
                <span style={{ color: BRAND }}>{user?.email || user?.fullName || "Admin"}</span>
              </p>
              <button
                type="button"
                onClick={() => logout()}
                className="flex items-center space-x-2 px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 overflow-x-auto">
          <div className="flex items-center space-x-1 min-w-max">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeMainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMainTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
                    active ? "border-current" : "text-[#6B7280] border-transparent hover:bg-[#F9FAFB]"
                  }`}
                  style={active ? { color: BRAND, borderColor: BRAND, backgroundColor: "#E6F7FA" } : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeMainTab === "home" && <HomePageManagement />}
        {activeMainTab === "header-footer" && <HeaderFooterManagement />}
        {activeMainTab === "about" && <AboutPageManagement />}
        {activeMainTab === "products" && <ProductsPageManagement />}
        {activeMainTab === "gallery" && <GalleryPageManagement />}
        {activeMainTab === "pages" && <CmsPagesManagement />}
        {activeMainTab === "smtp" && <SMTPConfiguration />}
        {activeMainTab === "users" && <UserManagement />}
        {activeMainTab === "logs" && <ActivityLogsPage />}
        {activeMainTab === "versions" && <VersionHistoryPage />}
      </div>
    </div>
  );
}
