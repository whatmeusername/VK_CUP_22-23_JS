import {useRef} from "preact/hooks"

const CustomCheckBox = ({defaultChecked, setActive, id}) => {
	const checkboxRef= useRef();
	return(
		<span class = "checkbox__wrapper" onClick = {e => {
				e.stopPropagation();
				e.preventDefault();
				checkboxRef.current.checked = !checkboxRef.current.checked
				setActive(prev => {
					const item = prev.find(i => i.id === id);
					if(item){
						item.active = checkboxRef.current.checked;
						return [...prev]
					}
					return prev;
				})

			}}>
			<input type="checkbox" class="custom__checkbox" ref = {checkboxRef} defaultChecked = {defaultChecked}/>
			<label/>
		</span>
	)
}


export {CustomCheckBox}