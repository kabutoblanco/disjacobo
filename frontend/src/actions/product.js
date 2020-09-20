import axios from 'axios';

import {
  GET_PRODUCTS,
  RESET_PRODUCTS,
  ADD_PRODUCT,
  GET_CATEGORIES,
  ACTION_RUNNING,
  ACTION_END,
  UPDATE_PRODUCT,
  UPLOAD_PRODUCTS,
  GET_DETAIL_PRODUCT,
} from './types';
import { createMessage, returnErrors } from './messages';

export const uploadProducts = (cvs_file) => (dispatch) => {
  dispatch({ type: ACTION_RUNNING });
  const form_data = new FormData();
  form_data.append('csv_file', cvs_file[0], cvs_file[0].name);
  form_data.append('title', 'file');
  form_data.append('content', 'csv');
  axios
    .post('/api/product/upload', form_data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      dispatch({
        type: UPLOAD_PRODUCTS,
        payload: res.data.products,
      });
      dispatch({ type: ACTION_END });
      dispatch(createMessage({ addSale: 'Productos registrado' }));
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: ACTION_END });
    });
};

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

export const getDetail = (id) => (dispatch) => {
  axios
    .get(`/api/product/${id}/detail`)
    .then((res) => {
      dispatch({
        type: GET_DETAIL_PRODUCT,
        payload: res.data.detail,
      });
    })
    .catch((err) => console.log(err));
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
