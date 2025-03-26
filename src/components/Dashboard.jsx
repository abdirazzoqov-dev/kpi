import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { LiaCheckCircle } from "react-icons/lia";
import { TiFolderOpen } from "react-icons/ti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [kpiData, setKpiData] = useState([]);
  const [filteredKpiData, setFilteredKpiData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const pdfRef = useRef();

  const API_TOKEN = "Eo4nk4PK0NnvFqG1HWUtGDM-WK6r0jci";
  const API_URL = "http://localhost:8055/items/kpi_cards";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);

    fetch(`${API_URL}?filter[xodim_id][_eq]=${storedUser.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setKpiData(data.data || []);
      })
      .catch((error) => console.error("KPI yuklashda xato:", error));
  }, [navigate]);

  useEffect(() => {
    const today = new Date();
    const filteredData = kpiData.filter(kpi => {
      const firstStageDate = new Date(kpi.birinchi_bosqich_sana);
      const secondStageDate = new Date(kpi.ikkinchi_bosqich_sana);
      return (
        (firstStageDate.getFullYear() === selectedYear && firstStageDate.getMonth() + 1 === selectedMonth) ||
        (secondStageDate.getFullYear() === selectedYear && secondStageDate.getMonth() + 1 === selectedMonth)
      );
    });
    setFilteredKpiData(filteredData);
  }, [kpiData, selectedMonth, selectedYear]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const exportToPDF = () => {
    const input = pdfRef.current;

    const originalBoxShadow = input.style.boxShadow;
    const originalBorder = input.style.border;
    input.style.boxShadow = 'none';
    input.style.border = 'none';

    const pdfContentPromise = html2canvas(input, { scale: 1.2, backgroundColor: null }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("KPI_Report.pdf");

      input.style.boxShadow = originalBoxShadow;
      input.style.border = originalBorder;
    });

    pdfContentPromise.then(() => {
      console.log("PDF muvaffaqiyatli yaratildi!");
    });
  };

  const downloadFile = (fileId) => {
    const url = `http://localhost:8055/assets/${fileId}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'malumotnoma');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

          <div className="flex items-center justify-between">
            <button
              onClick={exportToPDF}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600 transition-all"
            >
              PDF'ga yuklab olish
            </button>

            <div className="flex items-center mb-4">
              <label className="mr-2 font-semibold">Oy:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                {[...Array(12).keys()].map(month => (
                  <option key={month} value={month + 1}>
                    {month + 1}
                  </option>
                ))}
              </select>

              <label className="ml-4 mr-2 font-semibold">Yil:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                {[2020, 2021, 2022, 2023, 2024, 2025].map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div ref={pdfRef} className="bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <table className="min-w-[33%] border-collapse border border-black mb-4">
                <tbody className="text-[.8rem]">
                  <tr>
                    <td className="border border-black px-2 py-2 font-bold">Tarkibiy bo‘linma nomi</td>
                    <td className="border border-black px-2 py-2">{user.tarkibiy_bolinma_nomi || ""}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-2 font-bold">Xodimning lavozimi</td>
                    <td className="border border-black px-2 py-2">{user.xodim_lavozimi[0] || ""}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-2 font-bold">Xodim F.I.SH.</td>
                    <td className="border border-black px-2 py-2">{user.xodim[0] || ""}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-2 font-bold">Funksional rahbar F.I.SH.</td>
                    <td className="border border-black px-2 py-2">{user.funksional_raxbar[0] || ""}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-2 font-bold">Ma’muriy rahbar F.I.SH.</td>
                    <td className="border border-black px-2 py-2">{user.mamuriy_raxbar[0] || ""}</td>
                  </tr>
                  {/* <tr>
                  <td className="border border-black px-2 py-2 font-bold">1-Bosqich.Xodim imzosi</td>
                  <td className="border border-black px-2 py-2">{user.birinchi_bosqich_imzo ? user.birinchi_bosqich_imzo.replace("T", " ") : ""}</td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-2 font-bold">2-Bosqich.Xodim imzosi</td>
                  <td className="border border-black px-2 py-2">{user.ikkinchi_bosqich_imzo ? user.ikkinchi_bosqich_imzo.replace("T", " ") : ""}</td>
                </tr> */}
                </tbody>
              </table>
              {/* <div>
                <div className="flex items-center justify-between gap-x-[30rem]">
                  <div>Xodim imzosi _____________________  <span>{user.birinchi_bosqich_imzo ? user.birinchi_bosqich_imzo.replace("T", " ") : ""}</span></div>
                  <div>Rahbar imzosi _____________________</div>
                </div>
              </div> */}
            </div>

            <div>
              {filteredKpiData.length > 0 ? (
                <table className="w-full border border-black text-xs border-collapse">
                  <thead className="bg-gray-100 h-12">
                    <tr>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>T/R</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Maqsad</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>KPI nomi</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Xisoblash metodikasi</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Ma'lumotlar manbai</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>O'lchov birligi</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Reja</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Maqsadning haqiqiy miqdori</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Salmog'i kutilayotgan</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Salmog'i real</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Baholovchi</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Ma'lumotnoma</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" colSpan={2}>Tasdiqlanganlik statusi</th>
                    </tr>
                    <tr>
                      <th className="border border-black px-1 py-1 bg-blue-200">1-bosqich reja bo'yicha</th>
                      <th className="border border-black px-1 py-1 bg-blue-200">2-bosqich salmoq bo'yicha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKpiData.map((kpi, index) => (
                      <tr key={kpi.id} className="h-12 text-[.7rem]">
                        <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={{ __html: kpi.maqsad }}></td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.kpi_nomi || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.xisoblash_metodikasi || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.malumotlar_manbai || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.olchov_birlik || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.reja || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.maqsadning_haqiqiy_miqdori || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.salmoq_kutilayotgan || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.salmoq_real || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.baholovchi_sex[0] || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">
                          <button onClick={() => downloadFile(kpi.malumotnoma)} className="text-blue-500 underline">
                            <TiFolderOpen className="text-3xl" />
                          </button>
                        </td>
                        <td className="border border-black px-2 py-1 text-center">
                          <div className="flex flex-col items-center">
                            <LiaCheckCircle className="text-4xl text-blue-500" />
                            <div className="border-b border-gray-400 w-full my-1"></div>
                            <span className="font-bold">
                              {kpi.birinchi_bosqich_sana ? (
                                new Date(kpi.birinchi_bosqich_sana).toLocaleDateString()
                              ) : (
                                "Yuklanmoqda..."
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="border border-black px-2 py-1 text-center">
                          <div className="flex flex-col items-center">
                            <LiaCheckCircle className="text-4xl text-blue-500" />
                            <div className="border-b border-gray-400 w-full my-1"></div>
                            <span className="font-bold">
                              {kpi.ikkinchi_bosqich_sana ? (
                                new Date(kpi.ikkinchi_bosqich_sana).toLocaleDateString()
                              ) : (
                                "Yuklanmoqda..."
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">KPI ma'lumotlari mavjud emas.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center">Iltimos, tizimga kiring.</p>
      )}
    </div>
  );
};

export default Dashboard;