import { useEffect, useState } from 'react';
import './App.css';

interface Holiday {
    holidays: {
        text: string;
        pages: {
            title: string;
            content_urls: {
                desktop: {
                    page: string;
                };
            };
        }[];
    }[];
}

const month: string[] = [
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

const today = new Date();

function HolidayCard({
    text,
    link,
    linkTitle,
}: {
    text: string;
    link: string;
    linkTitle: string;
}) {
    return (
        <div>
            <p>{text}</p>
            <a href={link} target='_blank'>
                {linkTitle}
            </a>
        </div>
    );
}

function HolidayList({ data }: { data?: Holiday }) {
    if (data?.holidays && data?.holidays.length > 0) {
        return (
            <ul>
                {data.holidays.map((holiday, i) => (
                    <HolidayCard
                        key={i}
                        text={holiday?.text}
                        link={holiday?.pages[0]?.content_urls?.desktop?.page}
                        linkTitle={holiday?.pages[0]?.title}></HolidayCard>
                ))}
            </ul>
        );
    } else {
        return <p>Праздников нету</p>;
    }
}

function App() {
    const [currentDay, setCurrentDay] = useState<number>(today.getDate());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [data, setData] = useState<Holiday>();
    const [daysInCurrentMonth, setdaysInCurrentMonth] = useState<number[]>();
    const [date] = useState(today);

    useEffect(() => {
        if (currentDay > new Date(2020, currentMonth + 1, 0).getDate()) {
            setCurrentDay(new Date(2020, currentMonth + 1, 0).getDate());
            console.log(currentMonth);
            date.setDate(currentDay);
            date.setMonth(currentMonth);
            return;
        }
        getHolidays();
        date.setMonth(currentMonth);
        date.setDate(currentDay);
    }, [currentDay, currentMonth]);

    useEffect(() => {
        setdaysInCurrentMonth(
            Array.from({
                length: new Date(2020, currentMonth + 1, 0).getDate(),
            }).map((_, i) => ++i),
        );
    }, [currentMonth]);

    function nextDay() {
        date.setDate(date.getDate() + 1);
        setCurrentDay(date.getDate());
        setCurrentMonth(date.getMonth());
    }

    function prevDay() {
        date.setDate(date.getDate() - 1);
        setCurrentDay(date.getDate());
        setCurrentMonth(date.getMonth());
    }

    function getHolidays() {
        const url = `https://ru.wikipedia.org/api/rest_v1/feed/onthisday/holidays/${currentMonth + 1}/${currentDay}`;
        fetch(url)
            .then((response) => response.json())
            .then((res) => setData(res));
    }

    return (
        <>
            <div className='container'>
                <button className='container__button' onClick={() => prevDay()}>
                    назад
                </button>
                <select
                    value={currentDay}
                    name='1'
                    id='1'
                    className='container__select'
                    onChange={(event) => {
                        setCurrentDay(Number(event.target.value));
                    }}>
                    {daysInCurrentMonth?.map((day, i) => (
                        <option value={day} key={i}>
                            {day}
                        </option>
                    ))}
                </select>
                <button className='container__button' onClick={() => nextDay()}>
                    вперёд
                </button>

                <select
                    value={currentMonth}
                    name='2'
                    id='2'
                    className='container__select'
                    onChange={(event) => {
                        setCurrentMonth(Number(event.target.value));
                    }}>
                    {month?.map((day, i) => (
                        <option value={i} key={i}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <HolidayList data={data} />
            </div>
        </>
    );
}

export default App;
