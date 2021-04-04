let query = req.query
let valid = false

try{

if(query.q !== undefined || query.categoryIds !== undefined || query.organizerId !== undefined || query.sortBy !== undefined || query.count !== undefined || query.startIndex !== undefined) {
    valid = Query.check(query)
    console.log("validation:" + valid)
    if(valid === false){
        res.status(400).send("bad request")
    }


    if(query.categoryIds !== undefined){ 
        if(typeof(query.categoryIds) === "string"){
            const maxId = await Cate.maxID()
            if(parseInt(query.categoryIds) > maxId){
                res.status(400).send(`cateId out of range ${query.categoryIds} > maxId: ${maxId}`)
            }
        }else{
            const cateValid = await ValidCate.validCateId(req.query.categoryIds)
            if(cateValid !== true){
                        res.status(400).send(" cateValid bad request")
            }
        
        } 


        

        if(query.startIndex >= 11)
        {
            const results = await Events.case_11()
            console.log("results.length")
            console.log(results.length)
            res.status(200).json(results)
        }else{
            
            // event.search is condition (query) search
            const result = await Events.search(query)
            const arrayed = tools.parseToArray(result)
            res.status(200).send(arrayed)
        }
    

}else{
    // 这是没有 query 参数的返回情况
    const result = await Events.dbListEvents()
    const arrayed = tools.parseToArray(result)
    res.status(200).send(arrayed)
}
}
}

catch(e){
    console.log(e)
    res.status(500).send()
}