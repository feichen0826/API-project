import { csrfFetch } from "./csrf";

// Action types
const FETCH_ALL_GROUPS = 'group/fetchAllGroups';
const FETCH_GROUP_DETAILS = 'group/fetchOneGroup';


const CREATE_GROUP_REQUEST = 'group/createGroupRequest';
const CREATE_GROUP_SUCCESS = 'group/createGroupSuccess';
const CREATE_GROUP_FAILURE = 'group/createGroupFailure';
const UPDATE_GROUP = 'UPDATE_GROUP'
const DELETE_GROUP_REQUEST = 'group/deleteGroupRequest';
const DELETE_GROUP_SUCCESS = 'group/deleteGroupSuccess';
const DELETE_GROUP_FAILURE = 'group/deleteGroupFailure';
const REMOVE_ITEM = "items/REMOVE_ITEM";

// Action creators
const fetchAllGroups = (groups) => {
  return {
    type: FETCH_ALL_GROUPS,
    groups,
  };
};

const fetchGroupDetails = group =>{
  return {
    type: FETCH_GROUP_DETAILS,
    group
  }
}

const createGroupRequest = () => ({
  type: CREATE_GROUP_REQUEST,
});

const createGroupSuccess = (group) => ({
  type: CREATE_GROUP_SUCCESS,
  group,
});

const createGroupFailure = (error) => ({
  type: CREATE_GROUP_FAILURE,
  error,
});

const updateGroup = (groupData) => ({
  type: UPDATE_GROUP,
  payload: groupData,
});

const deleteGroupRequest = (groupId) => ({
  type: DELETE_GROUP_REQUEST,
  groupId
});

const deleteGroupSuccess = (groupId) => ({
  type: DELETE_GROUP_SUCCESS,
  groupId
});

const deleteGroupFailure = (error) => ({
  type: DELETE_GROUP_FAILURE,
  error,
});

const remove = (groupId) => ({
  type: REMOVE_ITEM,
  groupId
});

// Thunk action creator
export const fetchAllGroupsAsync = () => async (dispatch) => {

    const response = await fetch('/api/groups');
    const groupsData = await response.json();
    dispatch(fetchAllGroups(groupsData));

};

export const fetchGroupDetailsAsync = (groupId)=> async(dispatch) =>{
  const response = await csrfFetch(`/api/groups/${groupId}`)

  if(response.ok){
    const group = await response.json()
    // const organizerResponse = await fetch(`/api/users/${group.organizerId}`);
    // const organizerData = await organizerResponse.json();
    // group.Organizer = organizerData;
    dispatch(fetchGroupDetails(group))
  }
}

export const createGroupAsync = (groupData) => async (dispatch) => {
  try {
    dispatch(createGroupRequest());

    const response = await csrfFetch('/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify(groupData),
    });

    if (!response.ok) {
      throw new Error('Failed to create group');
    }

    const createdGroup = await response.json();
    dispatch(createGroupSuccess(createdGroup));

    return createdGroup
  } catch (error) {
    dispatch(createGroupFailure(error.message));
  }
};

export const updateGroupAsync = (groupData) => async (dispatch) => {
  try {
    const apiUrl = `/api/groups/${groupData.id}`;
    const updateData = {
      name: groupData.name,
      about: groupData.about,
      type: groupData.type,
      private: groupData.private,
      city: groupData.city,
      state: groupData.state,
    };
    const response = await csrfFetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const updatedGroup = await response.json();
      dispatch(updateGroup(updatedGroup));
      return updatedGroup;
    } else {
      console.error('Error updating group:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error updating group:', error);
  }
};

export const deleteGroupAsync = (groupId) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    const { id: deletedGroupId } = await response.json();
    dispatch(remove(deletedGroupId));
    return true;
  }
};

//Reducer
const initialState = {
  allGroups: [], // Initialize as an empty array
  createErrors: {},
  isLoading: false,
  };

  const groupReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ALL_GROUPS:
        return {
          ...state,
          allGroups: action.groups
        };
      case FETCH_GROUP_DETAILS:
        return {
          ...state,
          groupDetails: action.group,
        };
      case CREATE_GROUP_REQUEST:
        return {
          ...state,
          isLoading: true,
          createErrors: {},
        };
      case CREATE_GROUP_SUCCESS:
        return {
          ...state,
          isLoading: false,
        };
      case CREATE_GROUP_FAILURE:
        return {
          ...state,
          isLoading: false,
          createErrors: {
            overall: action.error,
        },
      };

      case UPDATE_GROUP:

        return {
          ...state,

        };

      case REMOVE_ITEM:
        const newState = { ...state };
        delete newState.allGroups[action.groupId];
        return newState;
      //     const updatedGroups = state.allGroups.filter((group) => group.id !== action.groupId);
      // return {
      //   ...state,
      //   allGroups: updatedGroups,
      // };

      default:
        return state;
    }
  };

  export default groupReducer;
