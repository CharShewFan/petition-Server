const fs = require('fs')

exports.readImg = function() { // read image to binary and return back to controller 
    const readfile = fs.readFileSync('bug.txt','utf-8')
    console.log(readfile)
}