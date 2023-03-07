import { useState , useContext, useEffect} from 'preact/hooks';
import {WriteLetterContextModal} from "../context"

import "./WriteLetter.scss";

import { SERVER_URL } from '../index';
import { FormatMessage } from '../../Intl';


import {AttachmentsElement, AttachmentButtonsElement} from "./AttachmentsElement"
import {SendField} from "./SendField"
import {ModalHead} from "./Head"
import {RTEToolBar} from "./rte";
import {SubjectField, TextArea} from "./fields"

import {WriteLetterEventBus, FormDataContext} from "./context";
import {FileFormatter} from "./FileFormatter";

import {EventBus} from "../eventBus"



const WLFooter = ({state}) => {
	return(
		<div className="write__letter__footer__wrapper">
			<button className="write__letter__footer__button write__letter__footer__button__send">
				<span className = "write__letter__footer__button__send__label">{FormatMessage("WL_F_SEND")}</span>
			</button>
			<button className="write__letter__footer__button">
				<span className = "text__primary">{FormatMessage("WL_F_SAVE")}</span>
			</button>
			<button className="write__letter__footer__button" onClick = {e => state(false)}>
				<span className = "text__primary">{FormatMessage("WL_F_CLOSE")}</span>
			</button>
		</div>
	)
}


const DNDZone = () => {
	
	return (
		<div className = "write__letter__dnd__zone__wrapper" 
		>
			<div className = "write__letter__dnd__zone__content" draggable = {false}>
				<img src = {SERVER_URL + "/static/clip.svg"} className = "write__letter__dnd__zone__icon" alt = ""/>
				<div className = "text__primary write__letter__dnd__zone__label">{FormatMessage("WL_DND_LABEL")}</div>
			</div>
		</div>
	)
}

const WriteLetterModalContent = () => {

	const context = useContext(WriteLetterContextModal);


	const [formData, setFormData] = useState({docs: []});

	const [open, setOpen] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [bccFieldsOpened, setBccFieldsOpened] = useState(false);
	const [drag, setDrag] = useState(false);



	const DragStart = (e) => {
		e.preventDefault();
		setDrag(true)
	}

	const DragEnd = (e) => {
		e.preventDefault();
		setDrag(false)
	}

	const onDrop = (e) => {
		e.preventDefault();
		if(drag){
			setDrag(false);
			const files = [...e.dataTransfer.files];
			if(files){
				for(let i = 0; i < files.length; i++){
					FileFormatter(files[i], {s: setFormData, c: formData});
				}
			}
		}
	}


	useEffect(() => {
		context.oc = open;
		context.os = setOpen;
	})




	if(open){
		return(
			<FormDataContext.Provider value={{c: formData, s: setFormData}}>
					<div 
						className="central__modal__wrapper"
						onDragStart = {DragStart}
						onDragEnter = {DragStart}
						onDragOver = {DragStart}
					>
						<div className="central__modal__click__background" onClick = {e => setOpen(false)}/>
						{drag ? <div className="central__modal__dnd__catcher" onDrop={onDrop} onDragLeave = {DragEnd}/> : null}
						<div className="central__modal__wrapper">
							<div 
								className={`central__modal ${expanded ? "central__modal__expanded" : ""}`}
							>
								<ModalHead setOpen = {setOpen} setExpanded = {setExpanded} expanded = {expanded}/>
								<div className='central__modal__content'>
									<div className='wl__fields__wrapper'>
									<div className='wl__field__wrapper wl__field__wrapper__to'>
										<div className="wl__field__label__wrapper">
											<span className = "wl__field__label text__secondary">{FormatMessage("WL_TO")}:</span>
										</div>
										<div className="wl__field__input">
											<SendField/>
											<div className={`wl__bcc__wrapper ${bccFieldsOpened ? "wl__bcc__wrapper__active" : ""}`} onClick={e => (setBccFieldsOpened(!bccFieldsOpened))}>
												<img className = "wl__bcc__icon" src = {SERVER_URL + "/static/chevron_down.svg"} alt = ""  draggable = {false}/>
												<span className = "wl__bcc__label text__primary">{FormatMessage("WL_OPEN_CC")}</span>
											</div>
										</div>
									</div>
									{bccFieldsOpened ? 
									<>
										<div className='wl__field__wrapper'>
											<div className="wl__field__label__wrapper">
												<span className = "wl__field__label text__secondary">{FormatMessage("WL_CC")}:</span>
											</div>
											<div className="wl__field__input">
												<SendField/>
											</div>
										</div>
										<div className='wl__field__wrapper'>
											<div className="wl__field__label__wrapper">
												<span className = "wl__field__label text__secondary">{FormatMessage("WL_BCC")}:</span>
											</div>
											<div className="wl__field__input">
												<SendField/>
											</div>
										</div>
									</>
									: null}
									<SubjectField />
									</div>
									<AttachmentButtonsElement/>
									<AttachmentsElement />
									<hr className="wl__deliminter"/>
									<RTEToolBar/>
									<TextArea/>
								</div>
								<hr className="wl__deliminter"/>
								<WLFooter state = {setOpen}/>
								{drag ? <DNDZone setDrag = {setDrag}/> : null}
							</div>
						</div>
					</div>
			</FormDataContext.Provider>
		)
	}
	return null;
}

const WriteLetterModal = () => {
	return(
		<WriteLetterEventBus.Provider value = {new EventBus()}>
			<WriteLetterModalContent />
		</WriteLetterEventBus.Provider>
	)
}

export  {WriteLetterModal}