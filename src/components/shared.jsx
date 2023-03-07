import {SERVER_URL} from "./index"
import {COLOR_THEMES, CUSTOM_THEMES} from "./constraints"

const FlagIconNames = {
	"заказы": "cart.svg",
	"финансы": "rub.svg",
	"регистрации": "key.svg",
	"путешествия": "plane.svg",
	"билеты": "ticket.svg",
	"штрафы и налоги": "gos.svg"
}

const FlagIcon = ({flag = ""}) => {
	if(!flag || flag === "") return null;

	flag = flag.toLowerCase();
	const iconName = FlagIconNames[flag];
	if(iconName){
		return (
			<span class = "letter__info__icon__wrapper"> 
				<img src = {SERVER_URL + `/static/${iconName}`} alt = ""/>
			</span>
		)
	}
	
	return null;
}

const AuthorIconPlaceholder = ({name}) => {
	return(
		<div className="letter__item__author__avatar author__icon__placeholder">
			<span className="author__icon__placeholder__label">{name[0]}</span>
		</div>
	)
}


const isSameDay = (d) => {
	const today = new Date();
	return today.getDate() == d.getDate() && today.getMonth() == d.getMonth() && today.getFullYear() == d.getFullYear();
}


function GetOrSetTheme(theme){

	if(typeof window === 'undefined') return "custom_theme_light";

	if(theme){
		localStorage?.setItem("theme", theme)
		return theme;
	}
	else{
		const ct = localStorage?.getItem("theme") ?? "custom_theme_light";
		if(ct.startsWith("custom")){
			return CUSTOM_THEMES.find(t => t.appliedClass === ct)
		}
		else if(ct.startsWith("theme__color")){
			return COLOR_THEMES.find(t => t.appliedClass === ct)
		}
	}
}


function CreateDragElement(text) {
	const el = document.createElement("div")
	el.classList.add("letter__drag__element__counter")
	el.id = "letter__drag__element__counter";
	el.textContent = text;
	document.getElementById("app_content").appendChild(el);
	return el;
}

export {FlagIcon, isSameDay, GetOrSetTheme, AuthorIconPlaceholder, CreateDragElement}