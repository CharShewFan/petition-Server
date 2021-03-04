const category = require('../controllers/catergory.server.controller.js')

module.exports = function (app) {
    app.route(app.rootUrl + '/category')
        .get(category.list_Category) // not auth needed, list all category
        .post(category.addCategory) // auth user add a category
        .delete(category.rmCategory) //auth user remove a personal category

    app.route(app.rootUrl + '/category/:id')
        .get(category.findCategory)
}