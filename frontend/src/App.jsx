import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";

import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import CafePage from "./pages/student/CafePage";
import Cart from "./pages/student/Cart";
import Checkout from "./pages/student/Checkout";
import OrderSuccess from "./pages/student/OrderSuccess";
import MyOrders from "./pages/student/MyOrders";
import OrderTracking from "./pages/student/OrderTracking";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";

function ProtectedRoute({ role, children }) {
  const user = JSON.parse(
    localStorage.getItem("campusEatsUser")
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return (
      <Navigate
        to={`/${user.role}`}
        replace
      />
    );
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <BrowserRouter>
          <Routes>

            <Route
              path="/"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />

            <Route
              path="/login"
              element={<Login />}
            />

            {/* STUDENT */}

            <Route
              path="/student"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/cafe/:cafeId"
              element={
                <ProtectedRoute role="student">
                  <CafePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/cart"
              element={
                <ProtectedRoute role="student">
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/checkout"
              element={
                <ProtectedRoute role="student">
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/order-success"
              element={
                <ProtectedRoute role="student">
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/orders"
              element={
                <ProtectedRoute role="student">
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/orders/:orderId"
              element={
                <ProtectedRoute role="student">
                  <OrderTracking />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute role="student">
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/profile"
              element={
                <ProtectedRoute role="student">
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* CANTEEN */}

            <Route
              path="/canteen/*"
              element={
                <ProtectedRoute role="canteen">
                  <CanteenPlaceholder />
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role="admin">
                  <AdminPlaceholder />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />

          </Routes>
        </BrowserRouter>
      </OrderProvider>
    </AuthProvider>
  );
}

function CanteenPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          Canteen Dashboard
        </h1>

        <p className="mt-3 text-gray-500">
          We'll build this next.
        </p>
      </div>
    </div>
  );
}

function AdminPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-3 text-gray-500">
          We'll build this after the canteen dashboard.
        </p>
      </div>
    </div>
  );
}

export default App;