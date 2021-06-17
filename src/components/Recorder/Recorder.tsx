import RecorderStyle from './Record.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { selectDateStart, start, stop } from '../../state/recorder';
import { useEffect, useRef, useState } from 'react';
import { addZero } from '../utils/utilFunctions';
import { createUserEvent } from '../../state/user-events';


const Recorder = () => {
    const dispatch = useDispatch()
    const dateStart = useSelector(selectDateStart)
    const [, setCount] = useState<number>(0)
    const started = dateStart !== ''
    let interval = useRef<number>(0)
    let seconds = started ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000) : 0
    const hours = seconds ? Math.floor(seconds / 60 / 60) : 0
    seconds -= hours * 60 * 60
    const minutes = seconds ? Math.floor(seconds / 60) : 0
    seconds -= minutes * 60

    const onClickHandler = () => {
        if (started) {
            window.clearInterval(interval.current)
            dispatch(createUserEvent())
            dispatch(stop())
        } else {
            dispatch(start())
            interval.current = window.setInterval(() => {
                setCount(count => count + 1)
            }, 1000)
        }

    }

    useEffect(() => {
        return window.clearInterval(interval.current)
    }, [])
    return <div className={ `${ RecorderStyle.recorder } ${ started ? RecorderStyle.recorder_started : null }` }>
        <button className={ RecorderStyle.recorder_record }
                onClick={ onClickHandler }>

            <span></span>
        </button>
        <div
            className={ RecorderStyle.recorder_counter }>{ addZero(hours) }:{ addZero(minutes) }:{ addZero(seconds) }</div>
    </div>
}
export default Recorder