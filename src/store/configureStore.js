import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

// export default (initialState) => {
//     const middleware = [
//         thunk
//     ]

//     const store = createStore(
//         rootReducer,
//         initialState,
//         composeWithDevTools(
//             applyMiddleware(...middleware)
//         )
//     );
//     return store;
// };


export default (initialState) => {
    const middleware = [
        thunk
    ]

    //helps in traceing in redux devotools
    const composeEnhancers = composeWithDevTools({ 
        trace: true, 
        traceLimit: 25 
    });

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(...middleware)),
    );
    return store;
};