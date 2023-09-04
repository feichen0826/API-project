import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEventDetailsAsync } from '../../store/eventReducer';
import { useParams, Link, useHistory } from 'react-router-dom';
import DeleteEventConfirmationModel from '../DeleteEventConfirmationModel'
import { deleteEventAsync } from '../../store/eventReducer';
import './EventDetailPage.css';

const EventDetailPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventId } = useParams();
  const eventDetails = useSelector((state) => state.event.eventDetails);
  const currentUser = useSelector((state) => state.session);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEventDetailsAsync(eventId));
  }, [dispatch, eventId]);

  if (!eventDetails) {
    return null
  }
  const handleDeleteEvent = async () => {
    try {
      await dispatch(deleteEventAsync(eventId));
      history.push('/view-events');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const { name, startDate, startTime, endDate, endTime, price, venue, description, Group } = eventDetails;

  console.log('Current User:', currentUser.user.id);
  console.log('Event Organizer ID:', Group.organizerId);
  return (
    <div className="event-detail-container">
      <Link to="/view-events">Event</Link>
      <h2>{name}</h2>
      <p>Hosted by: {eventDetails.Group.Organizer.firstName} {eventDetails.Group.Organizer.lastName}</p>
      <img src={eventDetails.previewImage} alt={name} />
      <div className="event-info-box">
        <div className="event-info-item">
          <i className="fas fa-clock"></i> START · {startDate} · {startTime} <span className="dot">·</span> END · {endDate} · {endTime}
        </div>
        <div className="event-info-item">
          <i className="fas fa-money-bill-wave"></i> {price === 0 ? 'FREE' : `$${price}`}
        </div>
        <div className="event-info-item">
          <i className="fas fa-map-pin"></i> {venue}
        </div>
        <div className="event-info-item">
          <h3>Description</h3>
          <p>{description}</p>
        </div>
      </div>
      {currentUser && currentUser.user.id === Group.organizerId && (
        <div className="event-actions">
          {/* <button className="dark-grey-button">Update</button> */}
          <button className="dark-grey-button" onClick={() => setConfirmationModalOpen(true)}>Delete</button>
        {isConfirmationModalOpen && (
        <DeleteEventConfirmationModel
          title="Confirm Delete"
          message="Are you sure you want to remove this event?"
          onConfirm={handleDeleteEvent}
          onCancel={() => setConfirmationModalOpen(false)}
        />
      )}
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
