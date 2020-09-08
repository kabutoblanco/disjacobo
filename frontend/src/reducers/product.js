import {
  GET_PRODUCTS,
  RESET_PRODUCTS,
  GET_METAPRODUCTS,
  RESET_METAPRODUCTS,
  RESET_CATEGORIES,
  RESET_TRADEMARKS,
  GET_CATEGORIES,
  GET_TRADEMARKS,
  ADD_METAPRODUCT,
  GET_PRESENTATIONS,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
} from '../actions/types';

const initialState = {
  categories: [],
  trademarks: [],
  presentations: [],
  metaproducts: [],
  products: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RESET_CATEGORIES:
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case RESET_TRADEMARKS:
    case GET_TRADEMARKS:
      return {
        ...state,
        trademarks: action.payload,
      };
    case GET_PRESENTATIONS:
      return {
        ...state,
        presentations: action.payload,
      };
    case ADD_METAPRODUCT:
      return {
        ...state,
        metaproducts: state.metaproducts.concat(action.payload),
      };
    case RESET_METAPRODUCTS:
    case GET_METAPRODUCTS:
      return {
        ...state,
        metaproducts: action.payload,
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: state.products.concat(action.payload),
      };
    case UPDATE_PRODUCT:
      const products = state.products.map((item) => {
        if (item.id === action.payload.id)
          return { ...action.payload };
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
    default:
      return state;
  }
}
