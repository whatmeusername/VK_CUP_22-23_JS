import { SERVER_URL } from '..';
import {FormatMessage} from '../../Intl';


const AttachmentElement = ({attachments}) => {

	let SizeInMBTotal = 0;

	const downloadLabel = attachments.length > 1 ?  FormatMessage("LP_FILE_DOWNLOAD_MANY") : FormatMessage("LP_FILE_DOWNLOAD");
	return(
		<div className="letter__attachments__wrapper">
			<div className="letter__attachments__content">
				{attachments.map((item, i) => {
					SizeInMBTotal += item.size;
					return (
						<div class = "letter__attachment__wrapper" key = {`attachment__item__${i}`}>
							<img class = "letter__attachment" src = {SERVER_URL + item.url} alt = "" />
						</div>
					)
				})}
			</div>
			<div className="letter__attachments__information">
				<span class = "letter__attachments__count text__primary">
					{attachments.length} {FormatMessage("LP_FILES", attachments.length)}
				</span>
				<span class = "letter__attachments__download__wrapper">
					<span class = "text__link">{downloadLabel} </span>
					<span class = "text__link text__secondary">({(SizeInMBTotal / 1024 > 1 ? SizeInMBTotal / 1024 : SizeInMBTotal).toFixed(1)}{SizeInMBTotal / 1024 > 1 ? "MB" : "KB"})</span>
				</span>
			</div>
		</div>
	)
}

export default AttachmentElement;