const category = require('../controllers/catergory.server.controller')

module.exports = function (app) {
    app.route(app.rootUrl + 'events/categories')
        .get(category.listAll) // not auth needed, list all category
        .post(category.addCategory) // auth user add a category
        .delete(category.rmCategory) //auth user remove a personal category

}