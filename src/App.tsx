import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import AnalyticsPage from "./pages/AnalyticsPage";
import DocumentsPage from "./pages/DocumentsPage";
import MapPage from "./pages/MapPage";
import ApiConfig from "./pages/ApiConfig";
import SettingsPage from "./pages/SettingsPage";
import UploadData from "./pages/UploadData";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/hooks/useAuth"; // Add this import

const App = () => {
  console.log('App component rendering');
  const { user, session } = useAuth(); // Get user and session

  return (
    <TooltipProvider>
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/api-config" element={<ApiConfig />} />
        <Route path="/settings" element={<SettingsPage user={user} session={session} />} />
        <Route path="/upload" element={<UploadData />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
};

export default App;