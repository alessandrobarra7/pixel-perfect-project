import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import StudiesPage from "@/pages/StudiesPage";
import ReportEditorPage from "@/pages/ReportEditorPage";
import ViewerPage from "@/pages/ViewerPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import UnitsAdminPage from "@/pages/admin/UnitsAdminPage";
import UsersAdminPage from "@/pages/admin/UsersAdminPage";
import PermissionsAdminPage from "@/pages/admin/PermissionsAdminPage";
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
            <Route path="/" element={<Navigate to="/studies" replace />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/studies" element={<StudiesPage />} />
              <Route path="/reports/:studyId" element={<ProtectedRoute allowedRoles={['medico', 'admin_master']}><ReportEditorPage /></ProtectedRoute>} />
              <Route path="/viewer/:studyId" element={<ViewerPage />} />

              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin_master', 'unit_admin']}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/units" replace />} />
                <Route path="units" element={<UnitsAdminPage />} />
                <Route path="users" element={<UsersAdminPage />} />
                <Route path="permissions" element={<PermissionsAdminPage />} />
                <Route path="audit" element={<AuditAdminPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
