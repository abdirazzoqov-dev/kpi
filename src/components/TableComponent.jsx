import React from 'react';

const TableComponent = () => {
  return (
    <div className="overflow-auto p-4">
    <table className="min-w-[30%] border-collapse border border-black mb-4">
        <tbody className='text-[.6rem]'>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">Таркибий бўлинман номи</td>
            <td className="border border-black px-2 py-1\">"Шўртан газ кимё мажмуаси" МЧЖ</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">Ходимнинг лавозими</td>
            <td className="border border-black px-2 py-1">Бош директорнинг иқтисод ва молия бўйича ўринбосари</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">Ходим Ф.И.Ш.</td>
            <td className="border border-black px-2 py-1">Халимов Жасурбек Комилович</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">Функционал раҳбар Ф.И.Ш.</td>
            <td className="border border-black px-2 py-1">Асланов Шухрат Чориевич</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">Маъмурий раҳбар Ф.И.Ш.</td>
            <td className="border border-black px-2 py-1">Асланов Шухрат Чориевич</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">Бахолаш даври</td>
            <td className="border border-black px-2 py-1">Февраль 2025 йил</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">1-Босқич.Ходим имзоси</td>
            <td className="border border-black px-2 py-1">14.02.2025  |  15:35</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">2-Босқич.Ходим имзоси</td>
            <td className="border border-black px-2 py-1">02.03.2025  |  15:35</td>
          </tr>
        </tbody>
      </table>
      <table className="min-w-full border-collapse border border-black">
        <thead>
          <tr className="bg-gray-100 h-12 text-[.7rem]">
            <th className="border border-black px-2 py-1" rowSpan={2}>T/R</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Мақсад</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>KPI номи</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Ҳисоблаш методикаси</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Маълумотлар манбаи</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Ўлчов бирлиги</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Режа</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Мақсаднинг ҳақиқий миқдори</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Салмоғи кутилаётган</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Салмоғи реал</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Изоҳ</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Баҳоловчи</th>
            <th className="border border-black px-2 py-1" rowSpan={2}>Баҳоловчи Ф.И.О</th>
            <th className="border border-black px-2 py-1" colSpan={2}>Тасдиқланганлик статуси</th>
          </tr>
          <tr className="bg-gray-100 h-12 text-[.7rem]">
    <th className="border border-black px-2 py-1">1-Босқич Режа бўйича</th>
    <th className="border border-black px-2 py-1">2-Босқич Салмоқ бўйича</th>
  </tr>
        </thead>
        <tbody>
          <tr className="h-12 text-[.6rem]">
            <td className="border border-black px-2 py-1 text-center">1</td>
            <td className="border border-black px-2 py-1 text-center">Бизнес режада кўрсатилган соф фойда кўрсаткичини бажариш (бозорлик махсулот)</td>
            <td className="border border-black px-2 py-1 text-center">Нарядлар режасини бажариш Семент таъминотида</td>
            <td className="border border-black px-2 py-1 text-center">Амалда соф фойда кўрсатгичи</td>
            <td className="border border-black px-2 py-1 text-center">Молиявий натижалар бўйича бухгалтерия ҳисоботи</td>
            <td className="border border-black px-2 py-1 text-center">млрд.сўм</td>
            <td className="border border-black px-2 py-1 text-center">638</td>
            <td className="border border-black px-2 py-1 text-center">1247</td>
            <td className="border border-black px-2 py-1 text-center">20%</td>
            <td className="border border-black px-2 py-1 text-center">15</td>
            <td className="border border-black px-2 py-1 text-center">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма,Операцион самарадорлик хизмати</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма ходими</td>
            <td className="border border-black px-2 py-1 text-center">16.02.2025 <br /> 15:35</td>
            <td className="border border-black px-2 py-1 text-center">04.03.2025  <br /> 15:35</td>





          </tr>
          <tr className="h-12 text-[.6rem]">
            <td className="border border-black px-2 py-1 text-center">2</td>
            <td className="border border-black px-2 py-1 text-center">Бизнес режада кўрсатилган соф фойда кўрсаткичини бажариш (бозорлик махсулот)</td>
            <td className="border border-black px-2 py-1 text-center">Нарядлар режасини бажариш Семент таъминотида</td>
            <td className="border border-black px-2 py-1 text-center">Амалда соф фойда кўрсатгичи</td>
            <td className="border border-black px-2 py-1 text-center">Молиявий натижалар бўйича бухгалтерия ҳисоботи</td>
            <td className="border border-black px-2 py-1 text-center">млрд.сўм</td>
            <td className="border border-black px-2 py-1 text-center">638</td>
            <td className="border border-black px-2 py-1 text-center">1247</td>
            <td className="border border-black px-2 py-1 text-center">20%</td>
            <td className="border border-black px-2 py-1 text-center">15</td>
            <td className="border border-black px-2 py-1 text-center">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма,Операцион самарадорлик хизмати</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма ходими</td>
            <td className="border border-black px-2 py-1 text-center">16.02.2025 <br /> 15:35</td>
            <td className="border border-black px-2 py-1 text-center">04.03.2025  <br /> 15:35</td>
          </tr>
          <tr className="h-12 text-[.6rem]">
            <td className="border border-black px-2 py-1 text-center">3</td>
            <td className="border border-black px-2 py-1 text-center">Бизнес режада кўрсатилган соф фойда кўрсаткичини бажариш (бозорлик махсулот)</td>
            <td className="border border-black px-2 py-1 text-center">Нарядлар режасини бажариш Семент таъминотида</td>
            <td className="border border-black px-2 py-1 text-center">Амалда соф фойда кўрсатгичи</td>
            <td className="border border-black px-2 py-1 text-center">Молиявий натижалар бўйича бухгалтерия ҳисоботи</td>
            <td className="border border-black px-2 py-1 text-center">млрд.сўм</td>
            <td className="border border-black px-2 py-1 text-center">638</td>
            <td className="border border-black px-2 py-1 text-center">1247</td>
            <td className="border border-black px-2 py-1 text-center">20%</td>
            <td className="border border-black px-2 py-1 text-center">15</td>
            <td className="border border-black px-2 py-1 text-center">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма,Операцион самарадорлик хизмати</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма ходими</td>
            <td className="border border-black px-2 py-1 text-center">16.02.2025 <br /> 15:35</td>
            <td className="border border-black px-2 py-1 text-center">04.03.2025  <br /> 15:35</td>
          </tr>
          <tr className="h-12 text-[.6rem]">
            <td className="border border-black px-2 py-1 text-center">4</td>
            <td className="border border-black px-2 py-1 text-center">Бизнес режада кўрсатилган соф фойда кўрсаткичини бажариш (бозорлик махсулот)</td>
            <td className="border border-black px-2 py-1 text-center">Нарядлар режасини бажариш Семент таъминотида</td>
            <td className="border border-black px-2 py-1 text-center">Амалда соф фойда кўрсатгичи</td>
            <td className="border border-black px-2 py-1 text-center">Молиявий натижалар бўйича бухгалтерия ҳисоботи</td>
            <td className="border border-black px-2 py-1 text-center">млрд.сўм</td>
            <td className="border border-black px-2 py-1 text-center">638</td>
            <td className="border border-black px-2 py-1 text-center">1247</td>
            <td className="border border-black px-2 py-1 text-center">20%</td>
            <td className="border border-black px-2 py-1 text-center">15</td>
            <td className="border border-black px-2 py-1 text-center">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма,Операцион самарадорлик хизмати</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма ходими</td>
            <td className="border border-black px-2 py-1 text-center">16.02.2025 <br /> 15:35</td>
            <td className="border border-black px-2 py-1 text-center">04.03.2025  <br /> 15:35</td>
          </tr>
          <tr className="h-12 text-[.6rem]">
            <td className="border border-black px-2 py-1 text-center">5</td>
            <td className="border border-black px-2 py-1 text-center">Бизнес режада кўрсатилган соф фойда кўрсаткичини бажариш (бозорлик махсулот)</td>
            <td className="border border-black px-2 py-1 text-center">Нарядлар режасини бажариш Семент таъминотида</td>
            <td className="border border-black px-2 py-1 text-center">Амалда соф фойда кўрсатгичи</td>
            <td className="border border-black px-2 py-1 text-center">Молиявий натижалар бўйича бухгалтерия ҳисоботи</td>
            <td className="border border-black px-2 py-1 text-center">млрд.сўм</td>
            <td className="border border-black px-2 py-1 text-center">638</td>
            <td className="border border-black px-2 py-1 text-center">1247</td>
            <td className="border border-black px-2 py-1 text-center">20%</td>
            <td className="border border-black px-2 py-1 text-center">15</td>
            <td className="border border-black px-2 py-1 text-center">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма,Операцион самарадорлик хизмати</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма ходими</td>
            <td className="border border-black px-2 py-1 text-center">16.02.2025 <br /> 15:35</td>
            <td className="border border-black px-2 py-1 text-center">04.03.2025  <br /> 15:35</td>
          </tr>
          <tr className="h-12 text-[.6rem]">
            <td className="border border-black px-2 py-1 text-center">6</td>
            <td className="border border-black px-2 py-1 text-center">Бизнес режада кўрсатилган соф фойда кўрсаткичини бажариш (бозорлик махсулот)</td>
            <td className="border border-black px-2 py-1 text-center">Нарядлар режасини бажариш Семент таъминотида</td>
            <td className="border border-black px-2 py-1 text-center">Амалда соф фойда кўрсатгичи</td>
            <td className="border border-black px-2 py-1 text-center">Молиявий натижалар бўйича бухгалтерия ҳисоботи</td>
            <td className="border border-black px-2 py-1 text-center">млрд.сўм</td>
            <td className="border border-black px-2 py-1 text-center">638</td>
            <td className="border border-black px-2 py-1 text-center">1247</td>
            <td className="border border-black px-2 py-1 text-center">20%</td>
            <td className="border border-black px-2 py-1 text-center">15</td>
            <td className="border border-black px-2 py-1 text-center">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма,Операцион самарадорлик хизмати</td>
            <td className="border border-black px-2 py-1 text-center">Персоналн бошқариш (HR) бошқарма ходими</td>
            <td className="border border-black px-2 py-1 text-center">16.02.2025 <br /> 15:35</td>
            <td className="border border-black px-2 py-1 text-center">04.03.2025  <br /> 15:35</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 text-center" colSpan={8}>Жами</td>
            <td className="border border-black px-2 py-1 text-center" colSpan={1}>100%</td>
            <td className="border border-black px-2 py-1 text-center" colSpan={1}>80%</td>
            <td className="border border-black px-2 py-1 text-center" colSpan={3}>Операцион самарадорлик хизмати ходими</td>
            <td className="border border-black px-2 py-1 text-center" colSpan={1}>14.03.2025 </td>
            <td className="border border-black px-2 py-1 text-center" colSpan={1}>14.03.2025 </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
