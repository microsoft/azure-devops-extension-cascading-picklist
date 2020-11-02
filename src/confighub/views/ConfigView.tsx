import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import styled from 'styled-components';
import { Header } from '../components/Header';
import { ProjectOverrides } from '../components/ProjectOverrides';
import { useConfigurationStorage } from '../hooks/configstorage';
import { useExternalToast } from '../hooks/toast';
import { FieldsTable, FieldTableItem } from '../components/FieldsTable';
import { ArrayItemProvider } from 'azure-devops-ui/Utilities/Provider';
import { useProjectPicklistsList,getFieldPicklistsList } from '../hooks/projectfieldlist';
//import { enableConfigOverride } from '../hooks/enableConfigOverride';
import { RouteComponentProps, withRouter } from "react-router";
import { ObservableValue } from "azure-devops-ui/Core/Observable";

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

/*const EditorOptions = {
  selectOnLineNumbers: true,
  readOnly: false
};*/

const overrideCascadesToggle = new ObservableValue<boolean>(false);

//const ConfigView: React.FC = () => {
const ConfigView: React.FC<RouteComponentProps<any>> = (rcprops) => {
  let headerTitle: string = "";

  //firstToggle.subscribe(enableConfigOverride)

  let orglevel: number = Number(getUrlParams().get('orglevel'));
  let allowOverride: boolean = false;

  if(orglevel == 1)
  {
    headerTitle = "Cascading Lists Master Config";
  }
  else{
    headerTitle = "Cascading Lists Project Config";
    allowOverride = true;
  }
  const [configText, toggleHandler, EditorOptions, status, saveDraft, publishConfig] = useConfigurationStorage(allowOverride, overrideCascadesToggle);
  const showToast = useExternalToast();
  const fields = getFieldPicklistsList(allowOverride);//useProjectPicklistsList();

  overrideCascadesToggle.subscribe(onCascadeSettingsOverrideToggle);

  async function onCascadeSettingsOverrideToggle(value: boolean, action: string)
  {
    console.log('onCascadeSettingsOverrideToggle: Raisinng toggle value change.');
    await toggleHandler(value);
  }

  function getUrlParams(): URLSearchParams {
    if (!rcprops.location.search) return new URLSearchParams();
    return new URLSearchParams(rcprops.location.search);
  }

  function editorDidMount(editor) {
    editor.getModel().updateOptions({ tabSize: 2 });
  }

  async function onSaveButtonClick() {
    try {
      console.log('onSaveButtonClick: Saving settings.');
      await publishConfig();
      await showToast('Configuration succesfully saved.', 2000);
    } catch (error) {
      await showToast(`${(error as Error).message}`, 2000);
    }
  }
  console.log('ConfigView: Returning view container');
  
  return (
    <ConfigViewContainer>
      <Header title={headerTitle} onSaveClick={onSaveButtonClick} status={status} />
      <ProjectOverrides toggle={overrideCascadesToggle} isVisible={allowOverride} />
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

export default withRouter(ConfigView);
