import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NgoDashboard from "./pages/NgoDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";

import ProtecedRoute from "./utils/ProtectedRoute";
import useAuthInitialization from "./utils/useAuthInitialization";
import Signup from "./pages/Signup";

function App() {
  useAuthInitialization();

  return (
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route index element={<Home />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
        <Route path='ngo-dashboard' element={<ProtecedRoute element={<NgoDashboard />} requiredRole="ngo" />} />
        <Route path='restaurant-dashboard' element={<ProtecedRoute element={<RestaurantDashboard />} requiredRole="restaurant" />} />
      </Route>
    </Routes>
  )
}

export default App;
