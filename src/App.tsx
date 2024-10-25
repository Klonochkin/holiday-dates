import { useEffect, useState } from 'react';

interface HolidayInfo {
    text: string;
    pages: Array<
        | {
              title: string;
              content_urls: {
                  desktop: {
                      page: string;
                  };
              };
          }
        | undefined
    >;
}

interface HolidayData {
    holidays: HolidayInfo[];
}

const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];

function HolidayCard({
    text,
    link,
    linkTitle,
}: {
    text: string;
    link?: string;
    linkTitle?: string;
}) {
    return (
        <li className='list-item'>
            <p className='paragraph'>{text}</p>
            {link && linkTitle && (
                <a href={link} className='link' target='_blank'>
                    {linkTitle}
                </a>
            )}
        </li>
    );
}

function HolidayList({ data }: { data?: HolidayInfo[] }) {
    if (data && data.length > 0) {
        return (
            <ul className='list'>
                {data.map(({ text, pages: [page] }, i) => (
                    <HolidayCard
                        key={i}
                        text={text}
                        link={page?.content_urls.desktop.page}
                        linkTitle={page?.title}
                    />
                ))}
            </ul>
        );
    }

    return <p>Праздников нету</p>;
}

function App() {
    const today = new Date();
    const [data, setData] = useState<HolidayInfo[]>();
    const [daysInCurrentMonth, setDaysInCurrentMonth] = useState<number[]>();
    const [date, setNewDate] = useState(today);
    const [searchValue, setSearchValue] = useState('');

    function nextDay() {
        setNewDate(new Date(date.setDate(date.getDate() + 1)));
    }

    function prevDay() {
        setNewDate(new Date(date.setDate(date.getDate() - 1)));
    }

    function getHolidays() {
        const url = `https://ru.wikipedia.org/api/rest_v1/feed/onthisday/holidays/${date.getMonth() + 1}/${date.getDate()}`;
        fetch(url)
            .then((response) => response.json())
            .then(({ holidays }: HolidayData) => setData(holidays));
    }

    const filteredData = data?.filter(({ text }) =>
        text.toLocaleLowerCase().includes(searchValue.trim()),
    );

    useEffect(getHolidays, [date]);

    useEffect(() => {
        setDaysInCurrentMonth(
            Array.from({
                length: new Date(2020, date.getMonth() + 1, 0).getDate(),
            }).map((_, i) => ++i),
        );
    }, [date.getMonth()]);

    return (
        <main>
            <button className='button' onClick={() => prevDay()}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='15'
                    height='15'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-corner-down-left'>
                    <polyline points='9 10 4 15 9 20' />
                    <path d='M20 4v7a4 4 0 0 1-4 4H4' />
                </svg>
            </button>
            <select
                value={date.getDate()}
                name='day'
                className='select'
                onChange={(event) => {
                    setNewDate(
                        new Date(date.setDate(Number(event.target.value))),
                    );
                }}>
                {daysInCurrentMonth?.map((day, i) => (
                    <option value={day} key={i}>
                        {day}
                    </option>
                ))}
            </select>
            <button className='button' onClick={() => nextDay()}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='15'
                    height='15'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-corner-down-right'>
                    <polyline points='15 10 20 15 15 20' />
                    <path d='M4 4v7a4 4 0 0 0 4 4h12' />
                </svg>
            </button>
            <select
                value={date.getMonth()}
                name='month'
                className='select'
                onChange={(event) => {
                    setNewDate(
                        new Date(date.setMonth(Number(event.target.value))),
                    );
                }}>
                {months?.map((day, i) => (
                    <option value={i} key={i}>
                        {day}
                    </option>
                ))}
            </select>
            <label className='search'>
                <input
                    type='search'
                    className='input'
                    placeholder='Поиск'
                    onChange={({ target }) => {
                        setSearchValue(target.value.toLocaleLowerCase());
                    }}
                />
            </label>
            <HolidayList data={filteredData} />
        </main>
    );
}

export default App;
