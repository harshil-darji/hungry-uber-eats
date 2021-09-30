import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { Provider } from 'react-redux';

import './assets/fonts/font.css';
import App from './App';
import store from './store';

const engine = new Styletron();

ReactDOM.render(
  <Provider store={store}>
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme} zIndex={100}>
        <App />
      </BaseProvider>
    </StyletronProvider>
  </Provider>,
  document.getElementById('root'),
);
