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
            <CancelButton>Cancel</CancelButton>
            <SaveButton>Save</SaveButton>
        </FormFieldContainer>
    )
}

interface IFormFieldContainer {
    isVisible: boolean
}

const FormFieldContainer = styled.div<IFormFieldContainer>`
  width: 200px;
  height: ${({isVisible}) => isVisible ? '80px' : '30px'};
  border-radius: 5px;
  background-color: #282c34;
  transition: height ease-out 0.5s;
  overflow: hidden;
  text-align: right;
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
  position: absolute;
  margin-right: ${({type}) => type === 'Edit' ? '-130px' : '-70px'};
  z-index: 98;
  transition: opacity ease-out 0.15s;
  opacity: ${({isVisible}) => isVisible ? 1 : 0};
`;

const FormInputContainer = styled.div`
  width: 200px;
  border-radius: 5px;
  height: 30px;
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const _BaseButton = styled.button`
  outline: none;
  box-shadow: none;
  height: 25px;
  border-style: solid;
  border-radius: 5px;
  z-index: 99;
  cursor: pointer;
  border-color: rgb(169,181,244);
  border-width: 2px;
`;

const SaveButton = styled(_BaseButton)`
  width: 60px;
  background-color: rgb(89,110,245);
  margin: 0 10px;
`;

const CancelButton = styled(_BaseButton)`
  width: 60px;
  border-color: rgb(89,110,245);
`;

interface IEditButton {
    isEditVisible: boolean
}

const FormInputEditButton = styled(_BaseButton)<IEditButton>`
  background-color: white;
  margin-right: -140px;
  width: 40px;
  transition: opacity ease-out 0.15s;
  position: absolute;
  opacity: ${({isEditVisible}) => isEditVisible ? 1 : 0};
  display: ${({isEditVisible}) => isEditVisible ? 'block' : 'none'};
`;

interface ICopyButton {
    isCopied: boolean
}

const FormInputCopyButton = styled(_BaseButton)<ICopyButton>`
  margin-right: -100px;
  width: 80px;
  height: 25px;
  position: absolute;
  transition: background-color ease-in-out 0.2s;
  background-color: ${({isCopied}) => isCopied ? 'rgb(82, 220, 191)' : 'white'};
`;

const FormInputText = styled.input`
  background-color: rgb(224,230,244);
  border: 0;
  border-radius: 5px;
  padding: 5px;
  width: 190px;
  height: 20px;
  &:focus {
    box-shadow: none;
    outline: none;
    background-color: white;
  }
  transition: background-color ease-out 0.15s;
  overflow: scroll;
`;