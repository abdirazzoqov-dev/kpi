import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo2 from "../assets/logo2.png";

const Login = ({ setUser }) => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const API_TOKEN = "Eo4nk4PK0NnvFqG1HWUtGDM-WK6r0jci";
    const API_URL = "http://localhost:8055/items/xodimlar";

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log("✅ Login so‘rovi yuborilmoqda...");

            const response = await fetch(`${API_URL}?filter[login][_eq]=${encodeURIComponent(login)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_TOKEN}`,
                },
            });

            if (!response.ok) {
                setError("❌ Serverdan javob olishda xatolik!");
                return;
            }

            const data = await response.json();
            console.log("🔍 API javobi:", data);

            if (!data.data || data.data.length === 0) {
                setError("⚠️ Login noto‘g‘ri!");
                return;
            }

            const user = data.data[0];

            if (password !== user.plain_password) {
                setError("⚠️ Parol noto‘g‘ri!");
                return;
            }

            console.log("✅ Login muvaffaqiyatli!");
            toast.success("✅ Siz muvaffaqiyatli kirdingiz!");

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (error) {
            console.error("❌ Login xatosi:", error);
            setError("❌ Server bilan bog‘lanishda muammo!");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <ToastContainer />
            <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
                <div className="mb-6 text-center">
                    <img src={logo2} alt="Company Logo" className="w-24 h-auto mx-auto" />
                    <br />
                    <h2 className="text-md font-bold text-gray-300">Shurtan gaz kimyo majmuasi KPI dastur</h2>
                </div>

                {error && <p className="text-red-500 text-center mb-3">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Email (login)"
                        className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Parol"
                        className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-3 w-full rounded-md hover:bg-blue-600 transition-all"
                    >
                        Kirish
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
