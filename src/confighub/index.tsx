import {} from 'azure-devops-extension-api';
import * as SDK from 'azure-devops-extension-sdk';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';

SDK.init({
  applyTheme: true,
  loaded: false,
});

ReactDOM.render(<App />, document.getElementById('root'));
