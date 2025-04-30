import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { BudgetProvider } from "./context/BudgetContext";
import AuthGuard from "./components/AuthGuard";

import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import History from "./pages/History";
import Goals from "./pages/Goals";
import Visualize from "./pages/Visualize";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster position="top-right" richColors closeButton />
    <BrowserRouter>
      <AuthProvider>
        <BudgetProvider>
          <Routes>
            {/* Public routes (redirect to dashboard if authenticated) */}
            <Route element={<AuthGuard requireAuth={false} />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
            </Route>

            {/* Protected routes (redirect to login if not authenticated) */}
            <Route element={<AuthGuard requireAuth={true} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-expense" element={<AddExpense />} />
              <Route path="/history" element={<History />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/visualize" element={<Visualize />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BudgetProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
