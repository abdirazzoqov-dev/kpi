import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserSettings = ({ user }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const currentUserLogin = user ? user.login : null;

  const API_URL = 'http://192.168.96.89:8055/items/xodimlar';
  const TOKEN = 'RxwHPPmY2lOJhRBhm2Ex1eMfMQHc5Dgy';

  useEffect(() => {
    if (currentUserLogin) {
      fetchEmployee();
    } else {
      setLoading(false);
      setError("Foydalanuvchi ma'lumotlari topilmadi. Iltimos, tizimga kiring.");
    }
  }, [currentUserLogin]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      });
      const userData = response.data.data.find(emp => emp.login === currentUserLogin);
      if (userData) {
        setEmployee(userData);
        setEditedData(userData);
      } else {
        setError("Foydalanuvchi ma'lumotlari topilmadi");
      }
      setLoading(false);
    } catch (err) {
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: field === 'xodim' || field === 'xodim_lavozimi' || field === 'funksional_raxbar' || field === 'mamuriy_raxbar'
        ? [value]
        : value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `${API_URL}/${employee.id}`,
        editedData,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );
      setEmployee(editedData);
      // Agar login o'zgartirilgan bo'lsa, localStorage ni yangilash
      if (editedData.login !== currentUserLogin) {
        const updatedUser = { ...user, login: editedData.login };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setEditing(false);
      toast.success('Ma\'lumotlar tahrirlandi!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError('Ma\'lumotlarni saqlashda xatolik yuz berdi');
      toast.error('Xatolik yuz berdi!', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>{error}</div>;
  if (!employee) return <div>Ma'lumotlar topilmadi</div>;

  return (
    <div className="container mx-auto p-4">
      <br />
      <h1 className="text-2xl font-bold mb-4 text-cyan-800">
        Sahifa parametrlari / <span>{Array.isArray(editedData.xodim) ? editedData.xodim[0] : editedData.xodim}</span>
      </h1>
      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <div className='border p-2'>
            <label className="block font-medium">Login</label>
            {editing ? (
              <input
                type="text"
                value={editedData.login}
                onChange={(e) => handleChange('login', e.target.value)}
                className="w-full border p-2 rounded"
              />
            ) : (
              <div className="p-2">{employee.login}</div>
            )}
          </div>

          <div className='border p-2'>
            <label className="block font-medium">Ism</label>
            {editing ? (
              <input
                type="text"
                value={Array.isArray(editedData.xodim) ? editedData.xodim[0] : editedData.xodim}
                onChange={(e) => handleChange('xodim', e.target.value)}
                className="w-full border p-2 rounded"
              />
            ) : (
              <div className="p-2">{Array.isArray(employee.xodim) ? employee.xodim[0] : employee.xodim}</div>
            )}
          </div>

          <div className='border p-2'>
            <label className="block font-medium">Lavozim</label>
            {editing ? (
              <input
                type="text"
                value={Array.isArray(editedData.xodim_lavozimi) ? editedData.xodim_lavozimi[0] : editedData.xodim_lavozimi}
                onChange={(e) => handleChange('xodim_lavozimi', e.target.value)}
                className="w-full border p-2 rounded"
              />
            ) : (
              <div className="p-2">{Array.isArray(employee.xodim_lavozimi) ? employee.xodim_lavozimi[0] : employee.xodim_lavozimi}</div>
            )}
          </div>

          <div className='border p-2'>
            <label className="block font-medium">Parol</label>
            {editing ? (
              <input
                type="password"
                value={editedData.plain_password}
                onChange={(e) => handleChange('plain_password', e.target.value)}
                className="w-full border p-2 rounded"
              />
            ) : (
              <div className="p-2">********</div>
            )}
          </div>

          <div className='border p-2'>
            <label className="block font-medium">Funksional rahbar</label>
            {editing ? (
              <input
                type="text"
                value={Array.isArray(editedData.funksional_raxbar) ? editedData.funksional_raxbar[0] : editedData.funksional_raxbar}
                onChange={(e) => handleChange('funksional_raxbar', e.target.value)}
                className="w-full border p-2 rounded"
              />
            ) : (
              <div className="p-2">{Array.isArray(employee.funksional_raxbar) ? employee.funksional_raxbar[0] : employee.funksional_raxbar}</div>
            )}
          </div>

          <div className='border p-2'>
            <label className="block font-medium">Ma'muriy rahbar</label>
            {editing ? (
              <input
                type="text"
                value={Array.isArray(editedData.mamuriy_raxbar) ? editedData.mamuriy_raxbar[0] : editedData.mamuriy_raxbar}
                onChange={(e) => handleChange('mamuriy_raxbar', e.target.value)}
                className="w-full border p-2 rounded"
              />
            ) : (
              <div className="p-2">{Array.isArray(employee.mamuriy_raxbar) ? employee.mamuriy_raxbar[0] : employee.mamuriy_raxbar}</div>
            )}
          </div>

          <div>
            {editing ? (
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Saqlash
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Tahrirlash
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserSettings;