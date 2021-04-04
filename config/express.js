const express = require('express');
const bodyParser = require('body-parser');
const { allowCrossOriginRequestsMiddleware } = require('../app/middleware/cors.middleware');
//const homePage = require("../index.html")




module.exports = function () {
    // INITIALISE EXPRESS //
    const app = express();
    app.rootUrl = '/api/v1';


    // MIDDLEWARE
    //app.use(fileUpload()); // express module process fileUpload
    app.use(allowCrossOriginRequestsMiddleware);
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.raw({ type: 'text/plain',limit: '50mb' }));  // for the /executeSql endpoint
    app.use(bodyParser.raw({type:'image/jpg',limit: '50mb' }))
    app.use(bodyParser.raw({type:'image/gif',limit: '50mb' }))
    app.use(bodyParser.raw({type:'image/png',limit: '50mb' }))
    app.use(bodyParser.raw({type:'image/jpeg',limit: '50mb' }))


    // DEBUG (you can remove these)
    app.use((req, res, next) => {
        console.log(`##### ${req.method} ${req.path} #####`);
        next();
    });

    app.get('/', function (req, res) {
        res.status(200).sendFile("index.html",{root:__dirname})
    });

    app.get(app.rootUrl,(req,res)=>{
        res.status(200).send("hello rootUrl")
    })

    // ROUTES
   require('../app/routes/backdoor.routes')(app);
   require('../app/routes/user.server.routes')(app);
   require('../app/routes/category.server.routes')(app);
   require('../app/routes/event.server.routes')(app);
   require('../app/routes/attendance.server.routes')(app);
    
   return app;
};
