import { createBrowserRouter, Navigate, RouterProvider, ScrollRestoration } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Layout from "./layout/Layout";
import LayoutProfile from "./layout/ProfileLayout";
import LayoutAdmin from "./layout/LayoutAdmin";
import HomePage from "./pages/HomePage"
import MoviesPage from "./pages/MoviesPage";
import MovieDetailPage from "./pages/transactions/MovieDetailPage";
import PaymentPage from "./pages/transactions/PaymentPage";
import TicketResultPage from "./pages/transactions/TicketResultPage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import OrderHistoryPage from "./pages/profile/OrderHistoryPage";
import DashboardAdminPage from "./pages/admin/DashboardAdminPage";
import MoviesAdminPage from "./pages/admin/MoviesAdminPage";
import AddMoviePage from "./pages/admin/AddMoviePage";
import EditMoviePage from "./pages/admin/EditMoviePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OrderPage from "./pages/transactions/OrderPage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

const PrivateRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.auth.token);
  return currentUser ? children : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage/> ,
      },
      {
        path: "/movies",
        element: <MoviesPage />,
      },
      {
        path: "/movieDetail/:id",
        element: <MovieDetailPage />,
      },
      {
        path: "/order/:id",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment/:id",
        element: (
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/ticket/:queryId",
        element: (
          <PrivateRoute>
            <TicketResultPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "",
    element: <LayoutProfile />,
    children: [
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <EditProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/order-history",
        element: (
          <PrivateRoute>
            <OrderHistoryPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "",
    element: <LayoutAdmin />,
    children: [
      {
        path: "/dashboard-admin",
        element: <DashboardAdminPage />,
      },
      {
        path: "/movies-admin",
        element: <MoviesAdminPage />,
      },
      {
        path: "/add-movie",
        element: <AddMoviePage />,
      },
      {
        path: "/edit-movie/:id",
        element: <EditMoviePage />
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/*",
    element: <NotFoundPage />,
  },
]);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
};

export default App;
