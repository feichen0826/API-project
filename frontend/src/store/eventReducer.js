import { csrfFetch } from "./csrf";

// Action types
const FETCH_ALL_EVENTS = 'event/fetchAllEvents';
const FETCH_EVENT_DETAILS = 'event/fetchEventDetails';
const CREATE_EVENT = 'event/createEvent';
const DELETE_EVENT = 'event/deleteEvent';
// Action creator
const fetchAllEvents = (events) => {
  return {
    type: FETCH_ALL_EVENTS,
    events,
  };
};

const fetchEventDetails = (eventDetails) => {
    return {
      type: FETCH_EVENT_DETAILS,
      eventDetails,
    };
};

const createEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event,
  };
};

export const deleteEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    eventId,
  };
};


// thunk action
export const fetchAllEventsAsync = () => async (dispatch) => {
  const response = await fetch('/api/events');
  const eventsData = await response.json();
  dispatch(fetchAllEvents(eventsData));
};

export const fetchEventDetailsAsync = (eventId) => async (dispatch) => {
    const response = await fetch(`/api/events/${eventId}`);
    if (response.ok) {
      const eventDetails = await response.json();
      dispatch(fetchEventDetails(eventDetails));
      return eventDetails
    }
  };

export const createEventAsync = (groupId, eventData) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    console.log(response)
    if (response.ok) {
      const createdEvent = await response.json();
      dispatch(createEvent(createdEvent));
      return createEvent
    } else {
      const errors = await response.json()
      return errors
      // console.error('Failed to create the event');
    }
  };

  export const deleteEventAsync = (eventId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const responseBody = await response.json();
        dispatch(deleteEvent(eventId));
      } else if (response.status === 404) {
        console.error('Event not found');
      } else {
        console.error('Error deleting event:', response.status);
      }
    } catch (error) {
      console.error('Error deleting event:', error);

  };
  }
//reducer
const initialState = {
    events: [],
    eventDetails: null,
  };

  const eventReducer = (state = initialState, action) => {
    switch (action.type) {

      case FETCH_ALL_EVENTS:
        return {
          ...state,
          events: action.events,
        };
        case FETCH_EVENT_DETAILS:
      return {
        ...state,
        eventDetails: action.eventDetails,
      };
      case CREATE_EVENT:
      return {
        ...state,
        events:[...state.events, action.event],
      };
      case DELETE_EVENT:
      const updatedEvents = state.events.filter((event) => event.id !== action.eventId);
      return {
        ...state,
        events: updatedEvents,
      };
      default:
        return state;
    }
  };

  export default eventReducer;
