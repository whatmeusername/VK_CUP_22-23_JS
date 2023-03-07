import { useState , useContext, useEffect} from 'preact/hooks';
import { SERVER_URL } from '../index';
import {WriteLetterEventBus} from "./context";

const ModalHeadHeader = () => {

	const eventBus = useContext(WriteLetterEventBus);

	const [text, setText] = useState("");

	useEffect(() => {
		eventBus.subscribe("header", (text) => {
			setText(text)
		})
	}, [])

	return(
		<span className="central__modal__header__text text__primary">{text}</span>
	)
}

const ModalHead = ({setOpen, setExpanded, expanded}) => {
	return(
		<div className="central__modal__head">
			<div className="central__modal__header">
				<ModalHeadHeader/>
			</div>
			<div className="central__modal__controls">
				<div className="central__modal__control__item central__modal__control__collapse">
					<img 
						src={SERVER_URL + "/static/collapse.svg"} 
						alt = "" 
						className='central__modal__control__item__icon'  
						draggable = {false}
					/>
				</div>
				<div className="central__modal__control__item central__modal__control__expand" onClick = {e => setExpanded(prev => !prev)}>
					<img 
						src={SERVER_URL + `/static/${expanded ? "shrink" : "expand"}.svg`} 
						alt = "" 
						className='central__modal__control__item__icon'  
						draggable = {false}
					/>
				</div>
				<div className="central__modal__control__item central__modal__control__close" onClick={e => setOpen(false)}>
					<img 
						src={SERVER_URL + "/static/close.svg"} 
						alt = "" 
						className='central__modal__control__item__icon'  
						draggable = {false}
					/>
				</div>
			</div>
		</div>
	)
}

export {ModalHead}