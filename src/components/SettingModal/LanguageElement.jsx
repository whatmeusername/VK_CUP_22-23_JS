import { useRef} from 'preact/hooks';
import {FormatMessage, useLocale} from "../../Intl";
import {LANGUAGES} from "../constraints";

import {SERVER_URL} from "../index";

const LanguageElement = () => {


	const [locale, setLocale] = useLocale();
	let checkedLocale = useRef(locale);

	const OnButtonClick = (e) => {
		if(checkedLocale && checkedLocale !== locale){
			setLocale(checkedLocale);
		}
	}



	return(
		<div class = "settings__langauge__wrapper">
			<div class = "text__primary">{FormatMessage("SETTINGS_SIDEBAR_LANGUAGE_LABEL")}</div>
			<div class = "settings__langauges__column">
				{LANGUAGES.map(laungage => {
					return(
						<div class = "settings__langauges__item" key = {`settings__langauges__item__${laungage.localeKey}`}>
							<input 
								type = "radio" 
								name = "settings__langauge" 
								class = "custom__radio"
								id = {`settings__langauge__${laungage.localeKey}`}
								defaultChecked = {checkedLocale.current === laungage.localeKey}
								onChange = {e => {
									if(e.target.checked){
										checkedLocale = laungage.localeKey
									}
								}}
							/>
							<label class = "text__primary settings__langauges__item__label" for = {`settings__langauge__${laungage.localeKey}`}>
								<img src = {SERVER_URL + `/static/${laungage.icon}`} alt = ""/>
								{laungage.label}
							</label>
							
						</div>

					)
				})}
			</div>
			<button 
				class = "settings__langauge__btn"
				onClick = {OnButtonClick}
			>
				{FormatMessage("SETTINGS_SIDEBAR_LANGUAGE_BTN")}
			</button>
		</div>
	)
}


export {LanguageElement}