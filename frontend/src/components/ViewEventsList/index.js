import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllEventsAsync } from '../../store/eventReducer';
import { Link, NavLink, Route, useParams} from 'react-router-dom';
import './ViewEventsList.css';

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

  return `${formattedDate}`;
};

const ViewEventsList = () => {
  const dispatch = useDispatch();
  const eventsObj = useSelector((state) => state.event.events);
  const eventsArr = Object.values(eventsObj)
  const events = eventsArr[0]
  console.log(eventsObj)

  useEffect(() => {
    dispatch(fetchAllEventsAsync());
  }, [dispatch]);

  if (!events || events.length === 0 || events === undefined) {
    return <div>Loading events...</div>;
  }

  // if (Object.keys(eventsObj).length === 0) {
  //   return null;
  // }

  // if (!eventsObj.Event || eventsObj.Event.length === 0) {
  //   return null;
  // }
  console.log(events)

  return (
    <div className="events-list-container">
       <nav className='events-groups'>
        <div className='view-events-link2'>
          <NavLink to="/view-events" activeClassName='active-link'>Events</NavLink>
        </div>
        <div className='view-groups-link2'>
          <NavLink to="/view-groups" activeClassName='active-link'>Groups</NavLink>
        </div>
      </nav>
      <div className='groups-in-meetup'>
        <p>Events in Meetup</p>
      </div>

      <div className="events-list-box">
        {events.map((event) => (


            <NavLink to={`/events/${event.id}`}>
               <div className="event-item">
            <div className="event-content">
                <div className="event-thumbnail">
                  <img src={event.previewImage} alt="" />

                </div>
                <div className="event-details">
                  <p>{formatDateAndTime(event.startDate)}</p>
                  <h2>{event.name}</h2>
                  {event.Venue && event.Venue.city && event.Venue.state && (
            <p>
              Location: {event.Venue.city}, {event.Venue.state}
            </p>
          )}


                </div>
          </div>
          </div>
              <p className="event-description2">{event.description}</p>

            </ NavLink>

        ))}
      </div>
    </div>
  );
};

export default ViewEventsList;
