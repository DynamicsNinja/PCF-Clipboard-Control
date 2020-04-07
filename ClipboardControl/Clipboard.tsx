import * as React from 'react';
import { TextField, ITextFieldStyleProps, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import * as copy from 'copy-to-clipboard';
import { mergeStyleSets, FontSizes, FontWeights } from 'office-ui-fabric-react/lib/Styling';

export interface IClipboardProps {
    textValue: string;
    isPassword: boolean;
    isDisabled: boolean;
    onChange: (text:string) => void;
}

export interface IClipboardState {
    currentText: string;
    overlayHidden: boolean;
    iconBackground : string;
}
interface IClipboardClassObject {
    clipboardIcon: string;
    textbox: string;
    iconWrapper: string;
    textboxOverlay: string;
}

const textFieldStyles = (props: ITextFieldStyleProps): Partial < ITextFieldStyles > => ({
    fieldGroup: {
        border: props.focused ? "1px solid black !important" : "1px solid transparent !important",
        backgroundColor: 'transparent !important',
        height: '33px',
        selectors: {
            ":after": {
                border: "none"
            },
            ":hover": {
                border: props.disabled ? "1px solid rgb(226, 226, 226) !important" : "1px solid black !important",
                backgroundColor: props.disabled ? "rgb(226, 226, 226) !important" : 'transparent'
            }
        }
    },
    field: {
        height: '33px',
        fontWeight: props.focused ? 400 : 600,
        fontFamily: "SegoeUI,'Segoe UI'",
        color: props.disabled ? 'rgb(51, 51, 51) !important' : 'black !important',
        backgroundColor: 'transparent !important',
        selectors: {
            ":hover": {
                fontWeight: props.disabled ? 600 : 400,
            },
            '::placeholder' :{
                fontFamily: "SegoeUI,'Segoe UI'",
                fontSize: '14px',
                fontWeight: 600,
                color: 'black !important' 
            },
            'hover::placeholder' :{
                fontWeight: 400
            }
        }
    },
    root:{
        backgroundColor: 'transparent !important',
        height: '35px',
    },
    wrapper:{
        backgroundColor: 'transparent !important',
        height: '35px',
    }
});

const classNames: IClipboardClassObject = mergeStyleSets({
    clipboardIcon: {
        color: '#666666',
        userSelect: 'none'
    },
    textbox:{
        width: '100%', 
        selectors: {
            ':hover + div': {
                backgroundColor: 'rgb(226, 226, 226) !important'
            }
        }
    },
    textboxOverlay:{
        position: 'absolute',
        width: '-webkit-fill-available',
        background: 'white',
        marginRight: '40px',
        textAlign: 'left',
        paddingLeft: '8px',
        top: '8px',
        left: '2px',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: 'SegoeUI',
        height: 'fit-content',
        color: 'black',
        zIndex: 10
    },
    iconWrapper:{
        height: '17px',
        top: '1px',
        display: 'inline-block',
        left: '-36px',
        position: 'relative',
        width: '21px',
        cursor: 'pointer',
        padding: '7px', 
        textAlign: 'center',
        selectors: {
            ':hover': {
                backgroundColor: 'rgb(226, 226, 226) !important'
            }
        }
    }
});

export class Clipboard extends React.Component<IClipboardProps,IClipboardState> { 
    constructor(props: IClipboardProps) {
        super(props);
        initializeIcons();
        this.state = { 
            currentText: this.props.textValue,
            overlayHidden: true,
            iconBackground: "transparent"
        };
    }

    public textfieldOnChane(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) : void{
        let value = newValue || "";
        this.setState({
            currentText: value
        });
        this.props.onChange(value);
    }

    public iconOnClick(){
        copy(this.state.currentText);
        this.setState({overlayHidden: false});
        setTimeout(() => {this.setState({overlayHidden: true});}, 1000);
    }
  
    public render(): JSX.Element {    
      return (   
        <div style={{display:'-webkit-box', alignItems: 'center',position:'relative'}}>
            <div hidden={this.state.overlayHidden} className={classNames.textboxOverlay} id="text-overlay">Copied to clipboard!</div>
            <TextField 
                className={classNames.textbox} 
                style={{paddingRight: '35px'}} 
                styles={textFieldStyles}
                value={this.state.currentText} 
                onChange={this.textfieldOnChane.bind(this)}
                placeholder={'---'}
                type={this.props.isPassword ? 'password' : 'text'}
                disabled={this.props.isDisabled}  
                onFocus= {() => {this.setState({iconBackground:"rgb(226, 226, 226)"})}}
                onBlur = {() => {this.setState({iconBackground:"transparent"})}}
            />
            <div 
                className={classNames.iconWrapper} 
                style={{backgroundColor: this.state.iconBackground}}
                onClick={this.iconOnClick.bind(this)} 
            >
                <Icon 
                    className={classNames.clipboardIcon} 
                    iconName="Copy" 
                />
            </div>
        </div>
      );
    }
}