import CalendarCSS from './Calendar.module.css'
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { loadUserEvents, selectEvents, selectUserEventsState, UserEvent } from '../../state/user-events';
import React, { useEffect } from 'react';
import { addZero } from '../utils/utilFunctions';
import { RootState } from '../../state/store';

// const mapState = (state: RootState) => ({
//     events: selectUserEventsState(state)
// })
// const mapDispatch = {
//     loadUserEvents
// }
// const connector = connect(mapState, mapDispatch)
// type PropsFromRedux = ConnectedProps<typeof connector>
// interface Props extends PropsFromRedux {}

const createDateKey = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${year}-${addZero(month)}-${addZero(day)}`

}
const groupEventsByDay = (events: UserEvent[]) => {
    const groups: Record<string, UserEvent[]> = {}
    const addToGroup = (dateKey: string, event: UserEvent) => {
        if (groups[dateKey] === undefined) {
            groups[dateKey] = []
        }
        groups[dateKey].push(event)
    }
    events.forEach((event) => {
        const dateStartKey = createDateKey(new Date(event.dateStart))
        const dateEndKey = createDateKey(new Date(event.dateEnd))
        addToGroup(dateStartKey, event)
        if (dateEndKey !== dateStartKey) {
            addToGroup(dateEndKey, event)
        }

    })
    return groups
}
const Calendar = () => {
    const dispatch = useDispatch()
    const events = useSelector(selectEvents)

    useEffect(() => {
        dispatch(loadUserEvents())
    }, [])
    let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined
    let sortedGroupKeys: string[] | undefined
    if (events.length) {
        groupedEvents = groupEventsByDay(events)
        sortedGroupKeys = Object.keys(groupedEvents).sort(
            (date1, date2) => +new Date(date2) - +new Date(date1)
        )
    }
    return groupedEvents && sortedGroupKeys ? (
        <div className={CalendarCSS.calendar}>{sortedGroupKeys.map(dayKey => {
            const events = groupedEvents ? groupedEvents[dayKey] : [];
            const groupDate = new Date(dayKey)
            const day = groupDate.getDate()
            const month = groupDate.toLocaleDateString(undefined, {month: 'long'})

            return <div className={CalendarCSS.calendar_day}>
                <div className={CalendarCSS.calendar_day_label}>
                    <span>{day} {month}</span>
                </div>
                {events.map(event => {
                    return (
                        <div key={event.id} className={CalendarCSS.calendar_event}>
                            <div className={CalendarCSS.calendar_event_info}>
                                <div className={CalendarCSS.calendar_event_time}>10:00-12:00</div>
                                <div className={CalendarCSS.calendar_event_title}>Learning Typescript</div>
                            </div>
                            <button className={CalendarCSS.calendar_event_delete_button}>&times;</button>
                        </div>
                    )
                })}
            </div>
        })}</div>


    ) : <p>Loading</p>
}
export default Calendar