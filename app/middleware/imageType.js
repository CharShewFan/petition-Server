const readChunk = require('read-chunk');
const imageType = require('image-type');

exports.imgType = function(data){
    const buffer = readChunk.sync(data,0,12)
    return imageType(buffer) //return {ext: 'png', mime: 'image/png'}
}

