import * as SDK from 'azure-devops-extension-sdk';
import * as React from 'react';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ConfigView from './views/ConfigView';

const App = () => {
  useEffect(() => {
    SDK.notifyLoadSucceeded();
  }, []);

  return (
    <BrowserRouter>
      <ConfigView />
    </BrowserRouter>
  );
};

export default App;
