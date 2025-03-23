
import SideNavigation from '../components/SideNavigation';
import Header from '../components/Header';
import '../assets/styles/breaks css/breaks.css'; // Updated CSS import

const MyBreaks = () => {
    const breaks = [
        {
            day: 'Monday',
            breaks: [
                { type: 'Screen Break 1', start: '10:30 AM', end: '10:45 AM' },
                { type: 'Lunch Break', start: '12:30 PM', end: '1:30 PM' },
                { type: 'Screen Break 2', start: '3:30 PM', end: '3:45 PM' }
            ]
        },
        {
            day: 'Tuesday',
            breaks: [
                { type: 'Screen Break 1', start: '10:30 AM', end: '12:30 PM' },
                { type: 'Lunch Break', start: '10:30 AM', end: '12:30 PM' },
                { type: 'Screen Break 2', start: '10:30 AM', end: '12:30 PM' }
            ]
        },
        {
            day: 'Wednesday',
            breaks: [
                { type: 'Screen Break 1', start: '10:30 AM', end: '12:30 PM' },
                { type: 'Lunch Break', start: '10:30 AM', end: '12:30 PM' },
                { type: 'Screen Break 2', start: '10:30 AM', end: '12:30 PM' }
            ]
        },
        {
            day: 'Thursday',
            breaks: [
                { type: 'No Schedule for today', start: null, end: null }
            ]
        },
        {
            day: 'Friday',
            breaks: [
                { type: 'No Schedule for today', start: null, end: null }
            ]
        },
        {
            day: 'Saturday',
            breaks: [
                { type: 'Screen Break 1', start: '10:30 AM', end: '12:30 PM' },
                { type: 'Lunch Break', start: '10:30 AM', end: '12:30 PM' },
                { type: 'Screen Break 2', start: '10:30 AM', end: '12:30 PM' }
            ]
        },
        {
            day: 'Sunday',
            breaks: [
                { type: 'Screen Break 1', start: '10:30 AM', end: '12:30 PM' },
                { type: 'Lunch Break', start: '10:30 AM', end: '12:30 PM' },
                { type: 'Screen Break 2', start: '10:30 AM', end: '12:30 PM' }
            ]
        }
    ];

    return (
        <>
            <SideNavigation />
            <Header />
            <div className="my-breaks-page">
                <p>Here&apos;s a detailed overview of your scheduled breaks this week</p>

                <div className="breaks-table">
                    {breaks.map((dayBreaks, index) => (
                        <div key={index} className="break-day-container">
                            <div className="break-day">{dayBreaks.day}</div>

                            {dayBreaks.breaks.map((break_, breakIndex) => (
                                <div key={breakIndex} className="break-item bg-[#ebebeb]">
                                    <div className="break-type">{break_.type}</div>

                                    {break_.start && break_.end ? (
                                        <div className="break-time">
                                            {break_.start} - {break_.end}
                                        </div>
                                    ) : (
                                        <div className="break-status">{break_.type}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MyBreaks;