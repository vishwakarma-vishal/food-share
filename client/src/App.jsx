import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home";
import RestaurantSignup from "./pages/RestaurantSignup";
import NgoSignup from "./pages/NgoSignup";
import Login from "./pages/Login";
import NgoDashboard from "./pages/NgoDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";

import ProtecedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route index element={<Home />} />
        <Route path='restaurant-signup' element={<RestaurantSignup />} />
        <Route path='ngo-signup' element={<NgoSignup />} />
        <Route path='login' element={<Login />} />

        <Route path='ngo-dashboard' element={<ProtecedRoute element={<NgoDashboard />} requiredRole ="ngo" />} />
        <Route path='restaurant-dashboard' element={<ProtecedRoute element={<RestaurantDashboard />} requiredRole="restaurant" />} />
      </Route>
    </Routes>
  )
}

export default App;
