import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const Layout = () => {
    return (
        <div className="w-full bg-gray-100 min-h-screen flex flex-col justify-between">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout;