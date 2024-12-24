import { Route, Routes } from "react-router-dom"
import Layout from "./Layout/Layout"
import Home from "./pages/Home"

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route index element={<Home />} />
        {/* <Route path='/login' element={<Login />} />
        <Route path='/ngo-signup' element={<NgoSignup />} />
        <Route path='/restaurant-signup' element={<RestaurantSignup />} /> */}
      </Route>
    </Routes>
  )
}

export default App
