import {
  GET_PRODUCTS,
  RESET_PRODUCTS,
  RESET_CATEGORIES,
  GET_CATEGORIES,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  UPLOAD_PRODUCTS,
  GET_DETAIL_PRODUCT,
} from '../actions/types';

const initialState = {
  categories: [],
  trademarks: [],
  presentations: [],
  metaproducts: [],
  products: [],
  detail: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPLOAD_PRODUCTS:
      return {
        ...state,
        products: state.products.concat(action.payload),
      };
    case RESET_CATEGORIES:
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: state.products.concat(action.payload),
      };
    case UPDATE_PRODUCT:
      const products = state.products.map((item) => {
        if (item.id === action.payload.id) return { ...action.payload };
        return item;
      });
      return {
        ...state,
        products: products,
      };
    case RESET_PRODUCTS:
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case GET_DETAIL_PRODUCT:
      return {
        ...state,
        detail: action.payload,
      };
    default:
      return state;
  }
}
