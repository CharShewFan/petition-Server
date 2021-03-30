const filePath = (__dirname + '/images/')
const fs = require('mz/fs')
const randomString = require("randomstring")



exports.getMimeType = function(fileName){

    console.log(fileName)
    let list = fileName.split(".")
    return "image/"+list[1]
    //return {ext: 'png', mime: 'image/png'}
}

// read image to binary and return back to controller directly sendFile to
exports.readFromStorage = async function(fileName) {
    try{
        if(await fs.exists(filePath + fileName)){
            const image = await fs.readFile(filePath + fileName)
            return image
        }else{
            return null
        }
    }catch(e){
        console.log(e.message)
        throw err
    }
}


exports.writeToStorage = async function(data,fileExt){
    let fileName = randomString.generate(7)+ fileExt
    console.log("the type of data is :  " + typeof(data))
    try{
        console.log("=========================================")
        console.log(fileName)
        console.log(filePath)
        await fs.WriteStream(filePath + fileName, data)
        return fileName
    }catch(e){
        console.log(e)
        fs.unlink(filePath+fileName).catch(err=>{console.log(err)})
    }
}


exports.readMime = function(mime){
    if(mime === "image/jpg" || mime === "image/jpeg"){
        return ".jpeg"
    }
    if(mime === "image/gif"){
        return ".gif"
    }
    if(mime === "image/png"){
        return ".gif"
    }

}


exports.deletePhoto = async function(filename){
    try {
        if (await fs.exists(filePath + filename)) {
            await fs.unlink(filePath + filename);
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}







