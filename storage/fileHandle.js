//const readChunk = require('read-chunk');
//const imageType = require('image-type');
//const FileType = require('file-type');
//const path = require('path')
const filePath = (__dirname + '/images/')
const fs = require('mz/fs')
const randomString = require("randomstring")



exports.geType = function(fileName){

    console.log(fileName)
    let list = fileName.split(".")
    return "image/"+list[1]
    //return {ext: 'png', mime: 'image/png'}
}

// read image to binary and return back to controller directly sendFile to
exports.readFromStorage = async function(fileName) {

    const binaryData = await fs.readFile(filePath + `${fileName}`)
    console.log(binaryData)
    return binaryData
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









        // wrstream.write(data,(err)=>{
        //     if(err){
        //         console.log("abhjdfjhfdjhdfjhdfjhfdjhdfjhfdjhfdjh")
        //         console.log(err)
                
        //     }else{
        //         console.log("data write success")
        //     }
        // })