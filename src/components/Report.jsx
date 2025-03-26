import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { LiaCheckCircle } from "react-icons/lia";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Datalabels plaginini import qilish

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels); // Plaginlarni ro'yxatdan o'tkazish

const Report = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedXodim, setSelectedXodim] = useState(null);
    const API_TOKEN = "Eo4nk4PK0NnvFqG1HWUtGDM-WK6r0jci";
    const API_URL_XODIMLAR = "http://localhost:8055/items/xodimlar";
    const API_URL_KPI = "http://localhost:8055/items/kpi_cards";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const xodimlarResponse = await axios.get(API_URL_XODIMLAR, {
                    headers: {
                        Authorization: `Bearer ${API_TOKEN}`
                    }
                });

                const xodimlarData = xodimlarResponse.data.data;

                const kpiPromises = xodimlarData.map(async (xodim) => {
                    const kpiResponse = await axios.get(`${API_URL_KPI}?filter[xodim_id][_eq]=${xodim.id}`, {
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`
                        }
                    });
                    return {
                        xodim,
                        kpiData: kpiResponse.data.data || []
                    };
                });

                const allKpiData = await Promise.all(kpiPromises);
                setData(allKpiData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-red-500 text-lg">Error: {error.message}</div>;

    const selectedKpiData = selectedXodim ? data.find(item => item.xodim.id === selectedXodim).kpiData : [];
    const selectedXodimData = selectedXodim ? data.find(item => item.xodim.id === selectedXodim).xodim : null;

    const downloadPDF = () => {
        const input = document.getElementById('pdfContent');
        html2canvas(input, { scale: 2, backgroundColor: null }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190; // PDF sahifasining kengligi
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save('KPI_Report.pdf');
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">KPI Report</h1>

            <div className="mb-4">
                <label htmlFor="xodimSelect" className="block mb-2">Xodimni tanlang:</label>
                <select
                    id="xodimSelect"
                    value={selectedXodim || ''}
                    onChange={(e) => setSelectedXodim(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Tanlang...</option>
                    {data.map(({ xodim }) => (
                        <option key={xodim.id} value={xodim.id}>
                            {xodim.xodim[0]} {xodim.familiya || ""}
                        </option>
                    ))}
                </select>
            </div>

            {selectedKpiData.length > 0 ? (
                <div className="bg-white p-4 shadow-lg" id="pdfContent">
                    <h2 className="text-xl font-bold mb-4">KPI Ma'lumotlari</h2>
                    {selectedXodimData && (
                        <h3 className="text-lg font-bold mb-4">
                            Xodim: {selectedXodimData.xodim[0]} {selectedXodimData.familiya}
                        </h3>
                    )}
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
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Izoh</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Baholovchi</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" rowSpan={2}>Baholovchi F.I.O</th>
                      <th className="border border-black px-1 py-1 bg-blue-200" colSpan={2}>Tasdiqlanganlik statusi</th>
                    </tr>
                    <tr>
                      <th className="border border-black px-1 py-1 bg-blue-200">1-bosqich reja bo'yicha</th>
                      <th className="border border-black px-1 py-1 bg-blue-200">2-bosqich salmoq bo'yicha</th>
                    </tr>
                        </thead>
                        <tbody>
                            {selectedKpiData.map((kpi,index) => (
                                <tr key={kpi.id} className="h-12 text-[.7rem]">
                                    <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.maqsad || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.kpi_nomi || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.xisoblash_metodikasi || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.malumotlar_manbai || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.olchov_birlik || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.reja || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.maqsadning_haqiqiy_miqdori || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.salmoq_kutilayotgan || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.salmoq_real || ""}</td>
                        <td className="border border-black px-2 py-2 text-center">{kpi.izoh || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.baholovchi_sex[0] || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">{kpi.baholovchi_xodim[0] || ""}</td>
                        <td className="border border-black px-2 py-1 text-center">
                          <div className="flex flex-col items-center">
                          <LiaCheckCircle className="text-4xl text-green-700" />
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
                          <LiaCheckCircle className="text-4xl text-green-700" />
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
                </div>
            ) : (
                selectedXodim && <p className="text-center">Tanlangan xodim uchun KPI ma'lumotlari mavjud emas.</p>
            )}

            {selectedKpiData.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center">
                    <h2 className="text-xl font-bold mb-4 w-full text-center">KPI Doughnut Chart</h2>
                    {selectedKpiData.map((kpi) => {
                        const chartData = {
                            labels: ['Reja', 'Maqsadning haqiqiy miqdori', 'Salmog\'i kutilayotgan', 'Salmog\'i real'],
                            datasets: [
                                {
                                    label: kpi.kpi_nomi,
                                    data: [
                                        kpi.reja || 0,
                                        kpi.maqsadning_haqiqiy_miqdori || 0,
                                        kpi.salmoq_kutilayotgan || 0,
                                        kpi.salmoq_real || 0,
                                    ],
                                    backgroundColor: [
                                        'rgba(75, 192, 192, 0.6)',
                                        'rgba(153, 102, 255, 0.6)',
                                        'rgba(255, 159, 64, 0.6)',
                                        'rgba(255, 99, 132, 0.6)',
                                    ],
                                },
                            ],
                        };

                        const options = {
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            const value = tooltipItem.raw;
                                            return `${tooltipItem.label}: ${value}`;
                                        }
                                    }
                                },
                                datalabels: {
                                    formatter: (value, context) => {
                                        return value; // Har bir segment ichida qiymatni ko'rsatish
                                    },
                                    color: '#fff',
                                }
                            }
                        };

                        return (
                            <div key={kpi.id} className="flex flex-col items-center mb-6" style={{ width: '400px' }}>
                                <h3 className="text-lg font-bold text-center">{kpi.kpi_nomi}</h3>
                                <Doughnut data={chartData} options={options} />
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedKpiData.length > 0 && (
                <div className="mt-4 text-center">
                    <button 
                        onClick={downloadPDF} 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        PDF yuklab olish
                    </button>
                </div>
            )}
        </div>
    );
};

export default Report;