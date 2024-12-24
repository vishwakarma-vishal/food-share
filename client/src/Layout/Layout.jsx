import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

const Layout = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <main className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout;