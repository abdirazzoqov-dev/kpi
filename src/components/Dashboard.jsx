import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode"; // QR kod kutubxonasini import qilish

const Dashboard = () => {
  const [user, setUser ] = useState(null);
  const [kpiData, setKpiData] = useState([]);
  const navigate = useNavigate();
  const pdfRef = useRef();
  const qrCodeCanvasRef = useRef(); // QR kod uchun canvas ref

  const API_TOKEN = "XfN0oSyqlI-TlVKMDNDUvOKIBCrBUV3L";
  const API_URL = "http://localhost:8055/items/kpi_cards";

  useEffect(() => {
    const storedUser  = JSON.parse(localStorage.getItem("user"));
    if (!storedUser ) {
      navigate("/login");
      return;
    }
    setUser (storedUser );

    fetch(`${API_URL}?filter[xodim_id][_eq]=${storedUser .id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setKpiData(data.data || []))
      .catch((error) => console.error("KPI yuklashda xato:", error));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const generateQRCode = async () => {
    if (user) {
      const canvas = qrCodeCanvasRef.current;
      const qrCodeDataUrl = await QRCode.toDataURL(window.location.href, { // Sahifaning URL manzilini olish
        width: 128,
        margin: 1,
      });
      const img = new Image();
      img.src = qrCodeDataUrl;
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const exportToPDF = () => {
    const input = pdfRef.current;
    const qrCodeCanvas = qrCodeCanvasRef.current;

    // QR kod canvasini olish
    const qrCodePromise = html2canvas(qrCodeCanvas, { scale: 2 }).then((canvas) => {
      return canvas.toDataURL("image/png");
    });

    // Asosiy kontentni olish
    const pdfContentPromise = html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Asosiy kontent rasmni qo'shish
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // QR kod rasmni qo'shish
      return qrCodePromise.then((qrCodeImgData) => {
        pdf.addImage(qrCodeImgData, "PNG", 10, imgHeight + 10, 50, 50); // Pozitsiya va o'lchamni moslashtirish
        pdf.save("KPI_Report.pdf");
      });
    });

    // Ikkita va'dani bajarish
    Promise.all([qrCodePromise, pdfContentPromise]).then(() => {
      console.log("PDF muvaffaqiyatli yaratildi!");
    });
  };

  useEffect(() => {
    generateQRCode(); // Foydalanuvchi ma'lumotlari mavjud bo'lganda QR kodni yaratish
  }, [user]);

  return (
    <div className="p-6">
      {user ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{user.xodim[0] || "Bo'sh"}</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
            >
              <MdLogout />
            </button>
          </div>

          <br />
          <button
            onClick={exportToPDF}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600 transition-all"
          >
            PDF'ga yuklab olish
          </button>

          <div ref={pdfRef} className="bg-white p-4 shadow-lg">
            {/* QR kod uchun kvadrat canvas */}
            <canvas ref={qrCodeCanvasRef} width={128} height={128} className="absolute top-25 right-12 mb-4" />

            <table className="min-w-[30%] border-collapse border border-black mb-4">
              <tbody className="text-[.6rem]">
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">Tarkibiy bo‘linman nomi</td>
                  <td className="border border-black px-2 py-1">{user.tarkibiy_bolinma_nomi || "Bo'sh"}</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">Xodimning lavozimi</td>
                  <td className="border border-black px-2 py-1">{user.xodim_lavozimi[0] || "Bo'sh"}</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">Xodim F.I.SH.</td>
                  <td className="border border-black px-2 py-1">{user.xodim[0] || "Bo'sh"}</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">Funksional rahbar F.I.SH.</td>
                  <td className="border border-black px-2 py-1">{user.funksional_raxbar[0] || "Bo'sh"}</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">Ma’muriy rahbar F.I.SH.</td>
                  <td className="border border-black px-2 py-1">{user.mamuriy_raxbar[0] || "Bo'sh"}</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">Baxolash davri</td>
                  <td className="border border-black px-2 py-1">{user.baholash_davri[0] || "Bo'sh"}</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">1-Bosqich.Xodim imzosi</td>
                  <td className="border border-black px-2 py-1">{user.birinchi_bosqich_imzo ? user.birinchi_bosqich_imzo.replace("T", " ") : "Bo'sh"}</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-bold">2-Bosqich.Xodim imzosi</td>
                  <td className="border border-black px-2 py-1">{user.ikkinchi_bosqich_imzo ? user.ikkinchi_bosqich_imzo.replace("T", " ") : "Bo'sh"}</td>
                </tr>
              </tbody>
            </table>

            <div>
              {kpiData.length > 0 ? (
                <table className="w-full border border-black text-xs border-collapse">
                  <thead className="bg-gray-100 h-12">
                    <tr>
                      <th className="border border-black px-1 py-1" rowSpan={2}>T/R</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>Мaqsad</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>KPI nomi</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>Xisoblash metodikasi</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>Ma'lumotlar manbai</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>O'lchov birligi</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>Reja</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>Maqsadning haqiqiy miqdori</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>Salmog'i kutilayotgan</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>Salmog'i real</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>Izoh</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>Baholovchi</th>
                      <th className="border border-black px-1 py-1" rowSpan={2}>Baholovchi F.I.O</th>
                      <th className="border border-black px-1 py-1" colSpan={2}>Tasdiqlanganlik statusi</th>
                    </tr>
                    <tr>
                      <th className="border border-black px-1 py-1">1-bosqich reja bo'yicha</th>
                      <th className="border border-black px-1 py-1">2-bosqich salmoq bo'yicha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpiData.map((kpi, index) => (
                      <tr key={kpi.id} className="h-12 text-[.6rem]">
                        <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.maqsad || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.kpi_nomi || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.xisoblash_metodikasi || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.malumotlar_manbai || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.olchov_birlik || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.reja || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.maqsadning_haqiqiy_miqdori || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.salmoq_kutilayotgan || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.salmoq_real || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.izoh || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.baholovchi_sex[0] || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.baholovchi_xodim[0] || "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.birinchi_bosqich_sana ? kpi.birinchi_bosqich_sana.replace("T", " ") : "Bo'sh"}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.ikkinchi_bosqich_sana ? kpi.ikkinchi_bosqich_sana.replace("T", " ") : "Bo'sh"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">KPI kartalari topilmadi.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">Ma'lumot yuklanmoqda...</p>
      )}
    </div>
  );
};

export default Dashboard;