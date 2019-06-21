import { SET_SESSION } from './types';

const initialState = {
  address: localStorage.getItem('address'),
  name: localStorage.getItem('name'),
  privateKey: localStorage.getItem('privateKey'),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
