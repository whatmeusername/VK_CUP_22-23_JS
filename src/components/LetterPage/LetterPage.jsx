import { useState , useEffect, useContext} from 'preact/hooks';
import { route } from 'preact-router';
import {FlagIcon, isSameDay, AuthorIconPlaceholder} from "../shared"
import {SERVER_URL} from "../index"
import {HistoryContext} from "../context"

import { FormatDate, FormatMessage, FormatTime} from '../../Intl';

import AttachmentElement from "./AttachmentElement";
import SendedToElement from "./SendedToElement";

import "./letterPageElement.scss"





const getDate = (date) => {
	if(isSameDay(date)){
	
		return FormatMessage("LP_TODAY") + ", " + FormatTime(date, {hour: "2-digit", minute: "2-digit"});
	}
	return FormatDate(date, {day: 'numeric', month: "long", hour: "2-digit", minute: "2-digit"})
}

const LetterPage = ({folder, id}) => {
	const [letterData, setLetterData] = useState(null);

	
	const historyContext = useContext(HistoryContext);
	historyContext.s(true);

	useEffect(() => {
		fetch(`${SERVER_URL}/letters/${folder}/${id}`)
		.then(res => {
			if(res.status === 404){
				route("/")
			}
			else return res.json()
		})
		.then(res => {

			setLetterData(res ?? null);
		})
	}, [id])


	
	if(letterData){

		const date = new Date(letterData.date);
		const author = letterData.author;

		return(
			<div class = "page__content">
				<div className="letter__wrapper">
					<div className="letter__header__wrapper">
						<h2 class = "letter__header text__primary">{letterData.title}</h2>

						{letterData.flag ? 
							<div className="letter__flag__wrapper">
								<FlagIcon flag = {letterData.flag}/>
								<span class = "flag__label text__primary">{letterData.flag}</span>
							</div>
							: null
						}
					</div>
					<div className="letter__author__header">
						<div class = "letter__readed__wrapper">
							<span class = {`letter__readed__dot ${letterData.read ? "letter__dot__read" : "letter__dot__unread"}`}/>
						</div>
						<div class = "author__icon__wrapper">
							{author.avatar ? <img class = "author__icon" src = {SERVER_URL + author.avatar}/> : <AuthorIconPlaceholder name = {author.name}/>}
						</div>
						<div class = "author__information__wrapper">
							<div class = "author__information__upper">
								<span class = "text__primary">
									{author.name} {author.surname}
								</span>
								<span class = "text__secondary letter__date">
									{getDate(date)}
								</span>
								{letterData.important ? 
									<span class = "letter__important__icon__wrapper">
										<img src = {SERVER_URL + "/static/important.svg"}/>
									</span>
								: null
								} 
							</div>	
							<SendedToElement letterData = {letterData}/>
						</div>
					</div>
					{letterData.hasDoc === true
						? 
								<AttachmentElement attachments = {letterData.doc?.img}/>
						: null 
					}
					<div className="letter__content">
						<span class = "text__primary letter__content__text">{letterData.text}</span>
					</div>
				</div>
			</div>
		)
	}
	return <></>
}


export default LetterPage;