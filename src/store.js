import { createStore, applyMiddleware } from 'redux';
import Reducer from './reducers/reducer';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

const store = createStore(
    Reducer,
    applyMiddleware(
        thunkMiddleware,
        logger
    )
);

export default store;
