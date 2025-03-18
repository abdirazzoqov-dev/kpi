import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Report = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(''); // Filtr uchun state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const kpiResponse = await axios.get('http://localhost:8055/items/kpi_cards', {
                    headers: {
                        Authorization: 'Bearer XfN0oSyqlI-TlVKMDNDUvOKIBCrBUV3L'
                    }
                });

                const xodimlarResponse = await axios.get('http://localhost:8055/items/xodimlar', {
                    headers: {
                        Authorization: 'Bearer XfN0oSyqlI-TlVKMDNDUvOKIBCrBUV3L'
                    }
                });

                const kpiData = kpiResponse.data.data;
                const xodimlarData = xodimlarResponse.data.data;

                const mergedData = kpiData.map(kpi => {
                    const xodim = xodimlarData.find(x => x.id === kpi.xodim_id);
                    return {
                        ...kpi,
                        xodim: xodim ? xodim.xodim[0] : null // Xodim nomini qo'shish
                    };
                });

                setData(mergedData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    // Filtrlangan ma'lumotlar
    const filteredData = data.filter(item =>
        item.xodim && item.xodim.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">KPI Report</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Xodimni qidirish..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                />
            </div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr>
                        <th className="border border-black px-1 py-1" rowSpan={2}>Xodim</th>

                        <th className="border border-black px-1 py-1" rowSpan={2}>Maqsad</th>
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
                        <th className="border border-black px-1 py-1" rowSpan={2}>Baholovchi FIO</th>
                        <th className="border border-black px-1 py-1" colSpan={2}>Tasdiqlanganlik statusi</th>
                    </tr>
                    <tr>
                      <th className="border border-black px-1 py-1">1-bosqich reja bo'yicha</th>
                      <th className="border border-black px-1 py-1">2-bosqich salmoq bo'yicha</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(item => (

                        <tr key={item.id} className="h-12 text-[.6rem]">
                            <td className="border border-black px-2 py-1 text-center">{item.xodim || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.maqsad || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.kpi_nomi || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.xisoblash_metodikasi || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.malumotlar_manbai || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.olchov_birlik || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.reja || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.maqsadning_haqiqiy_miqdori || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.salmoq_kutilayotgan || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.salmoq_real || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.izoh || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.baholovchi_sex || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.baholovchi_xodim || "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.birinchi_bosqich_sana ? item.birinchi_bosqich_sana.replace("T", " ") : "Bo'sh"}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.ikkinchi_bosqich_sana ? item.ikkinchi_bosqich_sana.replace("T", " ") : "Bo'sh"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Report;