//const db = require('../../config/db');
//const fs = require("mz/fs");
const handler = require('../../storage/fileHandle')
const Image = require('../models/user.photo.model')
const User = require('../models/user.model')
const Exist = require("../middleware/token/isExist")
const TokenAuth = require("../middleware/token/verifyToken")
const ImageType = require("../middleware/imageType");


/*get user img with/without token*/

exports.storeImg = async function(req,res){
    try{
        const userId = req.params.id
        const user = await User.listUsersById(userId)
        const date = req.body
        //const fileName = await Image.uploadToServer(req,res)
        const authStatus = TokenAuth.auth(req,res)
        const fileExt = ImageType.imgType(data).ext
        const mime = req.get("Content-Type")

        //check authorization
         
        if(Exist.isExist(user) !== true){
            res.status(404).send("user not found")
        }
        
        if(authStatus !== true){
            res.status(403).send("user not authorized")
        }

        if(imageType.ext === null || imageType.ext === undefined){
            res.status(400).send("image must be jpg/gif/png")
        }

        if(data.length === undefined){
            res.status(400).send("image cannot be empty")
        }

        try{
            const rows = await Image.retriveFromServer(req,res)
            const fileNameExist = rows[0].image_filename
            if(fileNameExist){
                await Image.deleteFromServer(req,res)
            }

            let image_filename = await handler.writeToStorage(data,fileExt)
            await Image.uploadToServer(image_filename,userId)

            if(fileNameExist){
                res.status(200).send("image updated")
            }else{
                res.status(201).send("image updated")
            }
        }catch(e){
        console.log(e)
        }
    
    }catch(e){
        console.log(e)
    }
}


exports.retriveImg = async function(req,res){
    try{
        const result = await User.imgGet(req,res)
        let isExist = false;

        result.forEach(item=>{
            if(item.image_filename){
                isExist = true
            }
        })

        if(isExist == true){
            let image_filename = result[0].image_filename
            console.log(image_filename)
            const data = handler.readImg(image_filename)
            let imageType = handler.imgType(image_filename)
            console.log(imageType.mime)
            res.writeHead(200, {
                'Content-Type': `${imageType.mime}`
            }).end(data) 
        }else{
            res.status(404).send("image not found")
        }
}catch(e){
    console.log(e)
    res.status(500).send("Interal Server Error")
    }
}


exports.deleteImg = function(req,res){
    try{
        //要先判断 auth 的模块
        const auth = verifyUpgrade.auth
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

