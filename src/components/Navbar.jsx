import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import logo from "../assets/logo.png"; // Logo rasmi
import profile from "../assets/profile.jpg"; // Profil rasmi (agar foydalanuvchi rasmi bo‘lmasa)

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Directus API token
    const API_TOKEN = "XfN0oSyqlI-TlVKMDNDUvOKIBCrBUV3L";
    const API_URL = "http://localhost:8055/items/xodimlar";

    useEffect(() => {
        // LocalStorage'dan foydalanuvchini olish
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="flex justify-between items-center">
                {/* Logo va nom */}
                <div className="flex items-center">
                    <img src={logo} alt="logo" className="h-10 mr-2" />
                    <div className="text-white text-3xl font-bold">SGCC KPI</div>
                </div>

                {/* Menular - faqat xodim login qilganida ko‘rinadi */}
                {user && (
                    <div className="hidden md:block">
                        <ul className="flex space-x-4">
                            <li><a href="/dashboard" className="text-white hover:text-gray-400">Dashboard</a></li>
                            <li><a href="/reports" className="text-white hover:text-gray-400">Hisobotlar</a></li>
                            <li><a href="/analytics" className="text-white hover:text-gray-400">Tahlillar</a></li>
                            <li><a href="/settings" className="text-white hover:text-gray-400">Sozlamalar</a></li>
                            <li><a href="/qrcode" className="text-white hover:text-gray-400">Qr code</a></li>
                        </ul>
                    </div>
                )}

                {/* Profil rasmi va ism */}
                {user ? (
                    <div className="flex items-center space-x-3">
                        <img
                            src={profile} // Profil rasmi (agar xodimning rasmi bo‘lsa, o‘rniga qo‘yish mumkin)
                            alt="User Profile"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="text-white">{user.xodim[0]}</div>
                    </div>
                ) : (
                    <a href="/login" className="text-white hover:text-gray-400">Kirish</a>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
