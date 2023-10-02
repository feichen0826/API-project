import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchGroupDetailsAsync } from '../../store/groupReducer';
import{deleteGroupAsync} from '../../store/items'
import './GroupDetailPage.css';
import { useHistory } from 'react-router-dom';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

const formatDateAndTime = (dateTime) => {
  const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const date = new Date(dateTime);

  const formattedDate = date.toLocaleDateString(undefined, dateOptions);
  const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

  return `${formattedDate}  ·  ${formattedTime}`;
};

const GroupDetailPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { groupId } = useParams();
  const groupDetails = useSelector((state) => state.group.groupDetails);
  const currentUser = useSelector((state) => state.session);
  const eventDetails = useSelector((state) => state);
  console.log(groupDetails)



  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    dispatch(fetchGroupDetailsAsync(groupId));
  }, [dispatch, groupId]);

  if (!groupDetails) {
    return null;
  }

  const isCurrentUserOrganizer = currentUser.user && groupDetails.organizerId === currentUser.user.id;
  const isCurrentUserLoggedIn = currentUser.user !== null;

  const handleDeleteGroup = async () => {
    try {
      const deleted = await dispatch(deleteGroupAsync(groupId));
      console.log(deleted)
      if (deleted) {
        history.push('/view-groups');

      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleJoinGroup = () => {
    window.alert("Feature coming soon");
  };


  const groupEvents = groupDetails.Events || [];
  console.log(groupEvents)


   const sortedEvents = groupEvents.slice().sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA - dateB;
  });


  const upcomingEvents = sortedEvents.filter((event) => new Date(event.startDate) > new Date());
  const pastEvents = sortedEvents.filter((event) => new Date(event.startDate) < new Date());
  console.log(groupEvents)


  return (
    <div className="group-detail-container">
      <Link className="breadcrumb-link" to="/view-groups"> Groups </Link>
    <div className="group-detail-header">
    {groupDetails && groupDetails.GroupImages && groupDetails.GroupImages[0] ? (
          <img className="group-image" src={groupDetails?.GroupImages[0]?.url} alt={groupDetails.name} />
        ) : (
          <div className="group-image-placeholder">No Image</div>
        )}
      <div className="group-detail-info">
        <h2>{groupDetails.name}</h2>
        <p>{groupDetails.city}, {groupDetails.state}</p>
        <p>{groupEvents.length} events · {groupDetails.type === 'In person' ? 'Public' : 'Private'}</p>
        <p>Organized by: {groupDetails.Organizer && `${groupDetails.Organizer.firstName} ${groupDetails.Organizer.lastName}`}</p>



    {isCurrentUserOrganizer ? (
      <div className="group-detail-buttons">
            <Link className="create-event-button" to={`/create-event/${groupDetails.id}`}>
              Create Event
            </Link>
        <Link className="update-button" to={`/groups/${groupDetails.id}/edit`}>
              Update
        </Link>
        <button className="delete-button" onClick={() => setShowDeleteConfirmation(true)}>
              Delete
        </button>
      </div>
    ) : isCurrentUserLoggedIn ? (
      <button className="join-group-button" onClick={handleJoinGroup}>Join this group</button>
    ) : null }
     </div>
     <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onCancel={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteGroup}
      />
</div>
    <div className='background-grey'>
    <div className="group-detail-description">
        <h3>What we're about</h3>
        <p>{groupDetails.about}</p>
    </div>

    <div className='upcoming-event'>
      <h3>Upcoming Events({upcomingEvents.length})</h3>
      {upcomingEvents.length > 0 && (
      groupEvents.map((ele, index) => (
        <div className='upcoming-event-container' key={index}>
          <Link to={`/events/${ele.id}`}>
         <div className='upcoming-event-card'>
          <div className='upcoming-event-image'>
          {ele.EventImages && ele.EventImages.length > 0 ? (
            <img className= "upcoming-event-image" src={ele.EventImages[0].url} alt='' />
          ) : (
            <p>No Image Available</p>
          )}
          </div>
          <div className='groupEvent-info'>
           <p className='groupEvent-startDate'>{formatDateAndTime(ele.startDate)}</p>
           <p>{ele.name}</p>
           <p>{groupDetails.city}</p>
          </div>


       </div>
        <p>{ele.description}</p>
        </Link>
        </div>
      ))
      )}
       <h3>Past Events ({pastEvents.length})</h3>

  {pastEvents.map((ele, index) => (
    <div className="upcoming-event-container" key={index}>
      <Link to={`/events/${ele.id}`}>
      <div className='upcoming-event-card'>
      <div className='upcoming-event-image'>
      {ele.EventImages && ele.EventImages.length > 0 ? (
            <img className= "upcoming-event-image" src={ele.EventImages[0].url} alt='' />
          ) : (
            <p>No Image Available</p>
          )}
        </div>
        <div className="groupEvent-info">
          <p className="groupEvent-startDate">{formatDateAndTime(ele.startDate)}</p>
          <p>{ele.name}</p>
          <p>{groupDetails.city}</p>
          </div>
        </div>
        <p>{ele.description}</p>
        </Link>
    </div>
  ))}
    </div>
    )}
  </div>
  </div>
  );
};

export default GroupDetailPage;
