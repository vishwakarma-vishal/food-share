import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home";
import RestaurantSignup from "./pages/RestaurantSignup";
import NgoSignup from "./pages/NgoSignup";
import Login from "./pages/Login";
import NgoDashboard from "./pages/NgoDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route index element={<Home />} />
        <Route path='restaurant-signup' element={<RestaurantSignup />} />
        <Route path='ngo-signup' element={<NgoSignup />} />
        <Route path='login' element={<Login />} />
        <Route path='ngo-dashboard' element={<NgoDashboard />} />
        <Route path='restaurant-dashboard' element={<RestaurantDashboard />} />
      </Route>
    </Routes>
  )
}

export default App;
