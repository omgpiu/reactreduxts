import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';
import { Action } from 'redux';
import { selectDateStart } from './recorder';
import { Omit } from 'react-redux';
import {
    CREATE_FAILURE,
    CREATE_REQUEST,
    CREATE_SUCCESS,
    LOAD_FAILURE,
    LOAD_REQUEST,
    LOAD_SUCCESS
} from './user-events-const';

const initialState: UserEventsState = {
    byIds: {},
    allIds: []
}

const userEventsReducer = (state: UserEventsState = initialState, action: LoadSuccessAction | CreateSuccessAction) => {
    switch (action.type) {
        case LOAD_SUCCESS :
            const { events } = action.payload
            return {
                ...state, allIds: events.map(({ id }) => id),
                byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
                    byIds[event.id] = event;
                    return byIds
                }, {})
            }
        case CREATE_SUCCESS : {
            const { event } = action.payload
            return {
                ...state,
                allIds: [...state.allIds, event.id],
                byIds: { ...state.byIds, [event.id]: event }
            }
        }
        default:
            return state
    }
}
export default userEventsReducer


export const createUserEvent = (): ThunkAction<Promise<void>, RootState, undefined, CreateRequestAction | CreateSuccessAction | CreateFailureAction> =>
    async (dispatch, getState) => {
        dispatch({ type: CREATE_REQUEST })
        try {
            const dateStart = selectDateStart(getState())
            const event: Omit<UserEvent, 'id'> = {
                title: 'No name',
                dateStart,
                dateEnd: new Date().toISOString()
            }
            const responce = await fetch(`http://localhost:3001/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            })
            const createdEvent: UserEvent = await responce.json();
            dispatch({
                type: CREATE_SUCCESS,
                payload: { event: createdEvent }
            })
        } catch (e) {
            console.log(e.message)
            dispatch({ type: CREATE_FAILURE, error: e.message })
        }

    }

export const loadUserEvents = (): ThunkAction<void, RootState, undefined, LoadRequestAction | LoadSuccessAction | LoadFailureAction> => async (dispatch, getState) => {
    dispatch({ type: LOAD_REQUEST })
    try {
        const res = await fetch('http://localhost:3001/events')
        const events: UserEvent[] = await res.json()
        dispatch({
            type: LOAD_SUCCESS,
            payload: { events }
        })
    } catch (e) {
        dispatch({ type: LOAD_FAILURE, error: 'Failed to load events.' })
    }


}
export const selectUserEventsState = (state: RootState) => state.userEventsReducer
export const selectEvents = (state: RootState) => {
    const selectedState = selectUserEventsState(state)
    return selectedState.allIds.map(id => selectedState.byIds[id])
}


export interface UserEvent {
    id: number
    title: string
    dateStart: string
    dateEnd: string
}

interface UserEventsState {
    byIds: Record<UserEvent['id'], UserEvent>
    allIds: UserEvent['id'][]
}


interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {
}

interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {
}

interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
    payload: {
        events: UserEvent[]
    }
}

interface LoadFailureAction extends Action<typeof LOAD_FAILURE> {
    error: string
}


interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {
    error: string
}

interface CreateSuccessAction extends Action<typeof CREATE_SUCCESS> {
    payload: {
        event: UserEvent
    }
}

interface CreateRequestAction extends Action<typeof CREATE_REQUEST> {
}