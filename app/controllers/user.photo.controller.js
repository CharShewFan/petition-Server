
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
        console.log("request body is:")
        console.log(data)
        const token = req.get("X-Authorization")
        const db = await User.tokenTaker(id)
        let mime = req.header('Content-Type')
        console.log(mime)
        const ext = imageType.readMime(mime)
        console.log(ext)
        
        

        
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
        

        if( ext === undefined){
            res.status(400).send("image must be jpg/gif/png")
        }

        console.log("11")
        const result = await image.getFileName(id) // return file name or null(not pre exist)

        console.log("22")

        console.log("33")
        if(result === null ){
            const fileName = await handler.writeToStorage(data,ext)
            let results = await image.uploadToServer(fileName,id)
            if(results === true){
                res.status(201).send("image upload ")
            }else{
                res.status(500).send('internal error 2')
            }
            
        }else{
            const fileName = await handler.writeToStorage(data,ext)
            let results = await image.uploadToServer(fileName,id)
            if(results === true){
                res.status(200).send("image upload " + fileName)
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

exports.retrieveImg = async function(req,res){
    const id = req.params.id
    try{
        const image_filename = await image.getFileName(id)
       
        console.log(image_filename)

        if(image_filename === null){
            res.status(404).send("not found")
        }else{

            console.log("let data = await handler.readFromStorage(image_filename)")
            let data = await handler.readFromStorage(image_filename)
            console.log(data)
            console.log("let data = await handler.readFromStorage(image_filename)")

            let mime = handler.getMimeType(image_filename) //此处返回 mime 类型到 header 
            console.log("==============================================")
            console.log(mime)

            if(data === null){
                res.status(404).send()
            }else{
                res.status(200).contentType(mime).send(data)
            }
        }

    }catch(e){
        console.log(e)
        res.status(500).send("Internal Server Error 5")
    }
}


/*==================delete image======================*/

exports.deleteImg = async function(req,res){
    let id = req.params.id
    let token =req.get("X-Authorization")
try{
        // header token check
    if(token === undefined || token === null){
        res.status(401).send("unAuthorized")
    }

    //check user exist
    const users = await User.listUsersById(id)
    let userExist = false
    users.forEach(item=>{
        if(item.id){
            userExist = true
        }
    })
    if(userExist === false){
        res.status(404).send("user not found")
    }


    const userInfo = await User.tokenTaker(id)
    let dbToken = userInfo[0].auth_token

    if(dbToken === undefined || dbToken === null){
        res.status(403).send("forbidden")
    }
    if(token !== dbToken){
        res.status(403).send("not correct user")
    }

    const fileName = await image.getFileName(id)
    if(fileName === null){
        res.status(404).send("not found")
    }else {
        await   Promise.all([
                handler.deletePhoto(fileName),
                image.deleteFromServer(id)
        ])
        res.status(200).end()
    }
}catch(e){
    console.log(e)
    res.status(500).send("Internal Server Error")
    }
}

