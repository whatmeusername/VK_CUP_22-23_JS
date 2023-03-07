
import {FormatMessage} from '../../Intl';

const MapRecipients = (data) => {
	data = data ?? [];
	const res = [FormatMessage("LP_CLIENT")]
	if(data.length >= 3){
		for(let i = 0; i < 3; i++){
			const r = data[i];
			if(r){
				res.push(`${r.name} ${r.surname}`);
			}
		}
	}
	return res;
}


const SendedToElement = ({letterData}) => {

	const sendedTo = letterData?.to ?? [];
	const recipientsArray = MapRecipients(sendedTo);
	const recipientsRemainLength = sendedTo.length - 3;
	const sendedToHeader = (recipientsRemainLength <= 0 ? FormatMessage("LP_TO_LESS") : `${sendedTo.length + 1} ${FormatMessage("LP_TO_MANY", sendedTo.length + 1)}`) + ":"

	return (
		<div class = "author__information__lower text__secondary">
			<span class = "author__letter__label">{sendedToHeader} </span>
			<span class = "author__letter__recipient">{recipientsArray.join(", ")} </span>
			{recipientsRemainLength > 0 ? 
				<span class = "author__letter__remaing__recipients">{FormatMessage("LP_OTHERS")} {recipientsRemainLength} {FormatMessage("LP_TO_MANY", recipientsRemainLength)}</span>
				: null
			}
		</div>
	)
}


export default SendedToElement