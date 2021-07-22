import React from 'react';
import './App.css';
import Router from './Router';
import { Provider } from 'react-redux';
import myStore from './store';

function App() {

    return (
        <Provider store={myStore}>
            <div className="App">
                <Router />
            </div>
        </Provider>
    );
}

export default App;
