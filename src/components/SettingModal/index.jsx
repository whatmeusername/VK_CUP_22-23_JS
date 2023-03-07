import { useState, useRef, useEffect} from 'preact/hooks';
import {FormatMessage, GetLocale} from "../../Intl"


import {ThemesElement} from "./ThemesElement"
import {LanguageElement} from "./LanguageElement"
import {LANGUAGES} from "../constraints"

import {SERVER_URL} from "../index"
import './settings.scss';

const availbleCategories = [
	{
		localKey: "SETTINGS_SIDEBAR_THEME",
		slug: "theme",
		element: <ThemesElement/>,
	},
	{
		localKey: "SETTINGS_SIDEBAR_LANGUAGE",
		slug: "language",
		element: <LanguageElement/>,
		icon: () => {
			const cl = GetLocale();
			const ld = LANGUAGES.find(i => i.localeKey === cl);
			return SERVER_URL + `/static/${ld?.icon}`
		},
		label: () => {
			const cl = GetLocale();
			const ld = LANGUAGES?.find(i => i.localeKey === cl);
			return ld?.label ? `: ${ld.label}` : "";
		}
	}
]

const SettingModal = ({setOpenState}) => {


	const [selected, setSelected] = useState(availbleCategories[0]);
	const modalRef = useRef();

	useEffect(() => {
		
		const clickEvent = (e) => {
			if(!modalRef.current.contains(e.target)){
				setOpenState(false);
				document.removeEventListener("mousedown", clickEvent);
			}
		}
		document.addEventListener("mousedown", clickEvent);
		return () => document.removeEventListener("mousedown", clickEvent);
	}, [])


	return (
		<div class = "setting__modal__wrapper" ref = {modalRef}>
			<div class = "setting__modal__layout">
				<div class = "setting__modal__sidebar">
					{availbleCategories.map(item => {
						const icon = item.icon ? item.icon() : null;
						const label = item?.label ? item.label() : null;
						return (
							<div 
								class = {`setting__modal__sidebar__item ${item.slug === selected.slug ? "setting__modal__sidebar__item__active" : "setting__modal__sidebar__item__inactive"}`}
								onClick = {e => setSelected(item)}
								key = {`setting__sidebar__item__${item.slug}`}
							>
								<span class = "text__primary setting__sidebar__item__label">{FormatMessage(item.localKey) + (label ?? "")}</span>
								{icon ? <img class = "setting__sidebar__item__icon" src = {icon} alt = ""/> : null}
							</div>
						)
					})}
				</div>
				<div class = "setting__modal__content">
					{selected.element}
				</div>
			</div>
		</div>
	)
}


export {SettingModal}