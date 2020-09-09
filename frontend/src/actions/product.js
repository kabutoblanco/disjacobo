import axios from 'axios';

import {
  GET_PRODUCTS,
  RESET_PRODUCTS,
  ADD_PRODUCT,
  GET_METAPRODUCTS,
  RESET_METAPRODUCTS,
  ADD_METAPRODUCT,
  GET_CATEGORIES,
  GET_TRADEMARKS,
  GET_PRESENTATIONS,
  ACTION_RUNNING,
  ACTION_END,
  UPDATE_PRODUCT,
} from './types';
import { createMessage, returnErrors } from './messages';

export const addProduct = (data) => (dispatch) => {
  dispatch({ type: ACTION_RUNNING });
  axios
    .post(`/api/product/add`, data)
    .then((res) => {
      dispatch({
        type: ADD_PRODUCT,
        payload: res.data.product,
      });
      dispatch({ type: ACTION_END });
      dispatch(createMessage({ addSale: 'Producto registrado' }));
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: ACTION_END });
    });
};

export const updateProduct = (id, data) => (dispatch) => {
  dispatch({ type: ACTION_RUNNING });
  axios
    .post(`/api/product/${id}`, data)
    .then((res) => {
      dispatch({
        type: UPDATE_PRODUCT,
        payload: res.data.product,
      });
      dispatch({ type: ACTION_END });
      dispatch(createMessage({ addSale: 'Producto actualizado' }));
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: ACTION_END });
    });
};

export const getProducts = (category) => (dispatch) => {
  axios
    .get(`/api/product/${category}/category`)
    .then((res) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: res.data.products,
      });
    })
    .catch((err) => console.log(err));
};

export const resetProducts = () => (dispatch) => {
  dispatch({
    type: RESET_PRODUCTS,
    payload: [],
  });
};

export const getCategories = () => (dispatch) => {
  axios
    .get(`/api/category`)
    .then((res) => {
      dispatch({
        type: GET_CATEGORIES,
        payload: res.data.categories,
      });
    })
    .catch((err) => console.log(err));
};
