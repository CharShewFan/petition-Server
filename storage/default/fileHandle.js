const fs = require('fs')
//const storage = require('../../../storage/images')
const readChunk = require('read-chunk');
const imageType = require('image-type');
const FileType = require('file-type');
 


exports.imgType = function(){
    const buffer = readChunk.sync("_storage_", 0, 12);
    console.log(imageType(buffer)) ;

}

exports.readImg = function(fileName) { // read image to binary and return back to controller 
    const bindata = fs.readFileSync(`../../../storage/images/${fileName}`,'utf-8')
    return bindata
    //console.log(readfile)
    
}

exports.writeImg = function(req,res){
    fs.writeFileSync(`${req.header("image_filename")}`)
}

