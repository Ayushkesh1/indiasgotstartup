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
import Leaderboard from "./pages/Leaderboard";
import SeriesDetail from "./pages/SeriesDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorProgram from "./pages/CreatorProgram";
import CreatorCheckout from "./pages/CreatorCheckout";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Advertise from "./pages/Advertise";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import SocialImpact from "./pages/SocialImpact";
import Grants from "./pages/Grants";
import GrantDetail from "./pages/GrantDetail";
import Events from "./pages/Events";

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
            <Route path="/creator-dashboard" element={<CreatorDashboard />} />
            <Route path="/creator-program" element={<CreatorProgram />} />
            <Route path="/creator-program/checkout" element={<CreatorCheckout />} />
            <Route path="/subscription" element={<SubscriptionManagement />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/series/:id" element={<SeriesDetail />} />
            
            {/* Static Pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/advertise" element={<Advertise />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/social-impact" element={<SocialImpact />} />
            <Route path="/grants" element={<Grants />} />
            <Route path="/grants/:id" element={<GrantDetail />} />
            <Route path="/events" element={<Events />} />
            
            <Route path="/ads" element={<AdsManagement />} />
            
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
