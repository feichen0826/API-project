import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllGroupsAsync } from '../../store/groupReducer';
import { Link, NavLink, Route, useParams} from 'react-router-dom';
import './ViewGroupsList.css'

const ViewGroupsList = () => {
  const dispatch = useDispatch();
  const allGroups = useSelector((state) => state.group.allGroups);
  console.log(allGroups)

  useEffect(() => {
    dispatch(fetchAllGroupsAsync());
  }, [dispatch]);

  if (allGroups.length === 0) {
    return null;
  }

  return (
    <div>
       <nav>
        <NavLink to="/view-groups">Groups</NavLink>
        <NavLink to="/view-events">Events</NavLink>
        </nav>
      <h4>Groups in Meetup</h4>

        {allGroups.Groups.map((group) => {
          return (
          <NavLink key={group.id} to={`/groups/${group.id}`}>
            <div className='group-image-box'>
             <img src={group.previewImage} alt='' />
             <div className='group-info'>
                <h3>{group.name}</h3>
                <p>{group.city}, {group.state}</p>
                <p>{group.about}</p>
                <p>{group.numMembers} members</p>
                <p>{group.type === 'In person' ? 'Public' : 'Private'}</p>
                {group.Organizer && (
                  <p>Organized by: {group.Organizer.firstName} {group.Organizer.lastName}</p>
                )}
              </div>
              </div>
          </NavLink>
          )
        })}

    </div>
  );
};

export default ViewGroupsList;
