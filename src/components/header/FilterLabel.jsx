import {FormatMessage} from "../../Intl"

const FilterLabel = ({selectedFilters, availableFilters}) => {
	const sortItem = selectedFilters.s;
	if(selectedFilters.f.length === 1){
		const s = availableFilters.find(i => i.slug === selectedFilters.f[0])
		return (
			<>
				<span class = "filter__button__icon__wrapper">
					{s.iconElement}
				</span>
				<span class = "filter__button__label">{FormatMessage(sortItem?.isDefault ? s.localeKey : sortItem.localeKey)}</span>
			</>
		)
	}
	else if(selectedFilters.f.length > 1){
		return(
			<>
				{selectedFilters.f.map(item => {
					return (
						<span class = "filter__button__icon__wrapper" key = {`selected__item__${item}`}>
							{availableFilters.find(i => i.slug === item)?.iconElement}
						</span>
					)

				})}
				<span class = "filter__button__label">{FormatMessage(sortItem?.isDefault ? "HEADER_FILTER_LABEL" : sortItem.localeKey)}</span>
			</>
		)
	}
	return <span class = "filter__button__label">{FormatMessage(sortItem?.isDefault ? "HEADER_FILTER_LABEL" : sortItem.localeKey)}</span>
	
}


export default FilterLabel