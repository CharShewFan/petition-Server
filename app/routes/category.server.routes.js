const category = require('../controllers/catergory.server.controller')

app.router('/category')
    .get(category.listCategory) // not auth needed, list all category
    .post(category.addCategory) // auth user add a category
    .delete(category.rmCategory) //auth user remove a personal category
