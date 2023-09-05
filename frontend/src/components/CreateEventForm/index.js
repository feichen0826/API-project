import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEventAsync } from '../../store/eventReducer';
import ErrorMessage from './ErrorMessage';
import {  useHistory, useParams } from 'react-router-dom';
import './CreateEventForm.css';
import { fetchGroupDetailsAsync } from '../../store/groupReducer';
import { fetchEventDetailsAsync } from '../../store/eventReducer';

const CreateEventForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams();
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventPrivacy, setEventPrivacy] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  const { eventId } = useParams();
  const groupDetails = useSelector((state) => state.group.groupDetails);
  const eventDetails = useSelector((state) => state.event.eventDetails);

  useEffect(() => {
    dispatch(fetchGroupDetailsAsync(groupId));
  }, [dispatch, groupId]);

    useEffect(() => {
    dispatch(fetchEventDetailsAsync(eventId));
  }, [dispatch, eventId]);


  if(!groupDetails || groupDetails.length === 0|| Object.keys(groupDetails).length === 0 || groupDetails === undefined){
    return <div>Loading...</div>;
  }

  if (!eventDetails || eventDetails === undefined) {
    return <div>Loading...</div>;
  }

  console.log(groupDetails)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = {};

    if (!eventName) {
      errors.eventName = 'Event Name is required';
    }
    if (!eventStartDate) {
      errors.eventStartDate = 'Start Date is required';
    }
    if (!eventEndDate) {
      errors.eventEndDate = 'End Date is required';
    }
    if (eventDescription.length < 30) {
      errors.eventDescription = 'Description must be at least 30 characters long';
    }

    if (!eventType) {
      errors.eventType = 'Event Type is required';
    }
    if (!eventPrivacy) {
      errors.eventPrivacy = 'Event Privacy is required';
    }
    if (!eventPrice) {
      errors.eventPrice = 'Event Price is required';
    } else if (isNaN(eventPrice)) {
      errors.eventPrice = 'Event Price must be a number';
    }

    const imageRegex = /\.(png|jpg|jpeg)$/i;
    if (!eventImageUrl.match(imageRegex)) {
      errors.eventImageUrl = 'Image URL needs to end in png or jpg (or jpeg)';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
     const createdEvent = await dispatch(
        createEventAsync(groupId,{

          name: eventName,
          type: eventType,
          price: eventPrice,
          open: eventPrivacy,
          description: eventDescription,
          startDate: eventStartDate,
          endDate: eventEndDate,
          imageUrl:eventImageUrl
        })
      );
      console.log(createdEvent)
      setEventCreated(true);
      history.push(`/events/${createdEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'eventName':
        setEventName(value);
        break;
      case 'eventType':
        setEventType(value);
        break;
      case 'eventPrivacy':
        setEventPrivacy(value);
        break;
      case 'eventPrice':
        setEventPrice(value);
        break;
      case 'eventStartDate':
        setEventStartDate(value);
        break;
      case 'eventEndDate':
        setEventEndDate(value);
        break;
      case 'eventImageUrl':
        setEventImageUrl(value);
        break;
      case 'eventDescription':
        setEventDescription(value);
        break;
      default:
        break;
    }
  };



  return (
    <section className="create-event-form">
      <form onSubmit={handleSubmit}>
        <h2>Create an event for {groupDetails.name} </h2>

        <div className="form-group">
          <label htmlFor="eventName">What is the name of your event?</label>
          <input
            type="text"
            className = 'create-event-input'
            id="eventName"
            name="eventName"
            value={eventName}
            onChange={handleChange}
            placeholder="Event Name"
          />
          <ErrorMessage message={formErrors.eventName} />
        </div>

        <div className="form-group">
          <label>Is this an in-person or online event?</label>
          <select name="eventType" value={eventType} onChange={handleChange}>
            <option value=""></option>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          <ErrorMessage message={formErrors.eventType} />

          <label>Is this event private or public?</label>
          <select name="eventPrivacy" value={eventPrivacy} onChange={handleChange}>
            <option value=""></option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
          <ErrorMessage message={formErrors.eventPrivacy} />

          <label>What is the price for your event?</label>
          <input
            type="number"
            name="eventPrice"
            value={eventPrice}
            onChange={handleChange}
          />
          <ErrorMessage message={formErrors.eventPrice} />
        </div>

        <div className="form-group">
          <label>When does your event start?</label>
          <input
            type="text"
            className = 'create-event-input'
            name="eventStartDate"
            value={eventStartDate}
            onChange={handleChange}
            placeholder="MM/DD/YYYY HH:mm AM"
          />
          <ErrorMessage message={formErrors.eventStartDate} />
        </div>

        <div className="form-group">
          <label>When does your event end?</label>
          <input
            type="text"
            className = 'create-event-input'
            name="eventEndDate"
            value={eventEndDate}
            onChange={handleChange}
            placeholder="MM/DD/YYYY HH:mm PM"
          />
          <ErrorMessage message={formErrors.eventEndDate} />
        </div>

        <div className="form-group">
          <label>Please add in image URL for your event below:</label>
          <input
            type="text"
            className = 'create-event-input'
            name="eventImageUrl"
            value={eventImageUrl}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <ErrorMessage message={formErrors.eventImageUrl} />
        </div>

        <div className="form-group4">
          <label>Please describe your event</label>
          <textarea
            name="eventDescription"
            value={eventDescription}
            onChange={handleChange}
            placeholder="Please include at least 30 characters"
          />
          <ErrorMessage message={formErrors.eventDescription} />
        </div>

        <button type="submit" disabled={isSubmitting}>
          Create Event
        </button>
      </form>
    </section>
  );
};

export default CreateEventForm;
