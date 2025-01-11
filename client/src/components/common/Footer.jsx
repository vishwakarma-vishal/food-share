import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();

    return (
        <footer className='flex flex-col items-center gap-4 border pt-4 bg-white'>
            <div>
                <ul className='flex flex-wrap justify-center gap-x-4 gap-y-2'>
                    <li><a href='/about'>About us</a></li>
                    <li><a href='contact'>Contact us</a></li>
                    <li><a href='/terms'>Terms of service</a></li>
                    <li><a href='/privacy'>Privacy policy</a></li>
                </ul>
            </div>

            <div className="flex gap-4 mb-4">
                <a href="#" aria-label="Facebook">
                    <FaFacebookF size={24} />
                </a>
                <a href="#" aria-label="Twitter">
                    <FaTwitter size={24} />
                </a>
                <a href="#" aria-label="Instagram">
                    <FaInstagram size={24} />
                </a>
                <a href="#" aria-label="LinkedIn">
                    <FaLinkedinIn size={24} />
                </a>
            </div>

            <p className="text-[#9a6e4c] text-sm font-normal leading-normal pb-2">@{currentYear} FoodShare</p>
        </footer>
    )
}

export default Footer;