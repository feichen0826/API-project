import { csrfFetch } from "./csrf";

// Action types
const FETCH_ALL_EVENTS = 'event/fetchAllEvents';
const FETCH_EVENT_DETAILS = 'event/fetchEventDetails';
const CREATE_EVENT = 'event/createEvent';
const DELETE_EVENT = 'event/deleteEvent';
const UPLOAD_EVENT_IMAGE_SUCCESS = 'eventImage/uploadSuccess';
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

const uploadEventImageSuccess = (image) => {
  return {
    type: UPLOAD_EVENT_IMAGE_SUCCESS,
    image,
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
  console.log('groupId:', groupId);
  console.log('eventData:', eventData);

    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });


    if (response.ok) {
      const createdEvent = await response.json();
      const imageUploadResponse = await dispatch(
        uploadEventImageAsync(createdEvent.id, eventData.imageUrl)
      );


      return createdEvent
    } else {
      const errors = await response.json()
      return errors
    }
  };

  export const uploadEventImageAsync = (eventId, imageUrl) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!response.ok) {
        const errors = await response.json();
        console.error('Image upload failed:', errors);
        return { ok: false, errors };
      }

      const uploadedImage = await response.json();
      dispatch(uploadEventImageSuccess(uploadedImage));

      return { ok: true, uploadedImage };
    } catch (error) {
      console.error('Error uploading event image:', error);
      throw error;
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
    eventDetails: [],
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
