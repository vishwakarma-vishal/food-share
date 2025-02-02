import { FaInstagram } from 'react-icons/fa';
import { RiTwitterXLine } from "react-icons/ri";
import { FiYoutube } from "react-icons/fi";
import { RiFacebookCircleLine } from "react-icons/ri";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='flex flex-col items-center gap-4 border pt-4 bg-white px-4 md:px-8 lg:px-10'>

            <div className="flex flex-wrap justify-center gap-x-4 lg:gap-x-6 gap-y-2 text-sm sm:text-base text-gray-800">
                <a className="cursor-pointer hover:text-black transition-all duration-200" href="#">About Us</a>
                <a className="cursor-pointer hover:text-black transition-all duration-200" href="#">Contact Us</a>
                <a className="cursor-pointer hover:text-black transition-all duration-200" href="#">Terms of Service</a>
                <a className="cursor-pointer hover:text-black transition-all duration-200" href="#">Privacy policy</a>
            </div>


            <div className="flex gap-4 mb-4 text-gray-800 text-xl sm:text-2xl">
                <a href="#" aria-label="Facebook" className="hover:text-black">
                    <RiFacebookCircleLine />
                </a>
                <a href="#" aria-label="Twitter" className="hover:text-black">
                    <RiTwitterXLine />
                </a>
                <a href="#" aria-label="Instagram" className="hover:text-black">
                    <FaInstagram />
                </a>
                <a href="#" aria-label="Youtube" className="hover:text-black">
                    <FiYoutube />
                </a>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm font-normal leading-normal pb-2">@{currentYear} FoodShare</p>
        </footer>
    )
}

export default Footer;