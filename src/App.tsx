import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import WriterDashboard from "./pages/WriterDashboard";
import Profile from "./pages/Profile";
import AuthorProfile from "./pages/AuthorProfile";
import ArticleDetail from "./pages/ArticleDetail";
import ReadingLists from "./pages/ReadingLists";
import AdsManagement from "./pages/AdsManagement";
import FollowingManagement from "./pages/FollowingManagement";
import Analytics from "./pages/Analytics";
import AdvancedSearch from "./pages/AdvancedSearch";
import SeriesManagement from "./pages/SeriesManagement";
import Monetization from "./pages/Monetization";
import RewardsDashboard from "./pages/RewardsDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/write" element={<WriterDashboard />} />
            <Route path="/write/:id" element={<WriterDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/author/:id" element={<AuthorProfile />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            <Route path="/reading-lists" element={<ReadingLists />} />
            <Route path="/following" element={<FollowingManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/search" element={<AdvancedSearch />} />
            <Route path="/series" element={<SeriesManagement />} />
            <Route path="/monetization" element={<Monetization />} />
            <Route path="/rewards" element={<RewardsDashboard />} />
            <Route path="/ads" element={<AdsManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
