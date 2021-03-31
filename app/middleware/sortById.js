exports.sortById = function(result){
    let temp
    for(let i = 0;i < result.length - 1 ; i++){
        for(let j = 0; j < result.length - 1;j++){
            if(result[j].id > result[j+1].id){
                temp = result[j]
                result[j] = result[j+1]
                result[j+1] = temp
            }
        }
    }
    return result
}


/*
[
 { id: 17, name: 'Arts' },{ id: 16, name: 'Beliefs' },{ id: 18, name: 'Book Clubs' },{ id: 24, name: 'Career & Business' }
]
w
*/

let data = [{id:1,title:"animals",descptions:"for animail warefare",date:"2020-10-28 09:00:00"},
{id:8,title:"human",descptions:"for animail warefare",date:"2020-10-29 09:00:00"},
{id:6,title:"animals",descptions:"for animail warefare",date:"2020-10-30 09:00:00"},
{id:2,title:"animals",descptions:"for animail warefare",date:"2020-10-31 09:00:00"},
{id:10,title:"animals",descptions:"for animail warefare",date:"2020-10-32 09:00:00"},
{id:4,title:"animals",descptions:"for animail warefare",date:"2020-10-44 09:00:00"}
]