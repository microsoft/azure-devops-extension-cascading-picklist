import {} from 'azure-devops-extension-api';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
import SDK from '../SDK';

SDK.init(
  
);

ReactDOM.render(<App />, document.getElementById('root'));
