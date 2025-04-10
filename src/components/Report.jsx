import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { LiaCheckCircle } from "react-icons/lia";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import sanitizeHtml from 'sanitize-html';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Report = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedXodim, setSelectedXodim] = useState(null);
    const [startDate, setStartDate] = useState(''); // Birinchi bosqich uchun boshlang'ich sana
    const [endDate, setEndDate] = useState('');     // Ikkinchi bosqich uchun tugash sana
    const API_TOKEN = "RxwHPPmY2lOJhRBhm2Ex1eMfMQHc5Dgy";
    const API_URL_XODIMLAR = "http://192.168.96.89:8055/items/xodimlar";
    const API_URL_KPI = "http://192.168.96.89:8055/items/kpi_karta";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const xodimlarResponse = await axios.get(API_URL_XODIMLAR, {
                    headers: { Authorization: `Bearer ${API_TOKEN}` }
                });
                const xodimlarData = xodimlarResponse.data.data;

                const kpiPromises = xodimlarData.map(async (xodim) => {
                    const kpiResponse = await axios.get(`${API_URL_KPI}?filter[xodim_id][_eq]=${xodim.id}`, {
                        headers: { Authorization: `Bearer ${API_TOKEN}` }
                    });
                    return { xodim, kpiData: kpiResponse.data.data || [] };
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

    // Tanlangan xodimning KPI ma'lumotlarini olish va filterlash
    const selectedKpiDataRaw = selectedXodim ? data.find(item => item.xodim.id === selectedXodim).kpiData : [];
    const selectedXodimData = selectedXodim ? data.find(item => item.xodim.id === selectedXodim).xodim : null;

    // Sana bo'yicha filterlash
    const filteredKpiData = selectedKpiDataRaw.filter(kpi => {
        const birinchiSana = kpi.birinchi_bosqich_sana ? new Date(kpi.birinchi_bosqich_sana) : null;
        const ikkinchiSana = kpi.ikkinchi_bosqich_sana ? new Date(kpi.ikkinchi_bosqich_sana) : null;
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        // Agar filter sanalari kiritilmagan bo'lsa, barcha ma'lumotlarni qaytar
        if (!start && !end) return true;

        // Filterlash logikasi
        if (start && end) {
            return (birinchiSana && birinchiSana >= start && birinchiSana <= end) ||
                   (ikkinchiSana && ikkinchiSana >= start && ikkinchiSana <= end);
        } else if (start) {
            return (birinchiSana && birinchiSana >= start) || (ikkinchiSana && ikkinchiSana >= start);
        } else if (end) {
            return (birinchiSana && birinchiSana <= end) || (ikkinchiSana && ikkinchiSana <= end);
        }
        return true;
    });

    const downloadPDF = () => {
        const input = document.getElementById('pdfContent');
        html2canvas(input, { scale: 2, backgroundColor: null }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
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

    const totalSalmoqKutilayotgan = filteredKpiData.reduce((sum, kpi) => sum + (parseFloat(kpi.salmoq_kutilayotgan) || 0), 0);
    const totalSalmoqReal = filteredKpiData.reduce((sum, kpi) => sum + (parseFloat(kpi.salmoq_real) || 0), 0);

    const renderSanitizedHTML = (raw) => {
        const cleanHTML = sanitizeHtml(raw || "", {
            allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
            allowedAttributes: {}
        });
        return { __html: cleanHTML };
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">KPI Report</h1>

            <div className="mb-4 flex flex-col gap-4">
                <div>
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
                                {xodim.xodim} {xodim.familiya || ""}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filterlash uchun sana kiritish maydonlari */}
                {selectedXodim && (
                    <div className="flex gap-4">
                        <div>
                            <label htmlFor="startDate" className="block mb-2">Boshlang'ich sana:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block mb-2">Tugash sana:</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}
            </div>

            {filteredKpiData.length > 0 && (
                <div className="mt-4 text-center flex justify-end">
                    <button onClick={downloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        PDF yuklab olish
                    </button>
                </div>
            )}

            {selectedXodim ? (
                filteredKpiData.length > 0 ? (
                    <div className="bg-white p-4 shadow-lg" id="pdfContent">
                        <h2 className="text-xl font-bold mb-4">KPI Ma'lumotlari</h2>
                        {selectedXodimData && (
                            <h3 className="text-lg font-bold mb-4">
                                Xodim: {selectedXodimData.xodim} {selectedXodimData.familiya}
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
                                {filteredKpiData.map((kpi, index) => (
                                    <tr key={kpi.id} className="h-12 text-[.7rem]">
                                        <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.maqsad)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.kpi_nomi)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.xisoblash_metodikasi)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.malumotlar_manbai)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.olchov_birlik)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.reja)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.maqsadning_haqiqiy_miqdori)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.salmoq_kutilayotgan)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.salmoq_real)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.izoh)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.baholovchi)} />
                                        <td className="border border-black px-2 py-1 text-center" dangerouslySetInnerHTML={renderSanitizedHTML(kpi.baholovchi_fio)} />
                                        <td className="border border-black px-2 py-1 text-center">
                                            <div className="flex flex-col items-center">
                                                <LiaCheckCircle className="text-4xl text-green-700" />
                                                <div className="border-b border-gray-400 w-full my-1"></div>
                                                <span className="font-bold" dangerouslySetInnerHTML={renderSanitizedHTML(
                                                    kpi.birinchi_bosqich_sana ? new Date(kpi.birinchi_bosqich_sana).toLocaleDateString() : "-"
                                                )} />
                                            </div>
                                        </td>
                                        <td className="border border-black px-2 py-1 text-center">
                                            <div className="flex flex-col items-center">
                                                <LiaCheckCircle className="text-4xl text-green-700" />
                                                <div className="border-b border-gray-400 w-full my-1"></div>
                                                <span className="font-bold" dangerouslySetInnerHTML={renderSanitizedHTML(
                                                    kpi.ikkinchi_bosqich_sana ? new Date(kpi.ikkinchi_bosqich_sana).toLocaleDateString() : "-"
                                                )} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="font-bold bg-blue-200">
                                    <td className="border border-black px-2 py-4 text-center text-xl" colSpan={8}>Jami:</td>
                                    <td className="border border-black px-2 py-4 text-center text-lg" dangerouslySetInnerHTML={renderSanitizedHTML(`${totalSalmoqKutilayotgan} %`)} />
                                    <td className="border border-black px-2 py-4 text-center text-lg" dangerouslySetInnerHTML={renderSanitizedHTML(`${totalSalmoqReal} %`)} />
                                    <td className="border border-black px-2 py-4 text-center" colSpan={5}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center">Tanlangan xodim uchun ushbu sana oralig'ida KPI ma'lumotlari mavjud emas.</p>
                )
            ) : (
                <p className="text-center">Iltimos, xodimni tanlang.</p>
            )}
        </div>
    );
};

export default Report;