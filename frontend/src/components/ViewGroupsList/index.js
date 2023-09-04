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
       <nav className='events-groups'>
        <div className='view-events-link'>
         <NavLink to="/view-events" activeClassName='active-link'>Events</NavLink>
         </div>
        <div className='view-groups-link'>
        <NavLink to="/view-groups" activeClassName='active-link'>Groups</NavLink>
        </div>
        </nav>
        <div className='groups-in-meetup'>
      <p>Groups in Meetup</p>
      </div>
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
