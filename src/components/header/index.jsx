import { useContext, useState } from 'preact/hooks';
import { Link } from 'preact-router';
import {HistoryContext} from "../context"
import {SERVER_URL} from "../index"
import FilterButton from './Filter';

import'./header.scss';




const Logo = () => {
	return (
		<div class = "logo__wrapper">
			<img src = {SERVER_URL + "/static/logo_icon.svg"} alt = "" class = "logo__icon" />
			<img src = {SERVER_URL + "/static/logo_label.svg"} alt = "" class = "logo__label"/>
		</div>
	)
}

const LetterListHeaderContent = () => {
	return(
		<>
			<Logo/>
			<FilterButton/>
		</>
	)
}



const Header = () => {

	const historyContext = useContext(HistoryContext);
	const [isNavigationHeader, setNavigationHeader] = useState(false);
	historyContext.s = setNavigationHeader;

	return(
		
		<header className = "header">
			<div className = "header__content__wrapper">
				{isNavigationHeader ?  
					<Link class = "previous__page__wrapper" href = {historyContext.prevPath} onClick = {e => {setNavigationHeader(false)}}>
						<img class = "previous__page__icon" src = {SERVER_URL + "/static/chevron_left.svg"}/>
						<span class = "previous__page__label">Вернуться</span>
					</Link>
				:
					<LetterListHeaderContent/>
				}
			</div>
		</header>
	)
};

export default Header;
