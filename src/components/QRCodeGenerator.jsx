import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // ✅ To'g'ri import

const QRCodeGenerator = () => {
  const [employee, setEmployee] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
  });
  const [generateQRCode, setGenerateQRCode] = useState(false);
  const qrRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGenerateQRCode(true);
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${employee.name}_QRCode.png`;
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px', fontFamily: 'Arial' }}>
      <h2>Xodim Ma'lumotlarini Kiriting</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Ism"
          value={employee.name}
          onChange={handleChange}
          required
          style={{ padding: '8px', width: '250px' }}
        />
        <input
          type="text"
          name="position"
          placeholder="Lavozim"
          value={employee.position}
          onChange={handleChange}
          required
          style={{ padding: '8px', width: '250px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={employee.email}
          onChange={handleChange}
          required
          style={{ padding: '8px', width: '250px' }}
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon raqami"
          value={employee.phone}
          onChange={handleChange}
          required
          pattern="^[0-9+]+$"
          title="Faqat raqam va '+' belgilarini kiriting"
          style={{ padding: '8px', width: '250px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          QR Kodni Generatsiya Qilish
        </button>
      </form>

      {generateQRCode && (
        <div style={{ marginTop: '20px' }}>
          <h3>{employee.name} uchun QR Kod</h3>
          <QRCodeCanvas
            ref={qrRef}
            id="qr-code"
            value={`Ism: ${employee.name}\nLavozim: ${employee.position}\nEmail: ${employee.email}\nTelefon: ${employee.phone}`}
            size={256}
          />
          <br />
          <button
            onClick={downloadQRCode}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            QR Kodni Yuklab Olish
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
