import { ADD_SALE, ADD_BUY, GET_SALES, GET_BUYS } from '../actions/types';

const initialState = {
  sales: [],
  buys: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SALES:
      return {
        ...state,
        sales: action.payload,
      };
    case GET_BUYS:
      return {
        ...state,
        buys: action.payload,
      };
    case ADD_SALE:
      return {
        ...state,
        sales: state.sales.concat(action.payload),
      };
    case ADD_BUY:
      return {
        ...state,
        buys: state.buys.concat(action.payload),
      };
    default:
      return state;
  }
}
