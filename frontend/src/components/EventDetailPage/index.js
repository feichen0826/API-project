import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEventDetailsAsync } from '../../store/eventReducer';
import { useParams, Link, useHistory } from 'react-router-dom';
import DeleteEventConfirmationModel from '../DeleteEventConfirmationModel'
import { deleteEventAsync } from '../../store/eventReducer';
import './EventDetailPage.css';

const formatDateAndTime = (dateTime) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  const formattedDate = new Date(dateTime).toLocaleDateString(undefined, options);
  const formattedTime = new Date(dateTime).toLocaleTimeString(undefined, options);

  return `${formattedDate} `;
};

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

  if (!eventDetails || eventDetails === undefined) {
    return <div>Loading...</div>;
  }
  if (!eventDetails.Group) {
    return null;
  }
  const isCurrentUserLoggedIn = currentUser && currentUser.user;
  const isCurrentUserEventOrganizer =
  isCurrentUserLoggedIn && currentUser.user.id === eventDetails.Group.organizerId;

  const handleDeleteEvent = async () => {
    try {
      await dispatch(deleteEventAsync(eventId));
      history.push('/view-events');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const { name, startDate, startTime, endDate, endTime, price, venue, description, Group } = eventDetails;

  // console.log(eventDetails.Group.GroupImages[0].url)

  return (
    <div className="event-detail-container">
      <Link to="/view-events">Event</Link>
      <h2 className="event-title">{name}</h2>
      <p className="event-hosted-by">Hosted by: {eventDetails.Group.Organizer.firstName} {eventDetails.Group.Organizer.lastName}</p>
      <div className="event-content-container">
      <div className="event-content">
      <img  className="event-image" src={eventDetails.EventImages[0]} alt={name} />
      <div className="event-info-box">
      <div className="event-info-top">
            <div>
              <div className="group-entry" onClick={() => history.push(`/groups/${Group.id}`)}>
              {eventDetails.Group.GroupImages[0] ? (
                    <img className="group-image2" src={eventDetails.Group.GroupImages[0].url} alt={Group.name} />
                  ) : (
                    <div className="group-image-placeholder">No Image</div>
                  )}
                <div className="group-info">
                  <span className="group-name">{Group.name}</span>
                  <span className="group-status">{Group.open ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>

            </div>
            <div className="event-info-bottom">
              <div className='event-bottom'>
              <div>
                <i className="fas fa-clock" ></i>
              </div>
              <div>
                START: {formatDateAndTime(startDate)}
              </div>
              <div>
                END: {formatDateAndTime(endDate)}
              </div>
              <div className="event-info-item">
                <i className="fas fa-money-bill-wave"></i> {price === 0 ? 'FREE' : `$${price}`}
              </div>
              <div className="event-info-item">
                <i className="fas fa-map-pin"></i> {eventDetails.type}
              </div>
              {isCurrentUserLoggedIn && currentUser.user.id === Group.organizerId && (
      <div className="event-actions">
      {isCurrentUserEventOrganizer && (
        <>
          <button className="dark-grey-button" onClick={() => setConfirmationModalOpen(true)}>
            Delete
          </button>
          {/* Add an "Update" button here */}
          <button className="dark-grey-button">Update</button>
          {isConfirmationModalOpen && (
            <DeleteEventConfirmationModel
              title="Confirm Delete"
              message="Are you sure you want to remove this event?"
              onConfirm={handleDeleteEvent}
              onCancel={() => setConfirmationModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
      )}
            </div>
            </div>
          </div>
        </div>
        <div className="event-description-container">
        <h3 className="event-description-title">Description</h3>
        <p className="event-description">{description}</p>
      </div>
      </div>

    </div>
  );
};

export default EventDetailPage;
