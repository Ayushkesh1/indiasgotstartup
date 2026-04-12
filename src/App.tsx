import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import React, { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import { PageLoader } from "./components/PageLoader";
import { PageTransition } from "./components/PageTransition";
import StartupCompanion from "@/components/StartupCompanion";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const WriterDashboard = lazy(() => import("./pages/WriterDashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const AuthorProfile = lazy(() => import("./pages/AuthorProfile"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const ReadingLists = lazy(() => import("./pages/ReadingLists"));
const AdsManagement = lazy(() => import("./pages/AdsManagement"));
const FollowingManagement = lazy(() => import("./pages/FollowingManagement"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const SeriesDetail = lazy(() => import("./pages/SeriesDetail"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const CreatorDashboard = lazy(() => import("./pages/CreatorDashboard"));
const CreatorProgram = lazy(() => import("./pages/CreatorProgram"));
const CreatorCheckout = lazy(() => import("./pages/CreatorCheckout"));
const SubscriptionManagement = lazy(() => import("./pages/SubscriptionManagement"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Careers = lazy(() => import("./pages/Careers"));
const Advertise = lazy(() => import("./pages/Advertise"));
const Contact = lazy(() => import("./pages/Contact"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const SocialImpact = lazy(() => import("./pages/SocialImpact"));
const Grants = lazy(() => import("./pages/Grants"));
const GrantDetail = lazy(() => import("./pages/GrantDetail"));
const Events = lazy(() => import("./pages/Events"));
const CreateGrant = lazy(() => import("./pages/CreateGrant"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Helper Component to animate routes
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/write" element={<PageTransition><WriterDashboard /></PageTransition>} />
        <Route path="/write/:id" element={<PageTransition><WriterDashboard /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/author/:id" element={<PageTransition><AuthorProfile /></PageTransition>} />
        <Route path="/article/:slug" element={<PageTransition><ArticleDetail /></PageTransition>} />
        <Route path="/reading-lists" element={<PageTransition><ReadingLists /></PageTransition>} />
        <Route path="/following" element={<PageTransition><FollowingManagement /></PageTransition>} />
        <Route path="/creator-dashboard" element={<PageTransition><CreatorDashboard /></PageTransition>} />
        <Route path="/creator-program" element={<PageTransition><CreatorProgram /></PageTransition>} />
        <Route path="/creator-program/checkout" element={<PageTransition><CreatorCheckout /></PageTransition>} />
        <Route path="/subscription" element={<PageTransition><SubscriptionManagement /></PageTransition>} />
        <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
        <Route path="/series/:id" element={<PageTransition><SeriesDetail /></PageTransition>} />
        
        {/* Static Pages */}
        <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
        <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
        <Route path="/advertise" element={<PageTransition><Advertise /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/help-center" element={<PageTransition><HelpCenter /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/cookies" element={<PageTransition><CookiePolicy /></PageTransition>} />
        <Route path="/social-impact" element={<PageTransition><SocialImpact /></PageTransition>} />
        <Route path="/grants" element={<PageTransition><Grants /></PageTransition>} />
        <Route path="/grants/:id" element={<PageTransition><GrantDetail /></PageTransition>} />
        <Route path="/create-grant" element={<PageTransition><CreateGrant /></PageTransition>} />
        <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
        <Route path="/create-event" element={<PageTransition><CreateEvent /></PageTransition>} />
        
        <Route path="/ads" element={<PageTransition><AdsManagement /></PageTransition>} />
        
        {/* Admin Routes */}
        <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="app-theme">
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <AnimatedRoutes />
              <StartupCompanion />
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
