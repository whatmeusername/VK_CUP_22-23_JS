import { SERVER_URL } from '../index';

const BoldText = () => {
	return(
		<img  draggable = {false} src = {SERVER_URL + "/static/rte_bold.svg"} alt = "" className="rte__toolbar__item"/>
	)
}

const ItalicText = () => {
	return(
		<img  draggable = {false} src = {SERVER_URL + "/static/rte_italic.svg"} alt = "" className="rte__toolbar__item"/>
	)
}

const UnderscoreText = () => {
	return(
		<img  draggable = {false} src = {SERVER_URL + "/static/rte_underscore.svg"} alt = "" className="rte__toolbar__item"/>
	)
}

const StrikedText = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_striked.svg"} alt = "" className="rte__toolbar__item"  draggable = {false}/>
	)
}

const TextColor = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_color.svg"} alt = "" className="rte__toolbar__item"  draggable = {false}/>
	)
}

const TextFont = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_font.svg"} alt = "" className="rte__toolbar__item"  draggable = {false}/>
	)
}

const TextAligment = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_aligment_left.svg"} alt = "" className="rte__toolbar__item"  draggable = {false}/>
	)
}

const TextMargin = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_margin.svg"} alt = "" className="rte__toolbar__item"  draggable = {false}/>
	)
}

const TextList = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_list.svg"} alt = "" className="rte__toolbar__item"  draggable = {false}/>
	)
}

const TextRedo = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_redo.svg"} alt = "" className="rte__toolbar__item"  draggable = {false}/>
	)
}

const TextUndo = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_undo.svg"} alt = "" className="rte__toolbar__item"  draggable = {false}/>
	)
}

const TextLink = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_link.svg"} alt = "" className="rte__toolbar__item"  draggable = {false}/>
	)
}

const TextImg = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_img.svg"} alt = "" className="rte__toolbar__item"  draggable = {false}/>
	)
}

const TextClear = () => {
	return(
		<img src = {SERVER_URL + "/static/rte_clear.svg"} alt = "" className="rte__toolbar__item" draggable = {false}/>
	)
}

const RTEToolBar = () => {
	return(
		<div className = "wl__rte__toolbar__wrapper">
			<TextClear/>
			<BoldText/>
			<ItalicText/>
			<UnderscoreText/>
			<StrikedText/>
			<TextColor/>
			<TextFont/>
			<TextAligment/>
			<TextMargin/>
			<TextList/>
			<TextUndo/>
			<TextRedo/>
			<TextLink/>
			<TextImg/>
		</div>
	)
}


export {RTEToolBar}