
const handler = require('../../storage/fileHandle')
const image = require('../models/user.photo.model')
const User = require('../models/user.model')
const Exist = require("../middleware/token/isExist")

const imageType = require("../middleware/imageType");


/*==================put image======================*/

exports.storeImg = async function(req,res){
    
        const id = req.params.id
        const user = await User.listUsersById(id)
        const data = req.body
        const token = req.get("X-Authorization")
        const db = await User.tokenTaker(id)
        let mime = req.get('Content-Type')
        console.log(mime)
        const ext = imageType.readMime(mime)
        
        

        
    try{
        if(Exist.isExist(user) === false){
            res.status(404).send("user not found")
        }

        // req has no token => unAuthorized
        if(token === undefined || token === null){
            res.status(401).send("not authorized")
        }
        
        //compare token with db.token
        if(db[0].auth_token === undefined || db[0].auth_token === null){
            res.status(403).send("db[0].auth_token === undefined || db[0].auth_token === null")
        }else{
            if(db[0].auth_token !== token){
                res.send(403).send("db[0].auth_token !== token")
            }
        }


        if(mime !== "image/jpeg" && mime !== "image/png" && mime !== "image/gif"){
            res.status(400).send("image type must be image/jpeg or ")
        }
        

        if(ext === null || ext === undefined){
            res.status(400).send("image must be jpg/gif/png")
        }

        console.log("date.length")
        console.log(data.length)
        console.log(typeof(data))
        //if(data.length === undefined || data.length === 0){
        //    res.status(400).send("image cannot be empty")
        //}

        //check wether photo exist first
        console.log("11")
        const result = await image.getFileName(id)
        if(result === false){
            res.status(500).send("internal error 1")
        }

        console.log("22")

        let fileNameExist = false
        result.forEach(item=>{
            if(item.image_filename){
                fileNameExist = true
            }
        })

        console.log("33")
        if(fileNameExist === true){
            const fileName = await handler.writeToStorage(data,ext)
            let results = await image.uploadToServer(fileName,id)
            if(results === true){
                res.status(200).send("image upload ")
            }else{
                res.status(500).send('internal error 2')
            }
            
        }else{
            const fileName = await handler.writeToStorage(data,ext)
            let results = await image.uploadToServer(fileName,id)
            if(results === true){
                res.status(201).send("image upload ")
            }else{
                res.status(500).send('internal error 3')
            }
            
        }


    
    }catch(e){
        console.log(e)
        res.status(500).send("internal error 4")
    }
}



/*==================get image======================*/

exports.retriveImg = async function(req,res){
    const id = req.params.id
    try{
        const result = await image.getFileName(id)
        let isExist = false;

        result.forEach(item=>{
            if(item.image_filename){
                isExist = true
            }
        })

        if(isExist === true){
            let image_filename = result[0].image_filename
            console.log(image_filename)
            const data = handler.readFromStorage(image_filename)
            let type = handler.geType(image_filename)
            console.log(type)
            res.writeHead(200, {
                'Content-Type': `${type}`
            }).end(data) 
        }else{
            res.status(404).send("image not found")
        }
}catch(e){
    console.log(e)
    res.status(500).send("Interal Server Error 5")
    }
}


/*==================delete image======================*/

exports.deleteImg = function(req,res){
    let token =req.get("X-Authorization")
    if(token === undefined || token === null){
        res.status(401).send("unAuthorized")
    }

    try{
        //要先判断 auth 的模块
        
        if(auth === true){
            const execution = User.imgDelete(req,res)
            res.status(200).send('user profile image delete')
        }else{
            res.status(401).send("user not authorized")
        }
    }catch(e){
        res.status(500).send("Interal Server Error")
    }
}

