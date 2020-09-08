import {
  USER_LOADED,
  USER_LOADING,
  LOGIN_SUCCESS,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  ACTION_RUNNING,
  ACTION_END,
  GET_PROVIDERS,
  GET_CLIENTS,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  isRunning: false,
  user: null,
  providers: [],
  clients: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PROVIDERS:
      return {
        ...state,
        providers: action.payload,
      };
    case GET_CLIENTS:
      return {
        ...state,
        clients: action.payload,
      };
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case ACTION_RUNNING:
      return {
        ...state,
        isRunning: true,
      };
    case ACTION_END:
      return {
        ...state,
        isRunning: false,
      };
    default:
      return state;
  }
}
