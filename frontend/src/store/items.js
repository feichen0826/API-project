import { csrfFetch } from "./csrf";

export const REMOVE_ITEM = "items/REMOVE_ITEM";

const remove = (groupId) => ({
    type: REMOVE_ITEM,
    groupId
  });

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



  const initialState = {};

  const itemsReducer = (state = initialState, action) => {
    switch (action.type) {
        case REMOVE_ITEM:
        const newState = { ...state };
        delete newState[action.itemId];
        return newState;
        default:
            return state;
        }
      };

export default itemsReducer;
