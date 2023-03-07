import {useState, useContext, useEffect} from "preact/hooks"
import {Link} from "preact-router";
import {HistoryContext, GlobalKeyValueEventBus} from "../context"
import {WriteLetterBtn, SettingButton, BarButton} from "./buttons"
import {SERVER_URL} from "../index"
import {FOLDERS} from "../constraints"
import {FormatMessage} from "../../Intl"

import "./sidebar.scss"




const userFolders = ["mail", "important", "send", "drafts", "archive", "spam", "deleted"]
const getIntialSelected = () => {

	if(typeof window === "undefined") return "mail";

	let ActivePath = location?.pathname?.split("/").filter(it => it)
	return userFolders.includes(ActivePath[0]) ? ActivePath[0] : "mail";
}



const FolderGroup = () => {



	const [selected, setSelected] = useState(getIntialSelected())
	const [incomeCount, setIncomeCount] = useState(0);
	const [isHover, setHover] = useState("")
	const historyContext = useContext(HistoryContext)
	const globalKeyValueEventBus = useContext(GlobalKeyValueEventBus);
	historyContext.prevPath = "/" + selected;


	const FetchCount = () => {
		// Запрос подсчета количество непрочитанных письм во входящих
		fetch(SERVER_URL + "/count").then(res => res.json()).then(res => setIncomeCount(res?.count ?? 0))
	}

	useEffect(() => {


		FetchCount();
		globalKeyValueEventBus.subscribe("income_fetch", "count_income", () => FetchCount());

		// Так как сайдбар не входит в элемент роутера, 
		// то для контроля за состоянием URL и сихронизации выбора текузий папки используем MutationObserver
		let currentPath = location.pathname;
		const mutationObserver = new MutationObserver(() => {
			if(location.pathname !== currentPath){
				setSelected(getIntialSelected());
				currentPath = location.pathname;
			}
		})

		mutationObserver.observe(document, {subtree: true, childList: true});
		return () => mutationObserver.disconnect();
	}, [])




	const onDrop = (e, slug) => {
		const data = e.dataTransfer.getData("letter_drag_event")
		if(data){
			const parsed = JSON.parse(data);
			if(parsed.folder !== slug){
				fetch(
					SERVER_URL + "/letters/move", 
					{method: "POST", body: JSON.stringify({ids: parsed.ids, folder: slug})}
				).then(res => res.json()).then(res => {
					if(res?.status === 200){
						globalKeyValueEventBus.emit("letterMove", parsed.ids);
						FetchCount();
					}
				});
			}
		}
		setHover("");
	}

	const onDragEnter = (e, slug) => {
		e.preventDefault();
		if(isHover !== slug && [...e.dataTransfer.items].find(ListItem => ListItem.type === "letter_drag_event")){
			setHover(slug);
		}
	}

	const onDragLeave = (e) => {
		setHover("");
	}



	return(
		<div class = "folder__group">
			<BarButton/>
			{FOLDERS.map(item => {


				return(

					<Link 
						class = {`folder__group__item ${isHover === item.slug && selected !== item.slug ? "sb__selected__hover" : ""} ${selected === item.slug ? "sb__selected" : "sb__inactive sidebar__item__hover"}`}
						href = {`/${item.slug}`}
						onClick = {e => {
							setSelected(item.slug)
						}}
						key = {`sidebar__item__${item.icon}`}
						onDragEnter = {(e) => onDragEnter(e, item.slug)}
						onDragOver = {e => onDragEnter(e, item.slug)}
						onDragLeave = {onDragLeave}
						onDrop = {e => onDrop(e, item.slug)}
					>
						<span class = "sidebar__item__label" draggable = {false}>
							<img 
								class = "folder__group__item__icon"
								src = {`${SERVER_URL}/static/${item.icon}.svg`}
								alt = ""
								draggable = {false}
							/>
							<span class = "text__sidebar">{FormatMessage(item.localeKey)}</span>
						</span>
						{item.isDefault ? 
							<span class = "sidebar__item__count">
								{incomeCount > 999 ? "999+" : incomeCount}
							</span>	
							: null
						}
					</Link>
				)
			})}
			<hr class = "sidebar__content__line"/>

			<button class = "folder__group__new__folder__btn">
				<img class = "folder__group__item__icon" src = {SERVER_URL + "/static/add.svg"}/>
				<span class = "folder__group__new__folder__btn__label">{FormatMessage("SIDEBAR_FG_NEW_FOLDER")}</span>
			</button>

		</div>
	)
}



const Sidebar = () => {
	return(
		<div class = "sidebar__wrapper">
			<div class = "sidebar__content">
				<div class = "sidebar__content__upper">
					<WriteLetterBtn/>
					<FolderGroup/>
				</div>
				<div class = "sidebar__content__lower">
					<SettingButton/>
				</div>
			</div>
		</div>
	)
}


export default Sidebar