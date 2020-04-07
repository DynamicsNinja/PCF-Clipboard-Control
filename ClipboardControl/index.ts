import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Clipboard, IClipboardProps } from "./Clipboard";

export class ClipboardControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;

	private _value: string;
	private _notifyOutputChanged: () => void;

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._container = container;

		this._notifyOutputChanged = notifyOutputChanged;
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		var textValue = context.parameters.textField.raw || "";
		var isSecure = context.parameters.isSecure.raw == 'hide';

		let props: IClipboardProps = {	
			textValue: textValue,
			isPassword: isSecure,
			isDisabled: context.mode.isControlDisabled,
			onChange: text => {
				this._value = text;
				this._notifyOutputChanged();
			}
		};

		ReactDOM.render(
			React.createElement(Clipboard, props),
			this._container
		);
	}

	public getOutputs(): IOutputs
	{
		return {
			textField: this._value
		};
	}

	public destroy(): void
	{
		ReactDOM.unmountComponentAtNode(this._container);
	}
}