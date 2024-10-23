import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const today = new Date();
    const toDay = today.getDate();
    const toMonth = today.getMonth();
    const [inner, setInner] = useState<React.ReactElement[]>([]);
    const [whatIsDay, setDay] = useState<number>(toDay);
    const [whatIsMonth, setMonth] = useState(toMonth);
    const countDayInMonth: number[] = [
        31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ];
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
    const daysInMonth = Array.from({
        length: new Date(today.getFullYear(), whatIsMonth + 1, 0).getDate(),
    }).map((_, i) => ++i);

    const monthInYear = Array.from({ length: 12 }).map((_, i) => ++i);

    const [daysInCurrentMonth, setDaysInCurrentMonth] =
        useState<number[]>(daysInMonth);

    useEffect(() => {
        setDaysInCurrentMonth(daysInMonth);
        if (whatIsDay > countDayInMonth[whatIsMonth]) {
            setDay(1);
        } else {
            checkHolidayDate();
        }
    }, [whatIsMonth]);

    useEffect(() => {
        checkHolidayDate();
    }, [whatIsDay]);

    function nextDay(flag: boolean) {
        if (flag) {
            setDay(whatIsDay - 1);
        } else {
            setDay(whatIsDay + 1);
        }
        if (!flag && whatIsDay >= countDayInMonth[whatIsMonth]) {
            if (whatIsMonth + 1 > 11) {
                setMonth(0);
            } else {
                setMonth(whatIsMonth + 1);
            }
            setDay(1);
        }
        if (flag && whatIsDay <= 1) {
            if (whatIsMonth - 1 < 0) {
                setMonth(11);
            } else {
                setMonth(whatIsMonth - 1);
            }
            setDay(countDayInMonth[whatIsMonth]);
        }
    }

    async function checkHolidayDate() {
        const url = `https://ru.wikipedia.org/api/rest_v1/feed/onthisday/holidays/${whatIsMonth + 1}/${whatIsDay}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! статус: ${response.status}`);
            }

            const data = await response.json();
            if (data) {
                setInner([]);
                if (data.holidays.length !== 0) {
                    interface ContentUrls {
                        desktop: {
                            page: string;
                        };
                    }

                    interface Page {
                        title: string;
                        content_urls: ContentUrls;
                    }

                    interface Holiday {
                        text: string;
                        date: string;
                        pages: Page[];
                    }
                    console.log(data.holidays[0].pages[0].title);
                    data.holidays.forEach((el: Holiday, i: number) => {
                        const newInner = (
                            <>
                                <div key={i}>
                                    <p>{el?.text}</p>
                                    <a
                                        href={
                                            el?.pages[0]?.content_urls?.desktop
                                                ?.page
                                        }
                                        target='_blank'>
                                        {el?.pages[0]?.title}
                                    </a>
                                </div>
                            </>
                        );
                        setInner((prevInner) => [...prevInner, newInner]);
                    });
                } else {
                    const newInner = <p key={0}>Праздников нету</p>;
                    setInner((prevInner) => [...prevInner, newInner]);
                }
            } else {
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    }
    return (
        <>
            <div className='container'>
                <button
                    className='container__button'
                    onClick={() => nextDay(true)}>
                    назад
                </button>
                <select
                    value={whatIsDay}
                    name='1'
                    id='1'
                    className='container__select'
                    onChange={(event) => {
                        setDay(Number(event.target.value));
                    }}>
                    {daysInCurrentMonth?.map((day, i) => (
                        <option value={day} key={i}>
                            {day}
                        </option>
                    ))}
                </select>
                <button
                    className='container__button'
                    onClick={() => nextDay(false)}>
                    вперёд
                </button>

                <select
                    value={whatIsMonth + 1}
                    name='2'
                    id='2'
                    className='container__select'
                    onChange={(event) => {
                        setMonth(Number(event.target.value) - 1);
                    }}>
                    {monthInYear?.map((day, i) => (
                        <option value={day} key={i}>
                            {month[day - 1]}
                        </option>
                    ))}
                </select>
            </div>

            <div>{inner}</div>
        </>
    );
}

export default App;
