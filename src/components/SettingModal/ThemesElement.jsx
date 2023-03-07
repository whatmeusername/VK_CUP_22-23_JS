import { useContext} from 'preact/hooks';
import {ThemeContext} from "../context";
import {GetOrSetTheme} from "../shared";

import {FormatMessage} from "../../Intl";
import {SERVER_URL} from "../index";

import {COLOR_THEMES, CUSTOM_THEMES} from "../constraints";


const ThemesElement = () => {


	const themeContext = useContext(ThemeContext);

	return(
		<div className="themes__wrapper">
			<p class = "text__primary">{FormatMessage("SETTINGS_SIDEBAR_THEME_LABEL")}</p>
			<div class = "themes__content__wrapper">
				<div class = "themes__color__wrapper">
					{COLOR_THEMES.map(colorTheme => {
						return(
							<div 
								class = "themes__color__item" key = {`color_theme_${colorTheme.appliedClass}`} 
								onClick = {e => {
									themeContext.s(colorTheme);
									GetOrSetTheme(colorTheme.appliedClass);
								}}
							>
								<div style = {{backgroundColor: colorTheme.color}} class = "themes__color__item__bg">
									{themeContext.c?.appliedClass === colorTheme.appliedClass ? 
										<div class = "themes__color__selected">
											<img class = "themes__color__selected__icon" alt = "" src = {SERVER_URL + "/static/checkmark.svg"}/>
										</div>
										: null
									}
								</div>
							</div>
						)
					})}
				</div>
				<div class = "themes__custom__wrapper">
					{CUSTOM_THEMES.map(customTheme => {
						return(
							<div className="themes__custom__item__wrapper">
								<div 
									class = "themes__custom__item" 
									style = {{background: `url(${SERVER_URL + "/static/" + customTheme.bgImage})`}}
									key = {`custom_theme_${customTheme.label}`}
								>
									{themeContext.c?.appliedClass === customTheme.appliedClass ? 
										<div class = "themes__custom__selected">
											<img class = "themes__custom__selected__icon" alt = "" src = {SERVER_URL + "/static/checkmark.svg"}/>
										</div>
									 :
										<div class = "themes__custom__hover" onClick = {e => {
												themeContext.s(customTheme);
												GetOrSetTheme(customTheme.appliedClass);
											}}>
											<span class = "theme__custom__hover__label">{FormatMessage(customTheme.localKey)}</span>
										</div>
									}	
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}


export {ThemesElement}