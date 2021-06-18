import CalendarCSS from '../Calendar/Calendar.module.css';
import { deleteUserEvent, updateUserEvent, UserEvent } from '../../state/user-events';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

interface Props {
    event: UserEvent
}

const EventItem: React.FC<Props> = ({ event }) => {

    const dispatch = useDispatch()
    const [editable, setEditable] = useState(false)
    const [title, setTitle] = useState(event.title)
    const inputRef = useRef<HTMLInputElement>(null)
    const handleTitleClick = () => {
        setEditable(true)
    }
    const onBlurHandler = () => {
        if (title !== event.title) {
            dispatch(updateUserEvent({ ...event, title }))
        }
        setEditable(false)
    }
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    useEffect(() => {
        if (editable) {
            inputRef.current?.focus()
        }
    }, [editable, title])
    return (
        <div key={ event.id } className={ CalendarCSS.calendar_event }>
            <div className={ CalendarCSS.calendar_event_info }>
                <div className={ CalendarCSS.calendar_event_time }>10:00-12:00</div>
                <div className={ CalendarCSS.calendar_event_title }
                     onClick={ handleTitleClick }
                >{ editable ?
                    <input type="text" ref={ inputRef } onBlur={ onBlurHandler } value={ title }
                           onChange={ onChangeHandler }
                    /> : event.title }</div>
            </div>
            <button className={ CalendarCSS.calendar_event_delete_button }
                    onClick={ () => dispatch(deleteUserEvent(event.id)) }>&times;</button>
        </div>
    )
}
export default EventItem