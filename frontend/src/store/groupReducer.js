// Action types
const FETCH_ALL_GROUPS = 'group/fetchAllGroups';

// Action creators
export const fetchAllGroups = (groups) => {
  return {
    type: FETCH_ALL_GROUPS,
    groups,
  };
};

// Thunk action creator
export const fetchAllGroupsAsync = () => async (dispatch) => {
  try {
    const response = await fetch('/api/groups'); // Replace with your API endpoint
    const groupsData = await response.json();
    dispatch(fetchAllGroups(groupsData));
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
};


//Reducer
const initialState = {
    allGroups: [],
  };

  const groupReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ALL_GROUPS:
        return {
          ...state,
          allGroups: action.groups,
        };
      default:
        return state;
    }
  };

  export default groupReducer;
