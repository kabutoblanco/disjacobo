import { combineReducers } from 'redux';

import auth from './auth';
import messages from './messages';
import errors from './errors';
import product from './product';
import invoice from './invoice';

export default combineReducers({
  auth,
  product,
  messages,
  invoice,
  errors,
});
