import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchGroupDetailsAsync } from '../../store/groupReducer';
import{deleteGroupAsync} from '../../store/items'
import './GroupDetailPage.css';
import { useHistory } from 'react-router-dom';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

const GroupDetailPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { groupId } = useParams();
  const groupDetails = useSelector((state) => state.group.groupDetails);
  const currentUser = useSelector((state) => state.session);
  console.log(groupDetails)

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    dispatch(fetchGroupDetailsAsync(groupId));
  }, [dispatch, groupId]);

  if (!groupDetails) {
    return null;
  }

  const isCurrentUserOrganizer = groupDetails.organizerId === currentUser.user.id;

  const handleDeleteGroup = async () => {
    const deleted = await dispatch(deleteGroupAsync(groupId));
    console.log(deleted)
    if (deleted) {
      history.push('/view-groups');
    }
  };
  return (
    <div className="group-detail-container">
      <Link className="breadcrumb-link" to="/view-groups">Groups</Link>
    <div className="group-detail-header">
      <img className="group-image" src={groupDetails.previewImage} alt={groupDetails.name} />
      <div className="group-detail-info">
        <h2>{groupDetails.name}</h2>
        <p>{groupDetails.city}, {groupDetails.state}</p>
        <p>{groupDetails.numMembers} members · {groupDetails.type === 'In person' ? 'Public' : 'Private'}</p>
        <p>Organized by: {groupDetails.Organizer.firstName} {groupDetails.Organizer.lastName}</p>



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
    ) : (
      <button className="join-group-button">Join this group</button>
    )}
     </div>
     <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onCancel={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteGroup}
      />
</div>
    <div className="group-detail-description">
        <h3>What we're about</h3>
        <p>{groupDetails.about}</p>
    </div>
  </div>
  );
};

export default GroupDetailPage;
