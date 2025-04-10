import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Logo rasmi
import profile from "../assets/profile.jpg"; // Profil rasmi (agar foydalanuvchi rasmi bo‘lmasa)

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Directus API token
    const API_TOKEN = "RxwHPPmY2lOJhRBhm2Ex1eMfMQHc5Dgy";
    const API_URL = "http://192.168.96.89:8055/items/xodimlar";

    useEffect(() => {
        // LocalStorage'dan foydalanuvchini olish
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            fetchUserData(storedUser.id); // Foydalanuvchi ma'lumotlarini API'dan olish
        }
    }, []);

    // API'dan foydalanuvchi ma'lumotlarini olish
    const fetchUserData = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                },
            });
            const data = await response.json();
            setUser(data.data); // API'dan kelgan ma'lumotni saqlash
            localStorage.setItem("user", JSON.stringify(data.data)); // LocalStorage'ga yangilash
        } catch (error) {
            console.error("Foydalanuvchi ma'lumotlarini olishda xatolik:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-white shadow-lg p-4">
            <div className="flex justify-between items-center">
                {/* Logo va nom */}
                <div className="flex items-center">
                    <img src={logo} alt="logo" className="h-10 mr-2" />
                    <div className="text-gray-700 text-3xl font-bold">SGCC KPI</div>
                </div>

                {/* Menular - foydalanuvchi roliga qarab shartli ko‘rinadi */}
                {user && (
                    <div className="hidden md:block ">
                        <ul className="flex space-x-12">
                            {/* Har bir foydalanuvchi uchun Dashboard ochiq */}
                            {/* <li>
                                <a href="/dashboard" className="text-gray-800 font-bold text-xl hover:text-gray-400">
                                    KPI karta ma'lumotlari
                                </a>
                            </li> */}
                            {user.role === "xodim" && (
                                <li>
                                    <a href="/dashboard" className="text-gray-800 font-bold text-xl hover:text-gray-400">
                                    KPI karta ma'lumotlari
                                    </a>
                                </li>
                            )}
                            {/* Agar role "admin" bo‘lsa, Hisobotlar ko‘rinadi */}
                            {user.role === "admin" && (
                                <li>
                                    <a href="/reports" className="text-gray-800 font-bold text-xl hover:text-gray-400">
                                        Hisobotlar
                                    </a>
                                </li>
                            )}
                            {/* Agar role "admin" bo‘lsa, Hisobotlar ko‘rinadi */}
                            {user.role === "admin" && (
                                <li>
                                    <a href="/visual-report" className="text-gray-800 font-bold text-xl hover:text-gray-400">
                                        Visual ma'lumot
                                    </a>
                                </li>
                            )}
                            {/* Har bir foydalanuvchi uchun Sozlamalar ochiq */}
                            {/* <li>
                                <a href="/settings" className="text-gray-800 font-bold text-xl hover:text-gray-400">
                                    Sahifa parametrlari
                                </a>
                            </li> */}
                            {user.role === "xodim" && (
                                <li>
                                    <a href="/settings" className="text-gray-800 font-bold text-xl hover:text-gray-400">
                                    Sahifa parametrlari
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Profil rasmi va ism */}
                {user ? (
                    <div className="flex items-center space-x-3">
                        <img
                            src={profile} // Profil rasmi (API'dan kelgan rasm bo‘lsa, o‘zgartirish mumkin)
                            alt="User Profile"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="text-gray-800 font-bold text-xl">{user.xodim || "Xodim"}</div>
                    </div>
                ) : (
                    <a href="/login" className="text-white hover:text-gray-400">Kirish</a>
                )}
            </div>

            {/* Mobil menyuni ochish/yopish (agar kerak bo‘lsa) */}
            {user && (
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white">
                        {isOpen ? "Yopish" : "Menyu"}
                    </button>
                    {isOpen && (
                        <ul className="mt-2 space-y-2">
                            <li>
                                <a href="/dashboard" className="text-white hover:text-gray-400">
                                    Dashboard
                                </a>
                            </li>
                            {user.role === "admin" && (
                                <li>
                                    <a href="/reports" className="text-white hover:text-gray-400">
                                        Hisobotlar
                                    </a>
                                </li>
                            )}
                            {user.role === "admin" && (
                                <li>
                                    <a href="/visual-reports" className="text-white hover:text-gray-400">
                                        Visual ma'lumot
                                    </a>
                                </li>
                            )}
                            <li>
                                <a href="/settings" className="text-white hover:text-gray-400">
                                    Sozlamalar
                                </a>
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;