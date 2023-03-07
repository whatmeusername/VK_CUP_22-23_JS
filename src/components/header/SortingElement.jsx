import { useState } from 'preact/hooks';
import {route } from 'preact-router';
import {SERVER_URL} from "../index";
import {FormatMessage} from "../../Intl";


import {SORTING_ITEMS} from "../constraints";


const SortingElement = ({selectedFilters, setSelectedFilters}) => {


	const HandleClick = (sort) => {
		const t = new URLSearchParams(location.search);
		if(!sort.isDefault){
			t.set("sort", sort.slug);
		}
		else t.delete('sort');

		setSelectedFilters({...selectedFilters, s: sort});
		const str = t.toString();
		route(location.pathname + (str !== "" ? "?" + t.toString() : ""))
	}

	const [isOpened, SetOpened] = useState(false);

	return(
		<div class = "filters__sort__wrapper">
			<div 
				class = {`filters__sort__button ${isOpened ? "filters__sort__button__active" : "filters__sort__button__inactive"}`}
				onClick = {e => SetOpened(!isOpened)}
			>
				<img 
					src = {SERVER_URL + "/static/chevron_left.svg"} 
					alt = "" 
					class = "sort__button__icon icon__primary"
				/>
				<span class = "text__primary">{FormatMessage("SORTING_LABEL")}</span>
			</div>
			{isOpened ?
				<div class = "filters__sort__content__wrapper">
					<div class = "filters__sort__content">
						{SORTING_ITEMS.map((item) => {
							const isSelected = selectedFilters.s.slug === item.slug;
							return(
								<div 
									class = "filters__sort__content__item"
									key = {`sort__item__${item.slug}`}
									onClick = {e => HandleClick(item)}
								>
										<div class = "sort__item__selected__wrapper">
											{isSelected ?
												<img src = {SERVER_URL + "/static/done.svg"} class = "icon__primary"/>
											: null }
										</div>
									<span class = "text__primary">{FormatMessage(item.localeKey)}</span>
								</div>
							)
						})}
					</div>
				</div>
			: null}
		</div>
	)
}


export default SortingElement