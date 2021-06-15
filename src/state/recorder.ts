import { Action } from 'redux';
import { RootState } from './store';

interface RecorderState {
    dateStart: string
}

const initialState: RecorderState = {
    dateStart: ''
}
const START = 'recorder/start'
const END = 'recorder/end'
type StartAction = Action<typeof START>
type EndAction = Action<typeof END>
export const start = (): StartAction => ({
    type: START
})
export const stop = (): EndAction => ({
    type: END
})
export const selectRecorderState = (state: RootState) => state.recorderReducer
export const selectDateStart = (state: RootState) => selectRecorderState(state).dateStart


const recorderReducer = (state: RecorderState = initialState, action: StartAction | EndAction) => {
    switch (action.type) {
        case START:
            return {...state, dateStart: new Date().toISOString()}
        case END:
            return {...state, dateStart: ''}

        default:
            return state
    }
}
export default recorderReducer