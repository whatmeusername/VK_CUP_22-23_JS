import { useState, useRef, useEffect} from 'preact/hooks';
import { SERVER_URL } from '../index';
import { EventBus } from '../eventBus';

const isMatchMailPattern = (string) => {
	return /^\S+.*\@[^\s\@]+\.[^\s\@]+$/.test(string);
}


const SelectedMailElement = ({data, state, selected}) => {

	const [editMode, setEditMode] = useState(false);
	const editInput = useRef();
	const textWidth = useRef(0);
	const textRef = useRef();

	const handleDelete = (e) => {
		state(selected.filter(item => item.id !== data.id));
	}


	const ConfirmEdit = () => {
		state(prev => {
			const item = prev.find(item => item.id === data.id);
			item.mail = editInput.current.value.trim();
			item.isMatch = isMatchMailPattern(item.mail);
			return [...prev];
		})
		setEditMode(false);
	}

	useEffect(() => {
		if(editMode){
			editInput.current.focus();
			editInput.current.style.width = `${editInput.current.value.length * 8}px`
		}
		else{
			textWidth.current = textRef.current.textContent.length * 8;
		}
	}, [editMode])


	const onKeyDown = (e) => {
		if(e.code === "Enter"){
			e.preventDefault();
			ConfirmEdit()
		}
		else editInput.current.style.width = `${20 + (editInput.current.value.length * 8)}px`
	}


	return(
		<span 
			className={`selected__reciver ${editMode ? "selected__reciver__edit" : ""} ${!editMode && data.isMatch ? "selected__reciver__matched" : "selected__reciver__umatched"}`}
		>
			{editMode ? 
				<div className='selected__reciver__mail__input__wrapper'>
					<input 
						type = {"text"} 
						className = "selected__reciver__mail__input" 
						defaultValue={data.mail} 
						ref = {editInput}
						onBlur = {ConfirmEdit}
						onKeyDown = {onKeyDown}
						style = {{width: `${textWidth.current}px`}}
					/>
				</div>
			: 
				<span onClick = {e => setEditMode(true)} className = "selected__reciver__mail__content">
					{data.isMatch ? <span className="selected__reciver__avatar">{data.mail[0]}</span> : null}
					<span className="selected__reciver__mail" ref = {textRef}>{data.mail}</span>
				</span>
			}
			<span className="selected__reciver__delete" onClick = {handleDelete}>
				<img src = {SERVER_URL + "/static/close.svg"} className = "selected__reciver__delete__icon" alt = ""  draggable = {false}/>
			</span>
		</span>
	)
}



const SelectedMails = ({eventBus}) => {


    const [selected, setSelected] = useState([]);

    useEffect(() => {
        eventBus.current.subscribe("append", (item) => {
            setSelected(prev => {
                return [...prev, item]
            })
        })
        eventBus.current.subscribe("removeFromEnd", () => {
            setSelected(prev => {
                if(prev.length > 0){
                    return prev.slice(0, prev.length - 1);
                }
                return prev;
            })
        })
    }, [])

    return(
        <>
            {selected.map(item => {
				return(
					<SelectedMailElement data = {item} key = {`receiver__item__${item.id}`} state = {setSelected} selected = {selected}/>
				)
			})}
        </>
    )
}

const SendField = () => {


	const inputFieldRef = useRef();


    const eventBus = useRef(new EventBus());




	const onBlur = (e) => {
		inputFieldRef.current.style.width = "";
	}

	const onFocus = (e) => {
		const c = inputFieldRef.current
		let width = 30 + (c.value.length * 8);
		if(width < 50){
			inputFieldRef.current.style.width = `100%`;
		}
		else inputFieldRef.current.style.width = `${width}px`;
	}


	const onFieldInput = (e) => {
		const c = inputFieldRef.current;
		if((e.code === "Enter" && c.value.length > 0) || (e.code === "Space" && c.value.includes("@"))){
			const trimmedValue = c.value.trim();
			c.value = "";
            eventBus.current.emit("append", {id: Math.random().toString(36).slice(5, 10), mail: trimmedValue, isMatch: isMatchMailPattern(trimmedValue)})
		}
		else if(e.code === "Backspace" && c.selectionStart === 0 && c.selectionEnd === 0){
			c.value = "";
            eventBus.current.emit("removeFromEnd")
		}	
		else{
			c.style.width = `${30 + (c.value.length * 8)}px`;
		}
	}


	const onPasteEvent = (e) => {
		const c = inputFieldRef.current;
		e.preventDefault();
		let text = e.clipboardData.getData('Text')
		text = text.length > 0 ? text : e.clipboardData.files?.[0]?.name ?? "";
		if(text && text.length > 0){
            eventBus.current.emit("append", {id: Math.random().toString(36).slice(5, 10), mail: text, isMatch: isMatchMailPattern(text)})
		}
	}


	return(
		<div 
			onFocus={FocusEvent}
			className = "receiver__field__wrapper"
		>
            <SelectedMails eventBus={eventBus}/>
			<div className='content__input__wrapper'>
				<input 
					className="content__input" 
					onPaste={onPasteEvent} 
					ref = {inputFieldRef} 
					onKeyUp = {onFieldInput} 
					onBlur = {onBlur}
					onFocus = {onFocus}
				/>
			</div>
		</div>
	)
}


export {SendField}