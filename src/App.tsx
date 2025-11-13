import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import WriterDashboard from "./pages/WriterDashboard";
import Profile from "./pages/Profile";
import ArticleDetail from "./pages/ArticleDetail";
import ReadingLists from "./pages/ReadingLists";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/article/:slug" element={<ArticleDetail />} />
          <Route path="/reading-lists" element={<ReadingLists />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
