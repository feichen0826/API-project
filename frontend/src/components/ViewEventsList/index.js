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
  console.log(eventsArr)

  useEffect(() => {
    dispatch(fetchAllEventsAsync());
  }, [dispatch]);

  if (events === undefined) {
    return null;
  }

  return (
    <div className="events-list-container">
        <nav>
        <NavLink to="/view-groups">Groups</NavLink>
        <NavLink to="/view-events">Events</NavLink>
        </nav>
      <p className="caption">Events in Meetup</p>
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
