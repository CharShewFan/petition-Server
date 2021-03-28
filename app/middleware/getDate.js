exports.now = function(){
    let date = new Date();

    let month = date.getMonth()+1
    let strDate = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let sep = "-"

    if(month >= 1 && month <= 9){
        month = "0" + month
    }

    if(strDate >= 1 && strDate <= 9){
        strDate = "0" + strDate
    }

    let time = date.getFullYear()+sep+month+sep+strDate+" "+hour+":"+minute+":"+second
    console.log(time)
    return time
}