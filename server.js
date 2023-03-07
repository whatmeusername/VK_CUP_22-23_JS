


// PRODUCTION ONLY 
// const {readFile, statSync, createReadStream, existsSync} = require('fs');
// const {join, extname} = require('path');
// const {createServer} = require("http");
// const {parse: urlParse} = require("url");
// const {parse: queryParse} = require("querystring");


// DEV

import {readFile, statSync, createReadStream, existsSync} from "fs";
import {join, extname, dirname} from "path";
import {createServer} from "http";
import {parse as urlParse, fileURLToPath}  from "url";
import {parse as queryParse} from 'querystring';
const __dirname = dirname(fileURLToPath(import.meta.url));




class App{
    constructor(){
        this.routes = {}
        this.server = createServer((req, res) => {

            req.on("data", (chunk) => {
                if (chunk instanceof Buffer) {
                    req.body = chunk.toString();
                } else {
                    req.body = chunk;
                }
            });

            req.once("end", () => {
                this.handle(req, res);
            })
        });
        this.urls = [];
        this.middleware = [];
    }



    use(middleware){
        if(typeof middleware === 'function'){
            this.middleware.push(middleware);
        }
    }

    runMiddleware(request, response){
        let res = true;
        for(let i = 0; i < this.middleware.length; i++){
            res = this.middleware[i](request, response);
            if(!res) return false;
        }
        return res;
    }

    get(path, callback){
        if(!this.routes[path + "#GET"]){
            this.routes[path + "#GET"] = callback
        }
    }

    post(path, callback){
        if(!this.routes[path + "#POST"]){
            this.routes[path + "#POST"] = callback
        }
    }

    handle(request, response){
        const urlData = urlParse(request.url);
        const urlParams = urlData.pathname.split("/").slice(1);
        let isFounded = false;

        
        request.params = null;
        request.query =  Object.assign({}, urlData.query ? queryParse(urlData.query) : {});
        const res = this.runMiddleware(request, response);

        if(!res) return;

        if(urlParams.length === 1 && urlParams[0] === "" && this.routes["/"]){
            const rResponse =this.routes["/"](request, response);
            if(rResponse === false){
                response.writeHead(404).end();
            }
            return;
        }

        for(let i = 0; i < this.urls.length; i++){
            const urlData = this.urls[i];

            if(urlData.method !== request.method) continue;


            const url = urlData.url;

            let result = true;
            const params = {}


            if(url.length !== urlParams.length){
                continue;
            }

            for(let j = 0; j < url.length; j++){
                if(url[j] && !urlParams[j]){
                    result = false;
                    break;
                }

                const isOptional = url[j].startsWith(":");
                if(isOptional) params[url[j].slice(1)] = urlParams[j];
                if(isOptional && !urlParams[j]){
                    result = false;
                    break;
                }
                else if(!isOptional && url[j] !== urlParams[j]){
                    result = false;
                    break;
                }
            }
            if(result){
                request.params = params;
                const rResponse = this.routes[urlData.f](request, response);
                if(rResponse === false){
                    return response.writeHead(404).end();
                }
                isFounded = true;
                break;
            }
        }
        if(!isFounded){
            response.writeHead(404).end();
        }
    }

    listen(port, callback){
        const urls = Object.keys(this.routes);
        for(let i = 0; i < urls.length; i++){
            const [url, method] = urls[i].split("#")
            this.urls.push({url: url.split("/"), method: method, f: urls[i]});
        }
        this.server.listen(port, () => callback(port));
    }
}

let data = null;
const file_data = [];
const availableFolders = {
    mail: undefined,
    archive: "Архив",
    send: "Отправленные",
    deleted: "Корзина",
    important: "Важное",
    spam: "Спам",
    drafts: "Черновики",
};
const availableFoldersKeys = Object.keys(availableFolders);

const MimeTypes = {
    ".html": 'text/html',
    ".js": 'text/javascript',
    ".css": 'text/css',
    ".map": 'application/json',
    ".json": 'application/json',
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".jpeg": "image/jpg",
}


readFile("./db.json", (err, res) => {
    if(err) {
        data = [];
        return;
    }
    
    data = JSON.parse(res);
    data = data.map((item, i) => {
        const fileData = {id: i, docs: []}

        if(item.doc?.img){
            const images = Array.isArray(item.doc.img) ? item.doc.img : [item.doc.img];
            const imgData = []
            for(let d = 0; d < images.length; d++){
                const img = images[d];
                const imageName = `image_${d + 1}`;
                const ext = GetTypeFromBase64(img)
                const fileName = imageName + "." + ext;
                imgData.push({
                    ext: ext,
                    size: Number(GetSizeKBFromBase64(img).toFixed(3)),
                    name: imageName,
                    url: `/letters/static/${i}/${fileName}`
                })
                fileData.docs.push({name: fileName, doc: img})
            }
            item.hasDoc = true;
            item.doc.img = imgData;
        }
        else{
            item.hasDoc = false;
        }

        if(item.author.avatar){
            const avatarType = GetTypeFromBase64(item.author.avatar);
            const fileName = `author.${avatarType}`
            fileData.docs.push({name: fileName, doc: item.author.avatar})
            item.author.avatar = `/letters/static/${i}/${fileName}`
        }


        file_data.push(fileData);

        return {...item, id: i}
    }).sort((a, b) => {return new Date(b.date) - new Date(a.date)})

});



const allowCrossDomain = function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return true;
}


