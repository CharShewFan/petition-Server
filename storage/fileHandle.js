const fs = require('fs')
const readChunk = require('read-chunk');
const imageType = require('image-type');
const FileType = require('file-type');
const path = require('path')
var filePath = path.join(__dirname, '/default/')



exports.imgType = function(fileName){

    //console.log(__dirname)
    //console.log(process.cwd())
    //console.log(filePath)
    //fs.writeFileSync(filePath + `${fileName}`,buffer)
    //console.log(imageType(buffer)) ;
    const buffer = readChunk.sync(filePath + `${fileName}`,0,12)
    return imageType(buffer) //return {ext: 'png', mime: 'image/png'}
}

exports.readImg = function(fileName) { // read image to binary and return back to controller 
    //directly sendFile to 
    const binaryData = fs.readFileSync(filePath + `${fileName}`)
    console.log(binaryData)
    return binaryData
}

exports.writeImg = function(req,res){
    fs.writeFileSync(`${req.header("image_filename")}`)
}

/*
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '/pictures');
fs.openSync(filePath, 'hello.jpeg');
*/ 