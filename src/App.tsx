import { useEffect, useState, useRef } from 'react';

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
        <li>
            <p>{text}</p>
            {link && linkTitle && (
                <a href={link} className='link' target='_blank'>
                    {linkTitle}
                </a>
            )}
        </li>
    );
}

function HolidayList({
    data,
    inputRef,
}: {
    data?: HolidayInfo[];
    inputRef: React.RefObject<HTMLUListElement>;
}) {
    if (data && data.length > 0) {
        return (
            <ul className='list' ref={inputRef}>
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
    const [daysInCurrentMonth, setdaysInCurrentMonth] = useState<number[]>();
    const [date, setNewDate] = useState(today);
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        getHolidays();
    }, [date]);

    useEffect(() => {
        search();
    }, [data, searchValue]);

    useEffect(() => {
        setdaysInCurrentMonth(
            Array.from({
                length: new Date(2020, date.getMonth() + 1, 0).getDate(),
            }).map((_, i) => ++i),
        );
    }, [date.getMonth()]);

    function search() {
        let myString: null | string = 'none';
        const arrayParagraph = inputRef?.current?.querySelectorAll('p');
        arrayParagraph?.forEach((p) => {
            myString = p.textContent;
            if (!searchValue) {
                p?.parentElement?.classList.remove('visually-hidden');
            } else if (myString?.includes(searchValue)) {
                p?.parentElement?.classList.remove('visually-hidden');
            } else {
                p?.parentElement?.classList.add('visually-hidden');
            }
        });
    }

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
            <label>
                Поиск:
                <input
                    type='text'
                    className='input'
                    onChange={({ target }) => {
                        setSearchValue(target.value);
                    }}
                />
            </label>
            <HolidayList inputRef={inputRef} data={data} />
        </main>
    );
}

export default App;
