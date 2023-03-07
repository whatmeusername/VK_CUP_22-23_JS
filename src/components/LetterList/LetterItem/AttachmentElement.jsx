import { useRef, useContext, useState, useEffect } from "preact/hooks";
import {LetterItemAcitveContext, ScrollElementContext} from "../../context"
import {SERVER_URL} from "../../index"
import {FormatMessage} from "../../../Intl"

const AttachmentElement = ({data}) => {


	const LetterItemAcitve = useContext(LetterItemAcitveContext);
	const scrollElement = useContext(ScrollElementContext)?.current;

	const [isOpened, setOpened] = useState(false);
	const AttachmentElementRef = useRef();
	const AttachmentElementBtbRef = useRef();


	const docs = data.doc.img;

	useEffect(() => {
		if(isOpened && scrollElement){

			if(AttachmentElementRef.current === null || AttachmentElementBtbRef.current === null) return;

			function clickEvent(e){
				if(AttachmentElementBtbRef.current.contains(e.target)){

					window.removeEventListener("mousedown", clickEvent)
					scrollElement?.removeEventListener("scroll", scrollEvent)
				}
				else if(!AttachmentElementRef.current.contains(e.target)){
					setOpened(false);
					LetterItemAcitve.s({...LetterItemAcitve.c, attachment: false});

					window.removeEventListener("mousedown", clickEvent)
					scrollElement?.removeEventListener("scroll", scrollEvent)
				}
			}

			function scrollEvent(e){
				setOpened(false);
				LetterItemAcitve.s({...LetterItemAcitve.c, attachment: false});
				window.removeEventListener("mousedown", clickEvent)
				scrollElement?.removeEventListener("scroll", scrollEvent)
			}
	
			scrollElement?.addEventListener("scroll", scrollEvent);
			window.addEventListener("mousedown", clickEvent)
			return () => {
				window.removeEventListener("mousedown", clickEvent);
				scrollElement?.removeEventListener("scroll", scrollEvent)
			}
		}
	}, [isOpened])

	return (
		<div 
			class = "letter__attachment__wrapper"
			onClick = {e => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			{isOpened && docs ? 
				<div 
					class = "letter__attachments__left_drowndown"
					ref = {AttachmentElementRef}
				>
					<div class = "letter__attachments__list">
					{docs.map((doc, i) => {


						const fileRef = useRef();
						const fileDropdown = useRef();

						useEffect(() => {
							const attachmentRectTop = AttachmentElementRef.current.getBoundingClientRect().top;
							const imageHeight = (fileRef.current.naturalHeight / fileRef.current.naturalWidth) * 264;
							const isOverflow = attachmentRectTop - scrollElement.offsetTop - imageHeight < 0;
							if(isOverflow){
								fileDropdown.current.classList.add("letter__attachments__item__drowndown__top")
							}
							else{
								fileDropdown.current.classList.add("letter__attachments__item__drowndown__bottom")
							}
						})

						const size = (doc.size / 1024 > 1 ? doc.size / 1024 : doc.size).toFixed(1);
						const sizeUnit = doc.size / 1024 > 1 ? "MB" : "KB"
						
						return(
							<div class = "letter__attachments__item" key = {`letter__attachment__item__${i}`}>
								<img src={SERVER_URL + doc.url} class = "letter__attachments__item__picture" ref = {fileRef} draggable = {false}/>
								<span class = "letter__attachments__item__label text__primary">{doc.name} {doc.ext} {size}{sizeUnit} </span>
								<div class = "letter__attachments__item__drowndown__margin" ref = {fileDropdown}>
									<div class = "letter__attachments__item__drowndown">
										<div class = "letter__attachments__item__drowndown__img__wrapper">
											<img src={SERVER_URL + doc.url} class = "letter__attachments__item__drowndown__img" draggable = {false}/>
											<div class = "letter__attachments__item__drowndown__download__wrapper">
												<button class = "letter__attachments__item__drowndown__download__button">
													<img src = {SERVER_URL + "/static/download.svg"} class = "icon__primary" alt = "" draggable = {false}/>
													<span class = "text__primary">{FormatMessage("ATTACHMENT_DOWNLOAD")}</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						)
					})}
					</div>
				</div>
			: null}
			<div 
				className={`${isOpened ? "attachment__clickable__wrapper__active" : ""} attachment__clickable__wrapper`}
				onClick = {e => {
					LetterItemAcitve.s({...LetterItemAcitve.c, attachment: !isOpened});
					setOpened(!isOpened);
				}}
				ref = {AttachmentElementBtbRef}
			>
				<img src = {SERVER_URL + "/static/clip.svg"} class = "attachment__icon" alt = "" draggable = {false}/>
			</div>
		</div>
	)
}

export {AttachmentElement}