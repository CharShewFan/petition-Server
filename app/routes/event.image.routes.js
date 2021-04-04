module.exports = function (app){
    app.route(app.rootUrl + 'events/:id/image')
        .get(events.getImage)
        .post(events.postImage)
        .put(events.postImage)
}