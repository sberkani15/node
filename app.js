var express =       require('express');
var bodyParser =    require ('body-parser');
var morgan =        require('morgan');
var mongoose    =   require('mongoose');

var jwt    =        require('jsonwebtoken'); // used to create, sign, and verify tokens
var config =        require('./config'); // get our config file
var User   =        require('./models/user'); // get our mongoose model

var app = express();

// get an instance of the router for api routes
var apiRoutes = express.Router();

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));


apiRoutes.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

apiRoutes.get('/setup', function(req, res) {

    // create a sample user
    var nick = new User({
        name: 'Nick Cerminara',
        password: 'password',
        admin: true
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    var objet = User.findOne({}, function (err, result) {
        if (err) throw err;
        console.log(result.name);
        objet = result;
    })
    res.send(objet)

    // find the user
    // User.findOne({
    //     name: req.body.name
    // }, function(err, user) {
    //
    //     if (err) throw err;
    //
    //     if (!user) {
    //         res.json({ success: false, message: 'Authentication failed. User not found.' });
    //     } else if (user) {
    //
    //         // check if password matches
    //         if (user.password != req.body.password) {
    //             res.json({ success: false, message: 'Authentication failed. Wrong password.' });
    //         } else {
    //
    //             // if user is found and password is right
    //             // create a token with only our given payload
    //             // we don't want to pass in the entire user since that has the password
    //             const payload = {
    //                 admin: user.admin
    //             };
    //             var token = jwt.sign(payload, app.get('superSecret'), {
    //                 expiresInMinutes: 1440 // expires in 24 hours
    //             });
    //
    //             // return the information including token as JSON
    //             res.json({
    //                 success: true,
    //                 message: 'Enjoy your token!',
    //                 token: token
    //             });
    //         }
    //
    //     }
    //
    // });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);

