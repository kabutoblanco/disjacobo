import { ADD_SALE, ADD_BUY, GET_SALES, GET_BUYS, RESET_SALES, GET_DETAILS, GET_STATITICS } from '../actions/types';

const initialState = {
  sales: [],
  buys: [],
  details: [],
  statitics: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_STATITICS:
      return {
        ...state,
        statitics: action.payload,
      };
    case RESET_SALES:
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
    case GET_DETAILS:
      return {
        ...state,
        details: action.payload,
      };
    default:
      return state;
  }
}
