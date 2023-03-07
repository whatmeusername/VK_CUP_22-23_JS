import {useState, useEffect, useRef, useContext} from "preact/hooks"
import { route } from "preact-router"
import {SERVER_URL} from "../index"
import {ScrollElementContext, GlobalKeyValueEventBus} from "../context"

import LetterItem from "./LetterItem"
import NoResultsFoundElement from "./NoResultFoundElement"

import "./letterListElement.scss"
import { FormatMessage } from "../../Intl"


import { FOLDERS } from "../constraints"


const getQueryStrStartingWith = (search, ...args) => {
	const entries = search.entries();
	const res = [];
	for(const [key, value] of entries) {
		if(args.find(i => key.startsWith(i)) !== undefined) {
			res.push(key + "=" + value);
		}
	  }
	if(res.length > 0){
		return "?" + res.join("&");
	}
	return "";
}



const LETTER_TAKE = 45;
const MAX_LETTERS = LETTER_TAKE * 2;
const LETTER_SIZE = 48;




const ContextMenu = ({letterData, folder, state, setLetter, pos}) => {
	const [moveToModalOpen, setMoveToModalOpen] = useState(false);
	const globalKeyValueEventBus = useContext(GlobalKeyValueEventBus);
	const isFetching = useRef(false)
	const contextMenuRef = useRef();
	const foldersDropdownRef = useRef();


	useEffect(() => {
		if(moveToModalOpen){
			const rms = window.innerWidth - (contextMenuRef.current.offsetWidth + pos.x);
			if(rms > 0){
				foldersDropdownRef.current.classList.add("letter__context__menu__move__to__dropdown__left")
			}
			else{
				foldersDropdownRef.current.classList.add("letter__context__menu__move__to__dropdown__right")
			}
			
		}
	}, [moveToModalOpen])

	useEffect(() => {

		const KeyDownEvent = (e) => {
			const t = e.target;
			if(!contextMenuRef.current.contains(t)){
				globalKeyValueEventBus.emit("contextMenuClose");
				state(false)
			}
		}

		const cmw =  contextMenuRef.current.offsetWidth;
		const cmh = contextMenuRef.current.offsetHeight;
		
		const x = pos.x + cmw > window.innerWidth ? (window.innerWidth - cmw - 50) : (pos.x < cmw + 50 ? cmw + 50 : pos.x);
		const y = pos.y + cmh  > window.innerHeight ? (pos.y - cmh) : pos.y

		contextMenuRef.current.style.left = x + "px"
		contextMenuRef.current.style.top = y + "px"

		window.addEventListener("mousedown", KeyDownEvent)
		return () => {
			globalKeyValueEventBus.emit("contextMenuClose");
			window.removeEventListener("mousedown", KeyDownEvent)
		};
	}, [])


	const MoveToFolder = (slug) => {
		if(!isFetching.current){
			isFetching.current = true;
			fetch(
				SERVER_URL + "/letters/move", 
				{method: "POST", body: JSON.stringify({ids: [letterData.id], folder: slug})}
			).then(res => res.json()).then(res => {
				if(res?.status === 200){
					globalKeyValueEventBus.emit("letterMove", [letterData.id]);
					globalKeyValueEventBus.emit("count_income");
					state(false);
					isFetching.current = false;
				}
			});
		}
	}

	return(
		<div className="letter__context__menu" ref = {contextMenuRef}>
			<a className="letter__context__menu__item letter__context__menu__item__hover" href = {`/${folder}/${letterData.id}/`} target="_blank">
				<span className="letter__context__menu__icon__wrapper">
					<img src = {SERVER_URL + "/static/new_tab.svg"} alt = "" className="letter__context__menu__icon"/>
				</span>
				<span className = "text__primary letter__context__menu__item__text">{FormatMessage("CM_NEW_TAB")}</span>
			</a>

			<hr className="context__menu__deliminter"/>

				<div 
					className="letter__context__menu__item letter__context__menu__item__hover"
					onClick = {e => {MoveToFolder("deleted")}}
				>
					<span className="letter__context__menu__icon__wrapper">
						<img src = {SERVER_URL + "/static/bucket.svg"} alt = "" className="letter__context__menu__icon"/>
					</span>
					<span className = "text__primary letter__context__menu__item__text">{FormatMessage("CM_DELETE")}</span>
				</div>

				<div 
					className="letter__context__menu__item letter__context__menu__item__hover"
					onClick = {e => {MoveToFolder("archive")}}
				>
					<span className="letter__context__menu__icon__wrapper">
						<img src = {SERVER_URL + "/static/archive.svg"} alt = "" className="letter__context__menu__icon"/>
					</span>
					<span className = "text__primary letter__context__menu__item__text">{FormatMessage("CM_ARCHIVE")}</span>
				</div>

				<div 
					className="letter__context__menu__item letter__context__menu__item__hover"
					onClick = {e => {MoveToFolder("spam")}}
				>
					<span className="letter__context__menu__icon__wrapper">
						<img src = {SERVER_URL + "/static/spam.svg"} alt = "" className="letter__context__menu__icon"/>
					</span>
					<span className = "text__primary letter__context__menu__item__text">{FormatMessage("CM_SPAM")}</span>
				</div>

				<div 
					className={`
						letter__context__menu__item 
						letter__context__menu__item__hover 
						letter__context__menu__item__move__to 
						${moveToModalOpen ? "letter__context__menu__item__move__to__active" : ""}
					`}
					onClick = {e => setMoveToModalOpen(!moveToModalOpen)}
					>
					<span 
						className = "letter__context__menu__item__move__to__content"
					>
						<span className = "letter__context__menu__item__move__to__content__label">
							<span className="letter__context__menu__icon__wrapper">
								<img src = {SERVER_URL + "/static/folder.svg"} alt = "" className="letter__context__menu__icon"/>
							</span>
							<span className = "text__primary letter__context__menu__item__text">{FormatMessage("CM_MOVE_TO")}</span>
						</span>
						<span>
							<span className="letter__context__menu__icon__wrapper">
								<img src = {SERVER_URL + "/static/chevron_left.svg"} alt = "" className="letter__context__menu__icon letter__context__menu__chevron"/>
							</span>
						</span>
					</span>
					{moveToModalOpen ? 
						<div className="letter__context__menu__move__to__dropdown" ref = {foldersDropdownRef}>
							{FOLDERS.map(item => {
								if(	item.slug === folder){
									return(
										<div className="letter__context__menu__item letter__context__menu__item__current">
											<span className="letter__context__menu__icon__wrapper">
												<img src = {SERVER_URL + `/static/${item.icon}.svg`} alt = "" className="letter__context__menu__icon"/>
											</span>
											<span className = "text__primary letter__context__menu__item__text">{FormatMessage(item.localeKey)}</span>
										</div>
									)
								}
								else{
									return(
										<div 
											className="letter__context__menu__item letter__context__menu__item__hover"
											onClick = {e => {MoveToFolder(item.slug)}}
										>
											<span className="letter__context__menu__icon__wrapper">
												<img src = {SERVER_URL + `/static/${item.icon}.svg`} alt = "" className="letter__context__menu__icon"/>
											</span>
											<span className = "text__primary letter__context__menu__item__text">{FormatMessage(item.localeKey)}</span>
										</div>
									)
								}
							})}
						</div>
					: null}
				</div>
			<hr className="context__menu__deliminter"/>
				<div 
					className="letter__context__menu__item letter__context__menu__item__hover"
					onClick = {e => {
						if(!isFetching.current){
							isFetching.current = true;
							fetch(SERVER_URL + "/letters/update", {
								body: JSON.stringify({attr: "read", next: !letterData.read, ids: [letterData.id]}),
								method: "POST"
							}).then(res => res.json()).then(res => {
								if(res?.status === 200){
									setLetter(prev => {
										const item = prev.find(item => item.id === letterData.id)
										item.read = !item.read;
										return [...prev];
									})
									globalKeyValueEventBus.emit("count_income");
									state(false);
									isFetching.current = false;
								}
							})
						}
					}}
				>
					<div class = "letter__context__menu__icon__wrapper">
						<div class = {`letter__item__read ${letterData.read ? "letter__item__read__unread" : "letter__item__read__readed"}`}/>
					</div>
					<span className = "text__primary letter__context__menu__item__text">{FormatMessage(letterData.read ? "CM_READ" : "CM_UNREAD")}</span>
				</div>
				<div 
					className="letter__context__menu__item letter__context__menu__item__hover" 
					onClick = {e => {
						if(!isFetching.current){
							isFetching.current = true;
							fetch(SERVER_URL + "/letters/update", {
								body: JSON.stringify({attr: "bookmark", next: !letterData.bookmark, ids: [letterData.id]}),
								method: "POST"
							}).then(res => res.json()).then(res => {
								if(res?.status === 200){
									setLetter(prev => {
										const item = prev.find(item => item.id === letterData.id)
										item.bookmark = !item.bookmark;
										return [...prev];
									})
									state(false);
									isFetching.current = false;
								}
							})
						}
					}}>
					<span className="letter__context__menu__icon__wrapper">
						<img src = {SERVER_URL + `/static/${letterData.bookmark ? "bookmark" : "bookmark_fill"}.svg`} alt = ""/>
					</span>
					<span className = "text__primary letter__context__menu__item__text">{FormatMessage(letterData.bookmark ? "CM_UNFLAG" : "CM_FLAG")}</span>
				</div>
		</div>
	)
}


