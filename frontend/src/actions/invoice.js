import axios from 'axios';

import {
  GET_SALES,
  ADD_SALE,
  GET_BUYS,
  ADD_BUY,
  ACTION_RUNNING,
  ACTION_END,
} from './types';
import { createMessage, returnErrors } from './messages';

export const addSale = (data) => (dispatch) => {
  dispatch({ type: ACTION_RUNNING });
  axios
    .post(`/api/sale/add`, data)
    .then((res) => {
      dispatch({
        type: ADD_SALE,
        payload: res.data,
      });
      dispatch({ type: ACTION_END });
      dispatch(createMessage({ addSale: 'Factura de venta registrada' }));
    })
    .catch((err) => {
      dispatch(
        returnErrors({
          non_field_errors: ['Operacion no realizada'],
          status: 400,
        })
      );
      dispatch({ type: ACTION_END });
    });
};

export const getSales = (date) => (dispatch) => {
  axios
    .get(`/api/sale/${date}`)
    .then((res) => {
      dispatch({
        type: GET_SALES,
        payload: res.data.sales,
      });
    })
    .catch((err) => console.log(err));
};

export const addBuy = (data) => (dispatch) => {
  dispatch({ type: ACTION_RUNNING });
  axios
    .post(`/api/buy/add`, data)
    .then((res) => {
      dispatch({
        type: ADD_BUY,
        payload: res.data,
      });
      dispatch({ type: ACTION_END });
      dispatch(createMessage({ addSale: 'Factura de compra registrada' }));
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: ACTION_END });
    });
};

export const getBuys = (date) => (dispatch) => {
  axios
    .get(`/api/buy/${date}`)
    .then((res) => {
      dispatch({
        type: GET_BUYS,
        payload: res.data.buys,
      });
    })
    .catch((err) => console.log(err));
};
