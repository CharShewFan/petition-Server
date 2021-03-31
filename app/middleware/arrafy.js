exports.parseToArray = function (data) {
   
    data.forEach(event=>{
        let cateStr = event.categories //=> "3,6,18,24"
        let strList = cateStr.split(",")
        for(let i = 0 ;i < strList.length;i++){
            strList[i] = parseInt(strList[i])
        }
        event.categories = strList
    })
    return data
    
} //data should be an irat


 let testdata = [
    {
        "eventId": 1,
        "title": "Tamariki book Festival",
        "categories": "3,6,18,24",
        "firstName": "Fernando",
        "lastName": "Brown",
        "number": 4,
        "capacity": 99
    },
    {
        "eventId": 2,
        "title": "Pigeon Bay Walkway",
        "categories": "1,3,4,5",
        "firstName": "Kristy",
        "lastName": "Lincoln",
        "number": 2,
        "capacity": null
    },
    {
        "eventId": 3,
        "title": "Beginner JavaScript",
        "categories": "24,6,2",
        "firstName": "Amanda",
        "lastName": "Faria",
        "number": 1,
        "capacity": 25
    },
    {
        "eventId": 4,
        "title": "Ethics for Dummies",
        "categories": "6,16",
        "firstName": "Chidi",
        "lastName": "Anagonye",
        "number": 3,
        "capacity": 6
    },
    {
        "eventId": 5,
        "title": "Games night!",
        "categories": "15,21",
        "firstName": "Henry",
        "lastName": "Krippner",
        "number": 11,
        "capacity": 20
    },
    {
        "eventId": 6,
        "title": "VIP party",
        "categories": "23,19,8",
        "firstName": "Tahani",
        "lastName": "Al-Jamil",
        "number": 3,
        "capacity": 100
    },
    {
        "eventId": 7,
        "title": "Beach Yoga",
        "categories": "1,4,5",
        "firstName": "Henry",
        "lastName": "Krippner",
        "number": 3,
        "capacity": 15
    },
    {
        "eventId": 8,
        "title": "Haiku Poem Competition",
        "categories": "9,12,17",
        "firstName": "Kristy",
        "lastName": "Lincoln",
        "number": 1,
        "capacity": 30
    },
    {
        "eventId": 9,
        "title": "Concert in the Botanical Gardens",
        "categories": "23,13,11,3",
        "firstName": "Simone",
        "lastName": "Garnett",
        "number": 12,
        "capacity": 300
    },
    {
        "eventId": 10,
        "title": "East Ward Community Meeting",
        "categories": "12",
        "firstName": "Steven",
        "lastName": "Peleaz",
        "number": 6,
        "capacity": 50
    },
    {
        "eventId": 11,
        "title": "Dog Walking",
        "categories": "4,5,20,23",
        "firstName": "Ella",
        "lastName": "Yellow",
        "number": 1,
        "capacity": 10
    }
]

//console.log(parseToArray(testdata))