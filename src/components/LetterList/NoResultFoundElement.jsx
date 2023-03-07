
import {useContext} from "preact/hooks";
import {ThemeContext} from "../context";
import { FormatMessage } from "../../Intl";

import {SERVER_URL} from "../index"

const NoResultsFoundElement = () => {
	const themeContext = useContext(ThemeContext);

	const iconPostfix = themeContext.c?.prefix === "dark" ? "cap_dark" : (themeContext.c?.prefix === "light" ? "cap_light" : "search");
	return(
			<div className="no__results__wrapper">
				<img 
					src={SERVER_URL + `/static/not_found_${iconPostfix}.svg`} 
					class = {`no__results__icon ${iconPostfix === "search" ? "no__results__icon__default" : ""}`} 
					alt=""
				/>
				<span class = "no__results__label">{FormatMessage("LL_NOT_FOUND")}</span>
			</div>
	)
}


export default NoResultsFoundElement