import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import { Header } from '../components/Header';
import { useExternalToast } from '../hooks/toast';
import { useConfigurationStorage, useFetchWorkItemTypes } from './ConfigView.hooks';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { useState, useEffect } from 'react';

const EditorContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 1.3rem;
`;

const ConfigViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const EditorOptions = {
  selectOnLineNumbers: true,
};

const ConfigView = () => {
  const [currentWorkItemType, setCurrentWorkItemType] = useState<string>('');
  const workItemTypes = useFetchWorkItemTypes();
  const [, configText, status, saveConfig, updateConfigurationStorage] = useConfigurationStorage(
    currentWorkItemType
  );
  const showToast = useExternalToast();

  useEffect(() => {
    // TODO: update dropdown current value here
    setCurrentWorkItemType(workItemTypes[0] ? workItemTypes[0].name : '');
  }, [workItemTypes]);

  function editorDidMount(editor) {
    editor.getModel().updateOptions({ tabSize: 2 });
  }

  function onWorkItemSelect(event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem) {
    setCurrentWorkItemType(item.text);
  }

  const dropdownItems = workItemTypes.map(workItemType => {
    return { id: workItemType.referenceName, text: workItemType.name };
  });
  return (
    <ConfigViewContainer>
      <Header
        title='Cascading list config'
        onSaveClick={async () => {
          try {
            await updateConfigurationStorage();
            await showToast('Configuration succesfully saved.', 2000);
          } catch (error) {
            await showToast('Error saving configuration.', 2000);
          }
        }}
        dropdownPlaceholder='Work item type'
        dropdownItems={dropdownItems}
        onDropdownSelect={onWorkItemSelect}
        isStatusOk={status}
      />
      <EditorContainer>
        <MonacoEditor
          height='800'
          value={configText}
          theme='vs'
          options={EditorOptions}
          language='json'
          editorDidMount={editorDidMount}
          onChange={newValue => {
            saveConfig(newValue);
          }}
        />
      </EditorContainer>
    </ConfigViewContainer>
  );
};

export default ConfigView;
