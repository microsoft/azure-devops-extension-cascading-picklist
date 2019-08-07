import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import { Header } from '../components/Header';
import { useConfigurationStorage } from '../hooks/configstorage';
import { useExternalToast } from '../hooks/toast';
import { FieldsTable, FieldTableItem } from '../components/FieldsTable';
import { ArrayItemProvider } from 'azure-devops-ui/Utilities/Provider';
import { useProjectPicklistsList } from '../hooks/projectfieldlist';

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

const ConfigView: React.FC = () => {
  const [configText, status, saveDraft, publishConfig] = useConfigurationStorage();
  const showToast = useExternalToast();
  const fields = useProjectPicklistsList();

  function editorDidMount(editor) {
    editor.getModel().updateOptions({ tabSize: 2 });
  }

  async function onSaveButtonClick() {
    try {
      await publishConfig();
      await showToast('Configuration succesfully saved.', 2000);
    } catch (error) {
      await showToast(`${(error as Error).message}`, 2000);
    }
  }

  return (
    <ConfigViewContainer>
      <Header title='Cascading Lists Config' onSaveClick={onSaveButtonClick} status={status} />
      <EditorContainer>
        <MonacoEditor
          height='800'
          value={configText}
          theme='vs'
          options={EditorOptions}
          language='json'
          editorDidMount={editorDidMount}
          onChange={newValue => {
            saveDraft(newValue);
          }}
        />
      </EditorContainer>
      <FieldsTable itemProvider={new ArrayItemProvider<FieldTableItem>(fields)} />
    </ConfigViewContainer>
  );
};

export default ConfigView;
