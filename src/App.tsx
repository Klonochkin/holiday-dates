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
                назад
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
                вперёд
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
                Поиск:
                <input
                    type='search'
                    className='input'
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
