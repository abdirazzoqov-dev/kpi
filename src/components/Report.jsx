import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Report = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');

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
                        xodim: xodim ? xodim.xodim[0] : null
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

    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-red-500 text-lg">Error: {error.message}</div>;

    const filteredData = data.filter(item =>
        item.xodim && item.xodim.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">KPI Report</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Xodimni qidirish..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-fulll bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            {[
                                "Xodim", "Maqsad", "KPI nomi", "Xisoblash metodikasi", 
                                "Ma'lumotlar manbai", "O'lchov birligi", "Reja", 
                                "Maqsadning haqiqiy miqdori", "Salmog'i kutilayotgan", 
                                "Salmog'i real", "Izoh", "Baholovchi", "Baholovchi FIO", 
                                "1-bosqich reja bo'yicha", "2-bosqich salmoq bo'yicha"
                            ].map((header) => (
                                <th key={header} className="border border-black px-2 py-3 text-sm text-left">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(item => (
                            <tr key={item.id} className="h-12 text-[.7rem]  hover:bg-gray-100">
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
        </div>
    );
};

export default Report;