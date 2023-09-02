import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createGroupAsync } from '../../store/groupReducer';
import ErrorMessage from './ErrorMessage';
import './CreateGroupForm.css';

const CreateGroupForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { createErrors } = useSelector((state) => state.group);
  const [location, setLocation] = useState('');
//   const [city, setCity] = useState('');
//     const [state, setState] = useState('');
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [groupType, setGroupType] = useState('');
  const [visibilityType, setVisibilityType] = useState('Private');
  const [imageUrl, setImageUrl] = useState('');

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
    if (!imageUrl.match(/\.(jpg|png)$/i)) {
      errors.imageUrl = 'Image URL needs to end in jpg or png';
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

    const groupData = {
      city: cityValue,
      state: stateValue,
      name,
      about,
      type: groupType,
      private: visibilityType === 'Private',
      imageUrl,
    };

   const  createdGroup = await dispatch(createGroupAsync(groupData))
    console.log(createdGroup)

      if (createdGroup) {
        history.push(`/groups/${createdGroup.id}`);
      }

  };

  const [errors, setErrors] = useState({});

  return (
    <section className="create-group-form">
      <form onSubmit={handleSubmit}>
        <div>
            <p>BECOME AN ORGANIZER</p>
            <label>We'll walk you through a few steps to build your local community</label>
        </div>
        <div className="form-group">
          <label htmlFor="location">First, set your group's location</label>
          <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <ErrorMessage message={errors.location} />
        </div>
        <div className="form-group">
          <label htmlFor="name">What will your group's name be?</label>
          <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <ErrorMessage message={errors.name} />
        </div>

        <div className="form-group">
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

        <div className="form-group">
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
        </div>
        <div className="form-group">
          <p>Is this group private or public?</p>
          <select
            id="visibilityType"
            value={visibilityType}
            onChange={(e) => setVisibilityType(e.target.value)}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
          <ErrorMessage message={errors.visibilityType} />
        </div>
        <div className="form-group">
          <p>Please add an image URL for your group below:</p>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <ErrorMessage message={errors.imageUrl} />
        </div>

        <button type="submit" className='create-group-button'>Create group</button>
      </form>
    </section>
  );
};

export default CreateGroupForm;
