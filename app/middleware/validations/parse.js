exports.datess = function (date_1){
    let dates = date_1.toString()
    console.log(dates)

    dates.slice(-1)
    console.log(dates)

    let list = dates.split("T")
    let newDates = list[0] + " " + list[1]
    console.log(newDates)
    return newDates


}