import {useContext} from "preact/hooks"
import {SettingModalContext, WriteLetterContextModal} from "../context"
import {SERVER_URL} from "../index"

import {FormatMessage} from "../../Intl"


const WriteLetterBtn = () => {

	const writeLetterContextModal = useContext(WriteLetterContextModal);

	return(
		<button class = "write__letter__btn" onClick = {e => writeLetterContextModal.os(true)}>
			<img src = {`${SERVER_URL}/static/pencil.svg`} class = "write__letter__btn__mobile__icon" alt = ""/>
			<span class = "write__letter__btn__label">{FormatMessage("SIDEBAR_NEW_MESSAGE")}</span>
		</button>
	)
}

const SettingButton = () => {

	const settingModalSetState = useContext(SettingModalContext);

	return (
		<div 
			class = "setting__button sidebar__item__hover"
			onClick = {e => settingModalSetState.s(true)}
		>
			<img class = "setting__button__icon icon" src = {SERVER_URL + "/static/setting.svg"} alt = ""/>
			<span class = "setting__button__label">{FormatMessage("SIDEBAR_SETTINGS")}</span>
		</div>
	)
}

const BarButton = () => {
	return (
		<div 
			class = "folder__group__item folder__group__item__icon__mobile"
		>
			<img 
				class = "folder__group__item__icon icon"
				src = {SERVER_URL + "/static/bar.svg"}
			/>
		</div>
	)
}


export {WriteLetterBtn, BarButton, SettingButton}