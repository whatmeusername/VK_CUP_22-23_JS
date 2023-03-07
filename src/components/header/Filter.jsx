import {useEffect, useState, useRef } from 'preact/hooks';
import { route } from 'preact-router';
import {SERVER_URL} from "../index"
import {FormatMessage} from "../../Intl"


import SortingElement from "./SortingElement"
import FilterLabel from "./FilterLabel"


import { F_PREFIX, SORTING_ITEMS } from '../constraints';


const getInitialFilters = (availableFilters) => {
	const query = new URLSearchParams(location.search);
	const res = [];
	if(availableFilters.length > 0){
		for(let i = 0; i < availableFilters.length; i++){
			const filter = availableFilters[i];
			if(query.get(F_PREFIX + filter.slug) !== null) res.push(filter.slug)
		}
	}
	const querySortString = query.get("sort");
	const sortItem = querySortString ? SORTING_ITEMS.find(i => i.slug === querySortString) : SORTING_ITEMS.find(i => i.isDefault)
	return {f: res, s: sortItem};
}


const FilterButton = () => {



	const availableFilters = [
		{
			iconElement: null,
			localeKey: "HEADER_FILTER_ALL",
			isDefault: true
		},
		{
			iconElement: <div class = "filter__checked__icon"/>,
			localeKey: "HEADER_FILTER_UNREAD",
			slug: "read"
		},
		{
			iconElement: <img src= {SERVER_URL + "/static/bookmark_fill.svg"} alt = ""/>,
			localeKey: "HEADER_FILTER_FLAGGED",
			slug: "bookmark"
		},
		{
			iconElement: <img src= {SERVER_URL + "/static/clip.svg"} alt = "" class = "filter__button__icon icon__primary"/>,
			localeKey: "HEADER_FILTER_ATTACHMENT",
			slug: "attachment"
		}
	]

	const [selectedFilters, setSelectedFilters] = useState(getInitialFilters(availableFilters));
	const [isOpened, setOpened] = useState(false);
	const dropdownRef = useRef();
	const btnRef = useRef();
	


	useEffect(() => {
		let currentPath = location.pathname;
		let query = location.search;

		// Так как фильтр не входит в элемент роутера, 
		// то для контроля за изменением URL и сихронизации фильтров и сортировки используем MutationObserver
		const mutationObserver = new MutationObserver(() => {
			if(location.pathname !== currentPath){
				setSelectedFilters({...getInitialFilters([])})
				currentPath = location.pathname;
			}
			else if(location.pathname === currentPath && query !== location.search){
				setSelectedFilters({...getInitialFilters(availableFilters)});
				query = location.search;
			}
		})

		mutationObserver.observe(document, {subtree: true, childList: true});
		return () => mutationObserver.disconnect();
	}, [])

	useEffect(() => {
		if(isOpened){

			const clickEvent = (e) => {

				if(btnRef.current.contains(e.target)){
					window.removeEventListener('mousedown', clickEvent)
				}
				else if(!dropdownRef.current.contains(e.target)){
					setOpened(false);
					window.removeEventListener('mousedown', clickEvent)
				}
			}

			window.addEventListener('mousedown', clickEvent);
			return () => window.removeEventListener('mousedown', clickEvent)
		}
	}, [isOpened])




	const handleFilterClick = (event, item) => {

		const t = new URLSearchParams(location.search);

		if(item.isDefault === true){

			const sf = selectedFilters.f;
			for(let i = 0; i < sf.length; i++){
				t.delete(`${F_PREFIX + sf[i]}`);
			}
			setSelectedFilters({...selectedFilters, f:[]});
		}
		else{
			if(!selectedFilters.f.includes(item.slug)){
				t.append(`${F_PREFIX + item.slug}`, "1")
				setSelectedFilters(prev => {
					prev.f = [...prev.f, item.slug]
					return {...prev};
				})
			}
			else{
				t.delete(`${F_PREFIX + item.slug}`);
				setSelectedFilters(prev => {
					prev.f.splice(prev.f.indexOf(item.slug), 1);
					return {...prev};
				})
			}
		}

		const str = t.toString();
		route(location.pathname + (str !== "" ? "?" + t.toString() : ""))
	}


	return(
		<div class ="letter__filter">
			<div 
				class = "filter__button" 
				onClick = {e => setOpened(!isOpened)} 
				ref = {btnRef}
			>
				<FilterLabel selectedFilters = {selectedFilters} availableFilters = {availableFilters}/>
				<img src = {SERVER_URL + "/static/chevron_down.svg"} alt = "" class = "filter__button__icon"/>
			</div>
			{isOpened ?
				<div class = {"filter__dropdown__wrapper"} ref = {dropdownRef}>
					<div class = "filter__dropdown__content">
						{availableFilters.map(filter => {
							const isSelected = selectedFilters.f.includes(filter.slug) || (selectedFilters.f.length === 0 && filter?.isDefault === true)
							return(
								<div 
									class = "filter__item dropdown__hover" 
									onClick = {e => handleFilterClick(e, filter)}
									key = {`filter__${filter.slug}`}
								>
									<div class = "filter__item__selected__wrapper">
										{isSelected ?
											<img src = {SERVER_URL + "/static/done.svg"} class = "icon__primary"/>
										: null }
									</div>
									{filter.iconElement ? 
										<span class = "filter__icon__wrapper">
											{filter.iconElement}
										</span>
									: null}
									<span class = "text__primary">{FormatMessage(filter.localeKey)}</span>
								</div>
							)
						})}
						<hr class = "filters__separator"/>
						<SortingElement selectedFilters = {selectedFilters} setSelectedFilters = {setSelectedFilters} key = {`sorting_${isOpened}`}/>
						{selectedFilters.f.length > 0 || !selectedFilters.s.isDefault ? 
							<>
								<hr class = "filters__separator"/>
								<div 
									class = "filters__clear__button dropdown__hover"
									onClick = {e => {
										setSelectedFilters({f: [], s: SORTING_ITEMS.find(i => i.isDefault)});
										route(location.pathname);
									}}
								>
									<span class = "text__primary" >{FormatMessage("HEADER_FILTER_RESET")}</span>
								</div>
							</>
							: null
						}			
					</div>
				</div>
			: null}
		</div>
	)
}


export default FilterButton;