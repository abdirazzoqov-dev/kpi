import React from 'react'

export const TableHeader = () => {
  return (
    <>
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
    </>
  )
}
