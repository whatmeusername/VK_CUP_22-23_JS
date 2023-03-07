const IMAGES_EXT = ["png", "jpg", "jpeg", "gif", "webp"];
const ALLOWED_EXT = ["png", "jpg", "jpeg", "gif", "webp", "svg", "ico", "docx", "pdf", "pptx"]
const FileFormatter = (file, formDataContext) => {
	const reader = new FileReader();
	reader.readAsDataURL(file);

	reader.onload = function () {
	  const ext = file.name.slice(Math.max(0, file.name.lastIndexOf(".")) + 1);
	  if(ALLOWED_EXT.includes(ext)){
		const res = {
			doc: reader.result,
			ext: ext,
			name: file.name,
			size: Math.round(file.size / 1024, 2),
			is_img: IMAGES_EXT.includes(ext),
			id: Math.random().toString(36).slice(5, 10),
		}
		formDataContext.s(prev => {
			prev.docs = [...prev.docs, res];
			return {...prev};
		})
	  }
	};
	reader.onerror = function (error) {
	  console.log('Error: ', error);
	};
}



export {FileFormatter}