const HandleHTMLFile = function(request, response){
    if(request.headers.accept.includes("text/html")){
        readFile('index.html', function(err, res){
            response.writeHead(200, { 'Content-Type': "text/html" });
            response.end(res, 'utf-8');
        })
        return false;
    }
    return true;
}


const validateFilter = (item, query) => {
    if(query.hasOwnProperty("filter_attachment") && item.hasDoc === false) return false;
    if(query.hasOwnProperty("filter_bookmark") && !item.bookmark) return false;
    if(query.hasOwnProperty("filter_read") && item.read) return false;
    
    return true;
}

const messageSort = (a, b, attr, by) => {
    if(attr === "date"){
        a = new Date(a.date);
        b = new Date(b.date);
        return by === "asc" ? a - b : b - a;
    }
    else if(attr === "author"){
        a = a.author.name[0];
        b = b.author.name[0];
    }
    else if(attr === "subject"){
        a = a.title;
        b = b.title;
    }
    return by === "desc" ? (a > b ? 1 : -1) : (b > a ? 1 : -1);
}


function GetTypeFromBase64(doc){
    return doc.split("/")?.[1]?.split(";")?.[0] 
}

function GetSizeKBFromBase64(doc){
    return ((doc.split('base64,')?.[1] ?? "").length / 1024);
}



const app = new App();

app.get("assets/:filename", (request, response) => {
    const contentType = MimeTypes[extname(request.params.filename)];
    if(existsSync(__dirname, `/assets/${request.params.filename}`)){
        readFile("assets/" + request.params.filename, function(err, res){
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(res, 'utf-8');
        })
    }
    else return false;
})


app.get("count", (request, response) => {
    const count = data.filter(i => !i.folder && !i.read).length;
    response.writeHead(200, {
        'Content-Type': 'application/json',
    });
    response.end(JSON.stringify({count: count}));
})


app.get("static/:filename", (request, response) => {
    const filename = request.params?.filename;
    if(filename){
        const filePath = join(__dirname, `/static/${filename}`);
        if(existsSync(filePath)) {
            const stat = statSync(filePath);
            response.writeHead(200, {
                'Content-Type': MimeTypes[extname(filename)],
                'Content-Length': stat.size
            });
            const readStream = createReadStream(filePath);
            readStream.pipe(response);
        }
        else return false;
    }
})

app.get("letters/static/:id/:filename", (request, response) => {
    let id = request.params.id;
    let filename = request.params.filename;
    if(id){
        id = Number(id);
        const files = file_data.find(f => f.id === id);
        const file = files.docs.find(f => f.name === filename);
        if(file){
            const img = Buffer.from(file.doc.split(",")[1], 'base64');
            const mime = MimeTypes[extname(filename)];
            if(!mime) return false;

            response.writeHead(200, {
                'Content-Type': MimeTypes[extname(filename)],
                'Content-Length': img.length
            });
            response.end(img)
        }
        else return false;
    }
    else return false;
})


app.get("letters/:folder", (request, response) => {


    const ruFolder = availableFolders[request.params.folder];
    if(!availableFoldersKeys.includes(request.params.folder)) return false;


    const take = Number(request.query?.["take"]);
    const offset = Number(request.query?.["offset"]);


    let letterData = (data.filter((item) => item.folder === ruFolder && request.query && validateFilter(item, request.query)));

    const sortString = request.query?.["sort"];
    if(sortString){
        const sortParams = sortString.split("_");
        if(sortParams.length === 2 && (sortParams[1] === "asc" || sortParams[1] === "desc")){
            letterData = letterData.sort((a, b) => messageSort(a, b, sortParams[0], sortParams[1]));
        }
    }

    letterData = letterData.slice(offset, take + offset);
    if(letterData) letterData = JSON.parse(JSON.stringify(letterData));

    letterData.map(item => {
        item.text = item.text.slice(0, 200);
        delete item.to;
        return item;
    })

    response.writeHead(200, {'Content-Type': 'application/json',});
    response.end(JSON.stringify(letterData))
})


app.get("letters/:folder/:id", (request, response) => {
    const ruFolder = availableFolders[request.params.folder];
    if(!availableFoldersKeys.includes(request.params.folder)) return false;

    let id = request.params.id;
    if(id){
        id = Number(id);
        const letterData = data.find(letter => letter.id === id && letter.folder === ruFolder);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(letterData))
    }
})


app.post("letters/move",  (request, response) => {
    let body = request.body;
    if(body){
        body = JSON.parse(body)
        const folder = body.folder;
        const ids = body.ids;
        const selected = data.filter(item => ids.includes(item.id))
        const ruFolder = availableFolders[folder];
        for(let i = 0; i < selected.length; i++) {
            selected[i].folder = ruFolder
        }
        response.end(JSON.stringify({status: 200}));
    }
    else return false;
})

app.post("letters/update",  (request, response) => {
    let body = request.body;
    if(body){
        body = JSON.parse(body)
        const attr = body.attr;
        const next  = body.next;
        const ids = body.ids;
        if(attr, ids){
            const selected = data.filter(item => ids.includes(item.id))
            for(let i = 0; i < selected.length; i++) {
                selected[i][attr] = next;
            }
            response.end(JSON.stringify({status: 200}));
        }
        else return false;
    }
    else return false;
})

app.use(allowCrossDomain);
app.use(HandleHTMLFile);
app.listen(3000, (port) => {console.log(`Server is running on ${port} port!`)})