import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

// HTML teglarni olib tashlash uchun funksiya
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// KPI nomlarini wrap qilish uchun funksiya
const wrapText = (text, maxLength) => {
  if (!text) return '';
  const words = text.split(' ');
  let currentLine = '';
  const lines = [];

  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.join('\n');
};

const API_TOKEN = "RxwHPPmY2lOJhRBhm2Ex1eMfMQHc5Dgy";
const KPI_API_URL = "http://192.168.96.89:8055/items/kpi_karta";
const XODIM_API_URL = "http://192.168.96.89:8055/items/xodimlar";

const VisualReport = () => {
  const [kpiData, setKpiData] = useState([]);
  const [xodimData, setXodimData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [chartWidths, setChartWidths] = useState({});
  const [selectedXodimId, setSelectedXodimId] = useState('');

  const chartRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiResponse = await fetch(KPI_API_URL, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        const kpiResult = await kpiResponse.json();
        
        const xodimResponse = await fetch(XODIM_API_URL, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        const xodimResult = await xodimResponse.json();

        setKpiData(kpiResult.data || []);
        setXodimData(xodimResult.data || []);
        
        const initialFilters = {};
        (xodimResult.data || []).forEach(xodim => {
          initialFilters[xodim.id] = '';
        });
        setFilters(initialFilters);

        setLoading(false);
      } catch (err) {
        setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateChartWidths = () => {
      const newWidths = {};
      Object.keys(chartRefs.current).forEach(key => {
        const ref = chartRefs.current[key];
        if (ref) {
          const width = ref.offsetWidth;
          newWidths[key] = width;
        }
      });
      setChartWidths(newWidths);
    };

    updateChartWidths();
    window.addEventListener('resize', updateChartWidths);
    window.addEventListener('resize', () => {
      setTimeout(updateChartWidths, 100);
    });

    return () => {
      window.removeEventListener('resize', updateChartWidths);
    };
  }, [xodimData]);

  const getMonthYear = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const getUniqueMonthYears = (xodimId) => {
    if (!kpiData.length) return [];
    const xodimKpis = kpiData.filter(kpi => kpi.xodim_id === xodimId);
    return [...new Set(xodimKpis.flatMap(kpi => [
      getMonthYear(kpi.birinchi_bosqich_sana),
      getMonthYear(kpi.ikkinchi_bosqich_sana)
    ]))].sort();
  };

  const prepareChartDataForRejaVsHaqiqiy = (xodimId) => {
    if (!kpiData.length || !xodimData.length) return [];

    const xodimKpis = kpiData.filter(kpi => kpi.xodim_id === xodimId);
    const selectedMonthYear = filters[xodimId] || '';

    const filteredKpis = selectedMonthYear
      ? xodimKpis.filter(kpi => 
          getMonthYear(kpi.birinchi_bosqich_sana) === selectedMonthYear || 
          getMonthYear(kpi.ikkinchi_bosqich_sana) === selectedMonthYear
        )
      : xodimKpis;

    const kpiNames = filteredKpis.map(kpi => kpi.kpi_nomi || 'Noma\'lum');
    const wrappedKpiNames = kpiNames.map(name => wrapText(name, 30)); // Har bir qator uchun maksimal uzunlik 30

    return [
      {
        y: kpiNames,
        x: filteredKpis.map(kpi => parseFloat(kpi.reja) || 0),
        name: 'Reja',
        type: 'bar',
        orientation: 'h',
        marker: { color: 'rgba(255, 99, 132, 0.8)' },
        text: filteredKpis.map(kpi => (parseFloat(kpi.reja) || 0).toFixed(2)),
        textposition: 'auto'
      },
      {
        y: kpiNames,
        x: filteredKpis.map(kpi => parseFloat(kpi.maqsadning_haqiqiy_miqdori) || 0),
        name: 'Haqiqiy Miqdor',
        type: 'bar',
        orientation: 'h',
        marker: { color: 'rgba(54, 162, 235, 0.8)' },
        text: filteredKpis.map(kpi => (parseFloat(kpi.maqsadning_haqiqiy_miqdori) || 0).toFixed(2)),
        textposition: 'auto'
      },
      { wrappedKpiNames } // Wrap qilingan nomlarni qaytarish
    ];
  };

  const prepareChartDataForSalmoq = (xodimId) => {
    if (!kpiData.length || !xodimData.length) return [];

    const xodimKpis = kpiData.filter(kpi => kpi.xodim_id === xodimId);
    const selectedMonthYear = filters[xodimId] || '';

    const filteredKpis = selectedMonthYear
      ? xodimKpis.filter(kpi => 
          getMonthYear(kpi.birinchi_bosqich_sana) === selectedMonthYear || 
          getMonthYear(kpi.ikkinchi_bosqich_sana) === selectedMonthYear
        )
      : xodimKpis;

    const kpiNames = filteredKpis.map(kpi => kpi.kpi_nomi || 'Noma\'lum');
    const wrappedKpiNames = kpiNames.map(name => wrapText(name, 30)); // Har bir qator uchun maksimal uzunlik 30

    return [
      {
        y: kpiNames,
        x: filteredKpis.map(kpi => parseFloat(kpi.salmoq_kutilayotgan?.replace('%', '')) || 0),
        name: 'Salmoq Kutilayotgan',
        type: 'bar',
        orientation: 'h',
        marker: { color: 'rgba(75, 192, 192, 0.8)' },
        text: filteredKpis.map(kpi => (parseFloat(kpi.salmoq_kutilayotgan?.replace('%', '')) || 0).toFixed(2) + '%'),
        textposition: 'auto'
      },
      {
        y: kpiNames,
        x: filteredKpis.map(kpi => parseFloat(kpi.salmoq_real?.replace('%', '')) || 0),
        name: 'Salmoq Real',
        type: 'bar',
        orientation: 'h',
        marker: { color: 'rgba(255, 159, 64, 0.8)' },
        text: filteredKpis.map(kpi => (parseFloat(kpi.salmoq_real?.replace('%', '')) || 0).toFixed(2) + '%'),
        textposition: 'auto'
      },
      { wrappedKpiNames } // Wrap qilingan nomlarni qaytarish
    ];
  };

  const handleFilterChange = (xodimId, value) => {
    setFilters(prev => ({
      ...prev,
      [xodimId]: value
    }));
  };

  const handleXodimChange = (e) => {
    setSelectedXodimId(e.target.value);
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-6 w-full min-h-screen overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Xodimlar va KPI ma'lumotlari</h2>

      {/* Xodim Filtr Dropdown */}
      <div className="flex flex-col md:flex-row justify-end items-center mb-6 gap-4">
        <label className="font-bold" htmlFor="xodim-filter">Xodimni tanlang:</label>
        <select
          id="xodim-filter"
          value={selectedXodimId}
          onChange={handleXodimChange}
          className="bg-gray-600 text-white font-bold p-2 rounded w-full md:w-64 max-w-xs"
        >
          <option value="">Xodimni tanlang</option>
          {xodimData.map(xodim => (
            <option key={xodim.id} value={xodim.id}>
              {xodim.xodim?.[0] || 'Noma\'lum xodim'}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-10">
        {selectedXodimId ? (
          xodimData
            .filter(xodim => xodim.id === selectedXodimId)
            .map(xodim => {
              const xodimKpis = kpiData.filter(kpi => kpi.xodim_id === xodim.id);
              const monthYears = getUniqueMonthYears(xodim.id);
              const selectedMonthYear = filters[xodim.id] || '';
              const filteredKpis = selectedMonthYear
                ? xodimKpis.filter(kpi => 
                    getMonthYear(kpi.birinchi_bosqich_sana) === selectedMonthYear || 
                    getMonthYear(kpi.ikkinchi_bosqich_sana) === selectedMonthYear
                  )
                : xodimKpis;

              const rejaVsHaqiqiyData = prepareChartDataForRejaVsHaqiqiy(xodim.id);
              const salmoqData = prepareChartDataForSalmoq(xodim.id);

              const wrappedKpiNamesReja = rejaVsHaqiqiyData[2]?.wrappedKpiNames || [];
              const wrappedKpiNamesSalmoq = salmoqData[2]?.wrappedKpiNames || [];

              return (
                <div key={xodim.id} className="mb-10 border border-gray-300 p-4 md:p-6 rounded-lg">
                  {/* Table with xodim */}
                  <h4 className="text-xl font-bold mb-4">Xodim ma'lumotlari:</h4>
                  <div className="overflow-x-hidden">
                    <table className="w-full border-collapse mb-6">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 p-2 text-left">Xodim</th>
                          <th className="border border-gray-300 p-2 text-center">Lavozim</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-2 whitespace-normal break-words">{xodim.xodim?.[0] || 'Noma\'lum xodim'}</td>
                          <td className="border border-gray-300 p-2 text-center whitespace-normal break-words">{xodim.xodim_lavozimi?.[0] || 'Noma\'lum'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Filter Dropdown */}
                  <div className="flex flex-col md:flex-row justify-end items-center mb-6 gap-4">
                    <label className="font-bold" htmlFor={`filter-${xodim.id}`}>Oy va yil kesimida qidiruv:</label>
                    <select
                      className="bg-gray-600 text-white font-bold p-2 rounded w-full md:w-64 max-w-xs"
                      id={`filter-${xodim.id}`}
                      value={filters[xodim.id] || ''}
                      onChange={(e) => handleFilterChange(xodim.id, e.target.value)}
                    >
                      <option value="">Barchasi</option>
                      {monthYears.map(my => (
                        <option key={my} value={my}>{my}</option>
                      ))}
                    </select>
                  </div>

                  {/* Table with Izoh Column (HTML tags removed) */}
                  <h4 className="text-xl font-bold mb-4">KPI Ma'lumotlari (Jadval):</h4>
                  <div className="overflow-x-hidden">
                    <table className="w-full border-collapse mb-6">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 p-2 text-left">KPI Nomi</th>
                          <th className="border border-gray-300 p-2 text-center">Reja</th>
                          <th className="border border-gray-300 p-2 text-center">Haqiqiy Miqdor</th>
                          <th className="border border-gray-300 p-2 text-center">Salmoq Kutilayotgan</th>
                          <th className="border border-gray-300 p-2 text-center">Salmoq Real</th>
                          <th className="border border-gray-300 p-2 text-left">Izoh</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredKpis.map(kpi => (
                          <tr key={kpi.id}>
                            <td className="border border-gray-300 p-2 whitespace-normal break-words">{kpi.kpi_nomi || 'Noma\'lum'}</td>
                            <td className="border border-gray-300 p-2 text-center">{kpi.reja || '0'}</td>
                            <td className="border border-gray-300 p-2 text-center">{kpi.maqsadning_haqiqiy_miqdori || '0'}</td>
                            <td className="border border-gray-300 p-2 text-center">{kpi.salmoq_kutilayotgan || '0%'}</td>
                            <td className="border border-gray-300 p-2 text-center">{kpi.salmoq_real || '0%'}</td>
                            <td className="border border-gray-300 p-2 whitespace-normal break-words">{stripHtml(kpi.izoh) || 'Ma\'lumot yo\'q'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Two Horizontal Bar Charts */}
                  <div className="flex flex-col gap-6">
                    {/* Reja vs Haqiqiy Miqdor Horizontal Bar Chart */}
                    <div
                      className="w-full"
                      ref={el => (chartRefs.current[`reja-${xodim.id}`] = el)}
                    >
                      <Plot
                        data={rejaVsHaqiqiyData.slice(0, 2)} // Faqat grafik ma'lumotlarini ishlatamiz
                        layout={{
                          title: 'Reja vs Haqiqiy Miqdor',
                          xaxis: { title: 'Qiymat', range: [0, 100] },
                          yaxis: {
                            title: 'KPI Nomi',
                            tickvals: rejaVsHaqiqiyData[0].y,
                            ticktext: wrappedKpiNamesReja,
                            automargin: true
                          },
                          height: 500,
                          width: chartWidths[`reja-${xodim.id}`] || window.innerWidth - 40,
                          barmode: 'group',
                          bargap: 0.3,
                          plot_bgcolor: '#f9f9f9',
                          paper_bgcolor: '#ffffff',
                          font: { size: 14 },
                          legend: { x: 1, y: 1 },
                          margin: { l: 400, r: 50, t: 50, b: 50 }
                        }}
                        config={{ responsive: true }}
                      />
                    </div>

                    {/* Salmoq Kutilayotgan vs Salmoq Real Horizontal Bar Chart */}
                    <div
                      className="w-full"
                      ref={el => (chartRefs.current[`salmoq-${xodim.id}`] = el)}
                    >
                      <Plot
                        data={salmoqData.slice(0, 2)} // Faqat grafik ma'lumotlarini ishlatamiz
                        layout={{
                          title: 'Salmoq Kutilayotgan vs Salmoq Real',
                          xaxis: { title: 'Foiz (%)', range: [0, 100] },
                          yaxis: {
                            title: 'KPI Nomi',
                            tickvals: salmoqData[0].y,
                            ticktext: wrappedKpiNamesSalmoq,
                            automargin: true
                          },
                          height: 500,
                          width: chartWidths[`salmoq-${xodim.id}`] || window.innerWidth - 40,
                          barmode: 'group',
                          bargap: 0.3,
                          plot_bgcolor: '#f9f9f9',
                          paper_bgcolor: '#ffffff',
                          font: { size: 14 },
                          legend: { x: 1, y: 1 },
                          margin: { l: 400, r: 50, t: 50, b: 50 }
                        }}
                        config={{ responsive: true }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="text-center text-gray-500">
            Iltimos, xodimni tanlang.
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualReport;