import React from 'react';
import './App.css';
import styled from "styled-components";
import {FormField} from "./components/atoms/FormField";

interface IFormField {
    title: string,
    description: string,
    formComponent: JSX.Element
}


const settingsInfo: IFormField[] = [{
  title: 'Name',
  description: 'a unique name',
  formComponent: <FormField
      type={"Edit"}
      formInputTextProps={{placeholder: 'hello'}}
  />
}, {
    title: 'Deploy Hook',
    description: 'Your private URL to trigger a deploy for this server. Remember to keep this a secret',
    formComponent: <FormField
        type={"Copy"}
        formInputTextProps={{placeholder: 'hellorreqqrewqwerqerwqerwqewrqwerweqr'}}
    />
}]

function App() {

    const getFormFields = (formData: IFormField[]): JSX.Element[] => {
        return formData.map(({title, description, formComponent}, index) => {
            return (
                <FormSection key={title + index.toString()}>
                    <LeftFormFieldSection>
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </LeftFormFieldSection>
                    <RightFormFieldSection>
                        {formComponent}
                    </RightFormFieldSection>
                </FormSection>
            )
        })
    }

    return (
        <div className="App">
            <header className="App-header">
                {getFormFields(settingsInfo)}
            </header>
        </div>
    );
}

const FormSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: white;
  align-items: center;
  justify-content: space-between;
`;

const LeftFormFieldSection = styled.div`
  flex: 0.5 0;
  color: black;
  text-align: left;
`;

const RightFormFieldSection = styled.div`
  flex: 0.5 0;
`;

export default App;
