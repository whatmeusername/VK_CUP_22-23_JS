import {SERVER_URL} from "../../index"

const BookmarkIcon = ({checked = false}) => {

	let srcIMG = "";

	if(checked) srcIMG = SERVER_URL + "/static/bookmark_fill.svg"
	else srcIMG = SERVER_URL + "/static/bookmark.svg"

	return <img 
		src = {srcIMG} 
		class = {`letter__item__bookmark__icon ${checked ? "letter__item__bookmark__icon__cheked" : "letter__item__bookmark__icon__uncheked"}`}
		onClick = {e => {
			e.preventDefault();
			e.stopPropagation();
		}}
		draggable={false}
	/>
}

export {BookmarkIcon}