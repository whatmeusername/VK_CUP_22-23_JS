import { useContext} from 'preact/hooks';
import { SERVER_URL } from '../index';
import { FormatMessage } from '../../Intl';
import {FormDataContext} from "./context"
import {FileFormatter} from "./FileFormatter";


const AttachmentButtonsElement = () => {

	const formDataContext = useContext(FormDataContext);

	const fileInputHandler = (e) => {
		const files = e.target.files;
		if(files){
			for(let i = 0; i < files.length; i++){
				FileFormatter(files[i], formDataContext);
			}
		}
	}

	return(
		<div className="wl__attachment__buttons__wrapper">
			<div className="wl__attachment__button__file wl__attachment__button">
				<img src = {SERVER_URL + "/static/clip.svg"} alt = "" className="wl__attachment__button__icon"  draggable = {false}/>
				<span className = "wl__attachment__button__label text__primary">{FormatMessage("WL_ATTACHMENT_FILE")}</span>
				<input className = "wl__attachment__button__input__file" type = "file" multiple value onChange={fileInputHandler}/>
			</div>
			<div className="wl__attachment__button__file wl__attachment__button">
				<img src = {SERVER_URL + "/static/mail.svg"} alt = "" className="wl__attachment__button__icon"  draggable = {false}/>
				<span className = "wl__attachment__button__label text__primary">{FormatMessage("WL_ATTACHMENT_MAIL")}</span>
			</div>
			<div className="wl__attachment__button__file wl__attachment__button">
				<img src = {SERVER_URL + "/static/cloud.svg"} alt = "" className="wl__attachment__button__icon"  draggable = {false}/>
				<span className = "wl__attachment__button__label text__primary">{FormatMessage("WL_ATTACHMENT_CLOUD")}</span>
			</div>
		</div>
	)
}

const AttachmentsElement = () => {
	const formDataContext = useContext(FormDataContext);

	const docs =formDataContext.c.docs;

	const DeleteFile = (id) => {
		formDataContext.s(prev => {
			prev.docs.splice(docs.findIndex(i => i.id === id), 1);
			return {...prev}
		})
	}

	const DeleteAll = () => {
		formDataContext.s(prev => {
			prev.docs = [];
			return {...prev}
		})
	}

	const GetTotalSizeString = () => {
		let res = docs.reduce((p, c) => p + c.size, 0);
		const isMb = res / 1024 > 1;
		return `${Math.round((isMb ? res / 1024 : res), 2)} ${isMb ? "MB" : "KB"}`
	}


	return(
		<div className="write__letter__attachment__block">
			<div className="write__letter__attachments__wrapper">
				{docs.map(doc => {
					const isMB = doc.size / 1024 > 1;
					return(
						<div className="write__letter__attachments__item" key  = {`attachment__item__${doc.id}`}>
								{
									!doc.is_img ? 
										<div className="write__letter__attachments__name__wrapper">
											<span className="write__letter__attachments__name text__primary">{doc.name}</span>
										</div>
									: null
								}
								{
								doc.is_img ? 
									<div className="write__letter__attachments__img__wrapper">
										<img src = {doc.doc} alt = "" className="write__letter__attachments__img" draggable = {false}/>
									</div>
									: 
									<div className="write__letter__attachments__icon__wrapper">
										<img src = {SERVER_URL + "/static/file.svg"} className = "write__letter__attachments__icon" alt = "" draggable = {false}/>
									</div>
								}
							<div className="write__letter__attachments__size__wrapper">
								<span className="write__letter__attachments__size__label text__primary">{Math.round((isMB ? doc.size / 1024 : doc.size), 2)} {isMB ? "MB" : "KB"}</span>
							</div>
							<div className="write__letter__attachments__delete__wrapper" onClick = {e => DeleteFile(doc.id)}>
								<img src = {SERVER_URL + "/static/close.svg"} className = "write__letter__attachments__delete__icon" alt = "" draggable = {false}/>
							</div>
						</div>
					)
				})}
			</div>
			{docs.length > 0 ?
				<div className="write__letter__attachments__info">
					<span className = "text__secondary write__letter__attachments__info__text">{docs.length} {FormatMessage("LP_FILES", docs.length)},</span>
					<span className = "text__secondary write__letter__attachments__info__text">({GetTotalSizeString()})</span>
					<span className = "text__secondary write__letter__attachments__info__text write__attachment__button__delete__all" onClick = {DeleteAll}>{FormatMessage("WL_ATTACHMENT_DELETE")}</span>
				</div>
			: null}
		</div>

	)
}


export {AttachmentsElement, AttachmentButtonsElement}