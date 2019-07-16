import * as SDK from 'azure-devops-extension-sdk';
import * as React from 'react';
import { useEffect } from 'react';
import ConfigView from './views/ConfigView';

const App = () => {
  useEffect(() => {
    SDK.notifyLoadSucceeded();
  }, []);

  return <ConfigView />;
};

export default App;
