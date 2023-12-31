import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateGroupAsync } from '../../store/groupReducer'
import ErrorMessage from './ErrorMessage';
import './EditGroupForm.css'; // You can create a separate CSS file for styling

const EditGroupForm = ( { groupData } ) => {
    const dispatch = useDispatch();
  const history = useHistory();
  const { createErrors } = useSelector((state) => state.group);
  const [location, setLocation] = useState('');
//   const [city, setCity] = useState('');
//     const [state, setState] = useState('');
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [groupType, setGroupType] = useState('');
  const [visibilityType, setVisibilityType] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { groupId } = useParams()
  const handleSubmit = async (e) => {
    e.preventDefault();


    const errors = {};

    if (!location) {
      errors.location = 'Location is required';
    }

    if (!name) {
      errors.name = 'Name is required';
    }
    if (about.length < 30) {
      errors.about = 'Description must be at least 30 characters long';
    }
    if (!groupType) {
      errors.groupType = 'Group Type is required';
    }
    if (!visibilityType) {
      errors.visibilityType = 'Visibility Type is required';
    }


    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    let splitLocation = location.split(', ');
    let cityValue = '';
    let stateValue = '';

    if (splitLocation.length > 1) {
      cityValue = splitLocation[0];
      stateValue = splitLocation[1];
    } else {

      if (location) {
        stateValue = location;
        cityValue = location
      }
    }

    const groupUpdateData = {
      id: groupId,
    city: cityValue,
     state: stateValue,
      name,
      about,
      type: groupType,
      private: visibilityType === 'Private',
    };

      const updatedGroup = await dispatch(updateGroupAsync(groupUpdateData));
      console.log(updatedGroup)
      if (updatedGroup) {
        history.push(`/groups/${updatedGroup.id}`);
      }

  };

  const [errors, setErrors] = useState({});

  return (
    <section className="edit-group-form">
      <form onSubmit={handleSubmit}>
      <div className='update-group-into'>
            <p className='update-your-info'>UPDATE YOUR GROUP'S INFORMATION</p>
            <label className='we-will-update'>We'll walk you through a few steps to update your group's information</label>
        </div>
        <div className="form-group5">
          <label htmlFor="location">First, set your group's location</label>
          <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
          <input
            type="text"
            id="location"
            value={location}
            className='update-group-input'
            onChange={(e) => setLocation(e.target.value)}
          />
          <ErrorMessage message={errors.location} />
        </div>
        <div className="form-group5">
          <label htmlFor="name">What is the name of your group?</label>
          <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative!</p>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='update-group-input'
          />
          <ErrorMessage message={errors.name} />
        </div>

        <div className="form-group5">
          <label htmlFor="about">Now describe what your group will be about</label>
          <p>People will see this when we promote your group, but you'll be able to add to it later, too.
1, What's the purpose of the group? 2. Who should join?
3. What will you do at your events?</p>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <ErrorMessage message={errors.about} />
        </div>

        <div className="form-group5">
          <label htmlFor="groupType">Final steps...</label>
          <p>Is this an in person or online group?</p>
          <select
            id="groupType"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
          >
            <option value=""></option>
            <option value="In person">In Person</option>
            <option value="Online">Online</option>
          </select>
          <ErrorMessage message={errors.groupType} />

          <p>Is this group private or public?</p>
          <select
            id="visibilityType"
            value={visibilityType}
            onChange={(e) => setVisibilityType(e.target.value)}
          >
            <option value=""></option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
          <ErrorMessage message={errors.visibilityType} />

          <p>Please add an image URL for your group below:</p>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className='update-group-input'
          />
          <ErrorMessage message={errors.imageUrl} />
        </div>

        <button type="submit" className="update-group-button">
          Update Group
        </button>
      </form>
    </section>
  );
};

export default EditGroupForm;