const LettersListContent = ({folder}) => {
	const [letters, setLetter] = useState(null);
	const [activeLetters, setActiveLetters] = useState([]);

	
	folder = folder === "" ? "mail" : folder;


	const filterQuery = getQueryStrStartingWith(new URLSearchParams(location.search), "filter", "sort");

	const letterListRef = useRef();
	const scrollAble = useContext(ScrollElementContext);
	const globalKeyValueEventBus = useContext(GlobalKeyValueEventBus);

	const [offset, setOffset] = useState(0);
	const [screenItems, setScreenItems] = useState(0);

	const currentGroupId = useRef(0);
	const fetchingData = useRef(false);
	const hasNext = useRef(true);


	const [contextMenuOpened, setContextMenuOpened] = useState(false);
	const [contextMenuLetterData, setContextMenuLetterData]  = useState(null);
	const [contextMenuPos, setContextMenuPos] = useState({x: 0, y: 0});


	const getActiveStateNumber = (idx) => {
		let p = activeLetters[idx - 1]?.active;
		let c = activeLetters[idx]?.active;
		let n = activeLetters[idx + 1]?.active;

	
		if(p && c && n) return 4;
		else if(n && c) return 3;
		else if(p && c) return 2;
		return c ? 1 : 0;
	}

	const FetchData = (direction, willTake, replace) => {

		const fetch_offset = !replace ? (currentGroupId.current > 0 ? MAX_LETTERS + (LETTER_TAKE * currentGroupId.current) : MAX_LETTERS) : 0;


		fetch(SERVER_URL + `/letters/${folder ?? ""}${filterQuery}${filterQuery === "" ? "?" : "&"}take=${willTake ?? LETTER_TAKE}&offset=${fetch_offset}`)
		.then(res => {
			if(res.status === 404){
				route("/")
			}
			else return res.json()
		})
		.then(res => {
			if(!replace && letters?.length > 0){
				if(direction === "next"){
					const newActive = res.map(item => {return {id: item.id, active: false}})
					setLetter(prev => {
						return [...prev, ...res]
					});
					setActiveLetters(prev => [...prev, ...newActive])
				}
			}
			else{
				res = res ?? [];
				setLetter(res);
				const newActive = res.map(item => {return {id: item.id, active: false}})
				setActiveLetters(newActive)
			}
			

			fetchingData.current = false;
			hasNext.current = res.length >= LETTER_TAKE;
		})
	}

	useEffect(() => {


		setScreenItems(Math.floor(scrollAble.current.offsetHeight / LETTER_SIZE));

		globalKeyValueEventBus.subscribe("letter_list", "letterMove", (ids) => {
			if(ids.length > 0){
				setActiveLetters(prev => {
					return [...prev.filter(item => !ids.includes(item.id))];
				})
				setLetter(prev => {
					return [...prev.filter(item => !ids.includes(item.id))];
				})
			}
		})

		const resizeEvent = (e) => {
			const next = Math.floor(scrollAble.current.offsetHeight / LETTER_SIZE);
			if(screenItems !== next){
				setScreenItems(next);
			}
		}
		window.addEventListener("resize", resizeEvent);
		return () => window.removeEventListener("resize", resizeEvent);
		
	}, [])

	
	useEffect(() => {
		setOffset(0);
		scrollAble.current.scrollTo({top: 0})
		currentGroupId.current = 0;

		FetchData(null, MAX_LETTERS, true);
	}, [folder, filterQuery])



	useEffect(() => {
		if(letters && letterListRef.current){
			const height = LETTER_SIZE * letters.length;
			const llr = letterListRef.current.style;
			llr.height = `${height}px`;
			llr.maxHeight = `${height}px`;
			llr.minHeight = `${height}px`;
		}
	}, [letters?.length])


	useEffect(() => {
		if(scrollAble.current){
			const scrollEvent = () => {
				const letters_listed = Math.floor(scrollAble.current.scrollTop / LETTER_SIZE);
				setOffset(letters_listed < 0 ? 0 : letters_listed);
				if(letters && hasNext.current && !fetchingData.current && letters_listed > letters.length - LETTER_TAKE){
					fetchingData.current = true;
					FetchData("next")
					currentGroupId.current += 1;
				}
			}
			scrollAble.current.addEventListener("scroll", scrollEvent)
			return () => scrollAble.current?.removeEventListener("scroll", scrollEvent);
		}
	}, [screenItems, letters])




	const HandleContextMenu = (e, letter) => {
		e.preventDefault();
		setContextMenuLetterData(letter);
		setContextMenuPos({x: e.pageX, y: e.pageY});
		setContextMenuOpened(true)
	}


	useEffect(() => {
		if(contextMenuOpened){
			const scrollEvent = (e) => {
				setContextMenuOpened(false);
				window.removeEventListener("mousedown", clickEvent);
				scrollAble.current?.removeEventListener("scroll", scrollEvent);
			}
			scrollAble.current.addEventListener("scroll", scrollEvent);
			return () => scrollAble.current.removeEventListener("scroll", scrollEvent);
		}
	}, [contextMenuOpened, contextMenuPos])

	if(letters && letters.length > 0){
		const sliceStart = offset - 8 < 0 ? 0 : offset - 8;
		const sliceEnd = (screenItems + 8) + offset;
		return(
			<>
			<div 
				class = "page__content letter__list__desktop letter__list__scroll" 
				ref = {letterListRef}
			>
				{(letters.slice(sliceStart, sliceEnd)).map((letter, i) => {
					const idx = sliceStart + i
					const marginTop = (idx) * LETTER_SIZE;
					const activeState = getActiveStateNumber(idx);

					return (
						<LetterItem 
							data = {letter} 
							folder = {folder} 
							key = {`letter-item-${letter.id}`}
							top = {marginTop}
							setActive = {setActiveLetters}
							active = {activeState}
							activeArray = {activeLetters}
							HandleContextMenu = {HandleContextMenu}
						/>

					)
				})}
			</div>
			{contextMenuOpened ? 
				<ContextMenu letterData = {contextMenuLetterData} folder = {folder} state = {setContextMenuOpened} setLetter = {setLetter} pos = {contextMenuPos}/>
				: null
			}
			</>
		)
	}
	else if(letters && letters.length === 0){
		return <NoResultsFoundElement/>
	}
	return null;
}


const LettersList = ({folder}) => {
	return(
		<LettersListContent key = {folder} folder = {folder}/>
	)
}

export default LettersList