import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducer from './reducers';

export default applyMiddleware(reduxThunk)(createStore)(reducer);
