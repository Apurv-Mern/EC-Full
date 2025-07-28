import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Industries from "./pages/admin/Industries";
import SoftwareTypes from "./pages/admin/SoftwareTypes";
import TechStacks from "./pages/admin/TechStacks";
import Timeline from "./pages/admin/Timeline";
import Features from "./pages/admin/Features";
import Currency from "./pages/admin/Currency";
import CostFormula from "./pages/admin/CostFormula";
import Content from "./pages/admin/Content";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="industries" element={<Industries />} />
            <Route path="software-types" element={<SoftwareTypes />} />
            <Route path="tech-stacks" element={<TechStacks />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="features" element={<Features />} />
            <Route path="currency" element={<Currency />} />
            <Route path="cost-formula" element={<CostFormula />} />
            <Route path="content" element={<Content />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
