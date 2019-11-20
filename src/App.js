import React from 'react';
import {Provider, connect} from 'react-redux'
import Store from './store/store.js'
import Main from './components/main/main'

function App() {
  return (
      <Provider store={Store}>
        <div className="App">
          <Main />
        </div>
      </Provider>
  );
}

export default App;
