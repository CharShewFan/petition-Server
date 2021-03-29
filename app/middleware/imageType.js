const readChunk = require('read-chunk');
const imageType = require('image-type');




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