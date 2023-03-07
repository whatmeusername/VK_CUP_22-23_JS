import {useContext, useRef} from 'preact/hooks';

import "./WriteLetter.scss";

import { FormatMessage } from '../../Intl';
import {WriteLetterEventBus} from "./context";

const SubjectField = () => {


	const eventBus = useContext(WriteLetterEventBus);
	const inputFieldRef = useRef();

	const onFieldInput = (e) => {
		inputFieldRef.current.style.width = `${20 + (inputFieldRef.current.value.length * 9)}px`;
		eventBus.emit("header", inputFieldRef.current.value)
	}

	const onBlur = (e) => {
		inputFieldRef.current.style.width = "";
	}

	const onFocus = (e) => {
		const c = inputFieldRef.current
		let width = 30 + (c.value.length * 8);
		if(width < 50){
			inputFieldRef.current.style.width = `100%`;
		}
		else inputFieldRef.current.style.width = `${width}px`;
	}


	return(
		<div className='wl__field__wrapper'>
			<div className="wl__field__label__wrapper">
				<span className = "wl__field__label text__secondary">{FormatMessage("WL_THEME")}:</span>
			</div>
			<div className="wl__field__input wl__field__input__subject">
				<div className='content__input__wrapper'>
					<input 
						className="content__input" 
						onKeyUp = {onFieldInput} 
						ref = {inputFieldRef} 
						onBlur = {onBlur}
						onFocus = {onFocus}
					/>
				</div>
			</div>
		</div>
	)
}

const TextArea = () => {
	return(
		<div className="write__letter__textarea__wrapper">
			<textarea className="write__letter__textarea" placeholder={FormatMessage("WL_TEXTAREA_PLACEHOLDER")}/>
		</div>
	)
}


export {SubjectField, TextArea}