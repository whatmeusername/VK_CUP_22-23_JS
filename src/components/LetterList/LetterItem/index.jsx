import {useEffect, useState, useRef, useContext } from "preact/hooks";
import {Link} from "preact-router";
import {FlagIcon, isSameDay, AuthorIconPlaceholder, CreateDragElement} from "../../shared";
import {LetterItemAcitveContext, GlobalKeyValueEventBus} from "../../context";
import {SERVER_URL} from "../../index";


import {AttachmentElement} from "./AttachmentElement";
import {CustomCheckBox} from "./checkbox";
import {BookmarkIcon} from "./bookmark";


import {FormatMessage, FormatTime} from "../../../Intl";




const getDate = (date) => {
	if(isSameDay(date)){
		return FormatTime(date, {hour: 'numeric', minute: '2-digit'})
	}
	return date.getDate() + " " + FormatTime(date, {month: "short"})?.slice(0, 3)
}


const ActiveStateClasses = {
	0: "",
	1: "",
	2: "letter__item__wrapper__bu",
	3: "letter__item__wrapper__bd",
	4: "letter__item__wrapper__br",

}


const LetterItem = ({data, folder, top, setActive, active, activeArray, HandleContextMenu}) => {

	const globalKeyValueEventBus = useContext(GlobalKeyValueEventBus);
	const authorData = data.author;
	const itemRef = useRef();


	const dragElement = useRef();
	const draggingLetters = useRef([]);
	const dragElementCount = dragElement.current && draggingLetters.current?.length > 0 ? `${draggingLetters.current.length} ${FormatMessage("LETTERS", draggingLetters.current.length)}` : null;

	const [activeState, setActiveState] = useState({attachment: false, contextmenu: false})

	const isActiveClass = active > 0 ? "letter__item__checkbox__active" : (activeState.attachment ? "letter__item__attachment__active" : (activeState.contextmenu ? "letter__item__attachment__context" : ""));

	const isReaded = data?.read ?? false;
	const date = new Date(data?.date)
	const hasIconsOrAttachment = (data?.flag !== undefined || data?.hasDoc) ?? false;



	useEffect(() => {
		if(dragElement.current){
			dragElement.current.textContent = dragElementCount;
		}
	}, [dragElement.current])



	const onDrag = (e) => {
		dragElement.current.style.left = e.clientX + "px";
		dragElement.current.style.top = e.clientY + "px";
	}


	const onDragEnd = (e) => {
		if(dragElement.current){
			dragElement.current.style.display = "none";
			document.getElementById("app_content").removeChild(document.getElementById("letter__drag__element__counter"));
			dragElement.current = null
		}
	}

	const onDragStart = (e) => {


		setActive(prev => {
			const item = prev.find(i => i.id === data.id);
			if(item){
				item.active = true;
				return [...prev]
			}
			return prev;
		})
		setActiveState({attachment: false, contextmenu: false})

		const dataTransfer = e.dataTransfer;
		if (!dataTransfer) {
			return false;
		}

		dragElement.current = CreateDragElement("");

		const img = new Image();
		img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

		dataTransfer.setDragImage(img, 0, 0);
		dataTransfer.setData('text/plain', '');

		draggingLetters.current = activeArray.filter(item => item.active).map(item => item.id);
		dataTransfer.setData(
			'letter_drag_event',
			JSON.stringify({
				ids: draggingLetters.current,
				folder: data.folder ?? "mail",
			}),
		);

	}

	const activeClassBorders = ActiveStateClasses[active];


	return (
		<LetterItemAcitveContext.Provider value = {{c: activeState, s: setActiveState, isActive: activeState.attachment || activeState.checkbox}}>
			<Link 
				href = {`/${folder}/${data.id}`} 
				class = {`${isActiveClass} ${activeClassBorders} ${isActiveClass !== "" ? "letter__item__wrapper__active" : "letter__item__wrapper__inactive" } letter__item__wrapper`}
				data-letter-id = {`${data.id}`}
				onClick = {e => false}
				ref = {itemRef}
				style = {{top: `${top}px`}}
				onDragStart = {onDragStart}
				onDrag = {onDrag}
				onDragEnd = {onDragEnd}
				draggable = {true}
				onContextMenu = {e => {
					setActiveState({...activeState, contextmenu: true}); 
					HandleContextMenu(e, data); 
					globalKeyValueEventBus.subscribe("letter__item", "contextMenuClose", () => setActiveState({...activeState, contextmenu: false})) 
				}}
			>
				<div class = "letter__item__read__wrapper">
					<span class = {`letter__item__read ${isReaded ? "letter__item__read__readed" : "letter__item__read__unread"}`}/>
				</div>

				<div class = "letter__item__author__avatar__wrapper">
					{authorData.avatar ? <img src = {SERVER_URL + authorData.avatar} class = "letter__item__author__avatar"/> : <AuthorIconPlaceholder name = {authorData.name}/>}
					<CustomCheckBox defaultChecked = {active > 0} setActive = {setActive} id = {data.id}/>
				</div>

				<div class = "letter__item__content">
					<span class = {`letter__item__author__name text__primary ${!isReaded ? "letter__item__author__name__unread" : ""}`}>{authorData.name} {authorData.surname}</span>
					<div class = "letter__item__bookmark__wrapper">
						{!data?.bookmark && data?.important ? <img src = {SERVER_URL + "/static/important.svg"} class = "letter__item__important"/> : null}
						<BookmarkIcon checked = {data?.bookmark}/>  
					</div>

					<div class = "letter__message__content">
						<div class = "letter__message__text__content text__secondary">
							<span class = {`letter__message__header text__primary  ${!isReaded ? "letter__message__header__unread" : ""}`}>{data?.title ?? ""}</span>
							<span class = "letter__message__text text__secondary">{data?.text ?? ""}</span>
						</div>
					</div>
					<div class = "letter__info__wrapper">
						{hasIconsOrAttachment ? 
							<div class = "letter__icons__wrapper">
								{data?.flag ? <FlagIcon flag = {data?.flag}/> : null}
								{data?.hasDoc ? <AttachmentElement data = {data}/> : null}
							</div>
							: null
						}
						<span class = "letter__date__wrapper text__secondary">
							<span class = "letter__date">{getDate(date)}</span>
						</span>
					</div>
				</div>
				<div class = "letter__delimiter"/>
				<div class = "letter__hover__el"/>
			</Link>
		</LetterItemAcitveContext.Provider>
	)
}


export default LetterItem