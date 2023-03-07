class EventBus{
	constructor(){
		this.subscribes = [];
	}

	subscribe(event, callback){
		this.subscribes.push({event: event, cb: callback});
	}

	emit(event, ...args){
		for(let i = 0; i < this.subscribes.length; i++){
			const sub = this.subscribes[i];
			if(sub.event === event){
				sub.cb(...args);
			}
		}
	}
}

class KeyEventBus{
	constructor(){
		this.subscribes = [];
	}

	subscribe(key, event, cb){
		const e = this.subscribes.find(item => item.key === key && item.event === event);
		if(e){
			e.cb = cb
		}
		else{
			this.subscribes.push({key: key, event: event, cb: cb})
		}

	}

	emit(event, ...args){
		for(let i = 0; i < this.subscribes.length; i++){
			const sb = this.subscribes[i];
			if(sb.event === event){
				sb.cb(...args)
			}
		}
	}
}

export {EventBus, KeyEventBus}