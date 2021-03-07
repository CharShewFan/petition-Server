const express = require('express');
const bodyParser = require('body-parser');
const { allowCrossOriginRequestsMiddleware } = require('../app/middleware/cors.middleware');
const passport = require('passport')
const bcrypt = require('bcryptjs')



module.exports = function () {
    // INITIALISE EXPRESS //
    const app = express();
    app.rootUrl = '/api/v1';

    // MIDDLEWARE
    app.use(allowCrossOriginRequestsMiddleware);
    app.use(bodyParser.json());
    app.use(bodyParser.raw({ type: 'text/plain' }));  // for the /executeSql endpoint
    //what is express session for ?
    //app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
     app.use(passport.initialize());
     app.use(passport.session());

    /*// DEBUG (you can remove these)
    app.use((req, res, next) => {
        console.log(`##### ${req.method} ${req.path} #####`);
        next();
    });

    app.get('/', function (req, res) {
        res.send({ 'message': 'Hello World!' })
    });*/

    // ROUTES
   require('../app/routes/backdoor.routes')(app);
   require('../app/routes/user.server.routes')(app);
   require('../app/routes/category.server.routes')(app);
   require('../app/routes/event.server.routes')(app);


  
    require('../app/routes/event.server.routes')(app);
  /*
    require('../app/routes/attendance.server.routes')(app);

      */
    return app;
};
