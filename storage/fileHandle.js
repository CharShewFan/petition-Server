const readChunk = require('read-chunk');
const imageType = require('image-type');
//const FileType = require('file-type');
const path = require('path')
var filePath = path.join(__dirname, '/images/')
const fs = require('mz/fs')
const randomString = require("randomstring")


exports.imgType = function(fileName){

    //console.log(__dirname)
    //console.log(process.cwd())
    //console.log(filePath)
    //fs.writeFileSync(filePath + `${fileName}`,buffer)
    //console.log(imageType(buffer)) ;
    const buffer = readChunk.sync(filePath + `${fileName}`,0,12)
    return imageType(buffer) //return {ext: 'png', mime: 'image/png'}
}

exports.readFromStorage = function(fileName) { // read image to binary and return back to controller 
    //directly sendFile to 
    const binaryData = fs.readFileSync(filePath + `${fileName}`)
    console.log(binaryData)
    return binaryData
}

exports.writeToStorage = async function(data,fileExt){
    let fileName = randomString.generate(7) + "."+ fileExt
    try{
         await fsmz.WriteStream(filepath+fileName,data)
         console.log("file stored")
         return fileName
        }
        catch(e){
        console.log(e)
        fs.unlink(filepath+fileName).catch(err=>{console.log(err)})
        }
}

