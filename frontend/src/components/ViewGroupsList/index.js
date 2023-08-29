import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllGroupsAsync } from '../../store/groupReducer';

const ViewGroupsList = () => {
  const dispatch = useDispatch();
  const allGroups = useSelector((state) => state.group.allGroups);

  useEffect(() => {
    dispatch(fetchAllGroupsAsync());
  }, [dispatch]);

  return (
    <div>
      <h1>Groups in Meetup</h1>
      <ul>
        {allGroups.map((group) => (
          <li key={group.id}>
            {/* Render group details */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewGroupsList;
