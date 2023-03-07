import { useState , useContext, useRef, useEffect} from 'preact/hooks';
import {Router} from 'preact-router';
import {ThemeContext, HistoryContext, ScrollElementContext, SettingModalContext, WriteLetterContextModal, GlobalKeyValueEventBus} from "./context"
import {GetOrSetTheme} from "./shared"

import LetterPage from "./LetterPage/LetterPage"

import Header from './header/index';
import Sidebar from "./sidebar"
import LettersList from "./LetterList"
import {SettingModal} from "./SettingModal"
import {WriteLetterModal} from "./WriteLetterModalElement"

import {IntlProvider, LOCALES, MESSAGES} from "../Intl"
import {KeyEventBus} from "./eventBus"






const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000" : location.origin;








const AppContent = () => {

	const historyContext = useContext(HistoryContext);

	const [theme, setTheme] = useState(GetOrSetTheme());
	const [settingModalOpen, setSettingModalOpen] = useState(false)
	const scrollAbleElementRef = useRef();

	const HandleRoute = (e) => {
		if(e.current.type.name === "LetterPage"){
			historyContext.s(true)
		}
		else historyContext.s(false)
	}

	const appStyle = theme?.background ? {background: theme?.background(SERVER_URL)} : {}

	return(
		<div id="app_content" class = {`app ${theme?.appliedClass}`} style = {appStyle}>
			<IntlProvider defaultLocale = {"RUSSIAN"} locales = {LOCALES} messages = {MESSAGES}>
				<ThemeContext.Provider value = {{c: theme, s: setTheme}}>
						<div class = {`app__wrapper ${settingModalOpen ? 'app__wrapper__reduce' : ""}`}>
							<Header />
							<div class = "app__content__wrapper">
									<SettingModalContext.Provider value = {{s: setSettingModalOpen, c: settingModalOpen}}>
										<Sidebar/>
										<div class = "letter__layout" ref = {scrollAbleElementRef}>
											<ScrollElementContext.Provider value = {scrollAbleElementRef}>
												<div class="page__content__wrapper">
													<Router onChange={HandleRoute}>
														<LettersList path="/:folder?"/>
														<LetterPage path = "/:folder/:id"/>
													</Router>
												</div>
											</ScrollElementContext.Provider>
										</div>
									</SettingModalContext.Provider>
							</div>
						</div>
						{settingModalOpen ? <SettingModal setOpenState = {setSettingModalOpen}/> : null}
						<WriteLetterModal/>
				</ThemeContext.Provider>
			</IntlProvider>
		</div>
	)
}

const App = () => {

	useEffect(() => {
		document.addEventListener("dragover", e => e.preventDefault());
		return () => document.removeEventListener("dragover", e => e.preventDefault());
	}, []);

	return(
		<HistoryContext.Provider value = {useContext(HistoryContext) ?? {prevPath: null, s: null}}>
			<GlobalKeyValueEventBus.Provider value = {new KeyEventBus()}>
				<WriteLetterContextModal.Provider value = {{oc: false, os: null}}>
						<AppContent/>
				</WriteLetterContextModal.Provider>
			</GlobalKeyValueEventBus.Provider>
		</HistoryContext.Provider>
	)
}



export {SERVER_URL}
export {App};
