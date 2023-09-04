import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllEventsAsync } from '../../store/eventReducer';
import { Link, NavLink, Route, useParams} from 'react-router-dom';
import './ViewEventsList.css';

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

  return (
    <div className="events-list-container">
       <nav className='events-groups'>
        <div className='view-events-link'>
          <NavLink to="/view-events" activeClassName='active-link'>Events</NavLink>
        </div>
        <div className='view-groups-link'>
          <NavLink to="/view-groups" activeClassName='active-link'>Groups</NavLink>
        </div>
      </nav>
      <div className='groups-in-meetup'>
        <p>Events in Meetup</p>
      </div>

      <ul className="events-list">
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <NavLink to={`/events/${event.id}`}>
            <div className="event-thumbnail">
              <img src={event.previewImage} alt='' />
            </div>
            <div className="event-details">
            <p>{event.startDate}  ·  {event.startTime}</p>
              <h3>{event.name}</h3>

              <p>{event.venue}</p>
              <p>{event.description}</p>
            </div>
            </ NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewEventsList;
