import React, {HTMLAttributes, useCallback, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {FiCopy} from "react-icons/all";

type TField = 'Edit' | 'Copy';

interface IFormField extends HTMLAttributes<HTMLDivElement> {
    type: TField,
    formInputTextProps?: HTMLAttributes<HTMLInputElement>
}

enum CopyButtonText {
    COPY = 'Copy',
    COPIED = 'Copied!',
}

export const FormField = (
    {
        type,
        formInputTextProps,
        ...props
    }: IFormField
) => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [isEditVisible, setIsEditVisible] = useState(true);
    const [copyButtonText, setCopyButtonText] = useState<CopyButtonText>(CopyButtonText.COPY);
    const formInputFieldRef = useRef<HTMLInputElement>(null);

    const onInputFieldBlur = () => {
        setIsDisabled(true);
        setIsEditVisible(true);
    }

    const onEditButtonPress = () => {
        setIsDisabled(false);
        setIsEditVisible(false);
    }

    const onCopyButtonPress = async () => {
        try {
            window.focus();
            await navigator.clipboard.writeText(formInputFieldRef.current?.placeholder ?? '');
            setCopyButtonText(CopyButtonText.COPIED);
        } catch (e) {
            alert('Could not copy content' + e);
        }
    }

    useEffect(() => {
        if (copyButtonText === CopyButtonText.COPIED) {
            setTimeout(() => {
                setCopyButtonText(CopyButtonText.COPY);
            }, 2000);
        }
    }, [copyButtonText])

    useEffect(() => {
        if (!isDisabled) {
            formInputFieldRef.current?.focus();
        }
    }, [isDisabled])

    const getActionButton = useCallback(() => {
        switch (type) {
            case "Copy":
                return (
                    <FormInputCopyButton
                        type={'button'}
                        onClick={onCopyButtonPress}
                        isCopied={copyButtonText === CopyButtonText.COPIED}
                    ><FiCopy /> {copyButtonText}</FormInputCopyButton>
                )
            case "Edit":
                return (
                    <FormInputEditButton
                        type={'button'}
                        onClick={onEditButtonPress}
                        isEditVisible={isEditVisible}
                    >Edit</FormInputEditButton>
                )
        }
    }, [type, isEditVisible, copyButtonText]);

    const onEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case 'Enter':
                formInputFieldRef.current?.blur();
                break;
            case 'Escape':
                formInputFieldRef.current?.blur();
                break;
        }
    }

    return (
        <FormFieldContainer isVisible={!isEditVisible}>
            <FormInputContainer {...props}>
                <FormInputText
                    onKeyDown={(event) => onEnterKeyDown(event)}
                    ref={formInputFieldRef}
                    disabled={isDisabled}
                    onBlur={onInputFieldBlur}
                    {...formInputTextProps}
                />
                <TextTrailingFade type={type} isVisible={isEditVisible} />
                {getActionButton()}
            </FormInputContainer>
            <TextInputSaveHint isVisible={!isEditVisible}>Press Enter to Save</TextInputSaveHint>
        </FormFieldContainer>
    )
}

interface IFormFieldContainer {
    isVisible: boolean
}

const FormFieldContainer = styled.div<IFormFieldContainer>`
  width: 155px;
  height: ${({isVisible}) => isVisible ? '50px' : '30px'};
  border-radius: 5px;
  background-color: #282c34;
  transition: height ease-out 0.5s;
`;

interface ITextInputSaveHint {
    isVisible: boolean
}

const TextInputSaveHint = styled.p<ITextInputSaveHint>`
  padding: 0;
  margin: 5px 0;
  font-size: 10px;
  font-style: italic;
  opacity: ${({isVisible}) => isVisible ? 1 : 0};
  transition: ${({isVisible}) => isVisible ? 'opacity ease-out 3s' : 'opacity ease-out 0.5s'};
`;

interface ITextTrailingFade {
    type: TField,
    isVisible: boolean
}

// TODO: Change fade length based on Button Type
const TextTrailingFade = styled.div<ITextTrailingFade>`
  background-image: linear-gradient(to right, transparent, white);
  width: ${({type}) => type === 'Edit' ? '70px' : '130px'};
  height: 30px;
  pointer-events: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-left: ${({type}) => type === 'Edit' ? '-70px' : '-130px'};
  z-index: 98;
  transition: opacity ease-out 0.15s;
  opacity: ${({isVisible}) => isVisible ? 1 : 0};
`;

const FormInputContainer = styled.div`
  width: 150px;
  border-radius: 5px;
  height: 30px;
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IEditButton {
    isEditVisible: boolean
}

const FormInputEditButton = styled.button<IEditButton>`
  background-color: white;
  margin-left: -50px;
  width: 40px;
  height: 25px;
  border-style: solid;
  border-radius: 5px;
  border-color: rgb(169,181,244);
  border-width: 2px;
  transition: opacity ease-out 0.15s;
  outline: none;
  box-shadow: none;
  opacity: ${({isEditVisible}) => isEditVisible ? 1 : 0};
  z-index: 99;
  display: ${({isEditVisible}) => isEditVisible ? 'block' : 'none'};
  cursor: pointer;
`;

interface ICopyButton {
    isCopied: boolean
}

const FormInputCopyButton = styled.button<ICopyButton>`
  outline: none;
  box-shadow: none;
  margin-left: -90px;
  width: 80px;
  height: 25px;
  border-style: solid;
  border-radius: 5px;
  border-color: rgb(169,181,244);
  border-width: 2px;
  transition: background-color ease-in-out 0.2s;
  background-color: ${({isCopied}) => isCopied ? 'rgb(82, 220, 191)' : 'white'};
  z-index: 99;
  cursor: pointer;
`;

const FormInputText = styled.input`
  background-color: rgb(224,230,244);
  border: 0;
  border-radius: 5px;
  padding: 5px;
  width: 150px;
  height: 20px;
  &:focus {
    box-shadow: none;
    outline: none;
    background-color: white;
  }
  transition: background-color ease-out 0.15s;
  overflow: scroll;
`;