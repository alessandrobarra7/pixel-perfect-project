import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import StudiesPage from "@/pages/StudiesPage";
import StudyDetailPage from "@/pages/StudyDetailPage";
import ViewerPage from "@/pages/ViewerPage";
import ReportEditorPage from "@/pages/ReportEditorPage";
import UsersAdminPage from "@/pages/admin/UsersAdminPage";
import UnitsAdminPage from "@/pages/admin/UnitsAdminPage";
import TemplatesAdminPage from "@/pages/admin/TemplatesAdminPage";
import AuditAdminPage from "@/pages/admin/AuditAdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/studies" element={<StudiesPage />} />
              <Route path="/studies/:id" element={<StudyDetailPage />} />
              <Route path="/viewer/:studyId" element={<ViewerPage />} />
              <Route path="/reports/:studyId" element={<ReportEditorPage />} />
              <Route path="/admin/users" element={<UsersAdminPage />} />
              <Route path="/admin/units" element={<UnitsAdminPage />} />
              <Route path="/admin/templates" element={<TemplatesAdminPage />} />
              <Route path="/admin/audit" element={<AuditAdminPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
