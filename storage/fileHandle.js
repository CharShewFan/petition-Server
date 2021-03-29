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

exports.readFromStorage = function(fileName) { // read image to binary and return back to controller 
    //directly sendFile to 
    const binaryData = fs.readFileSync(filePath + `${fileName}`)
    console.log(binaryData)
    return binaryData
}



exports.writeToStorage = async function(data,fileExt){
    let fileName = randomString.generate(7)+ fileExt
    try{
        console.log("=========================================")
        console.log(fileName)
        console.log(filePath)
         await fs.WriteStream( filePath+fileName,data)
         console.log("file stored")
         return fileName
    }catch(e){
        console.log(e)
        fs.unlink(filePath+fileName).catch(err=>{console.log(err)})
    }
}

