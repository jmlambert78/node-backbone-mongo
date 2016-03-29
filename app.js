var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , models = require('./models')
  , routes = require('./routes')
  , app = express()
  , env = process.env.NODE_ENV || 'development'
  , errorhandler = require('errorhandler')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , morgan = require('morgan');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('combined'));
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(methodOverride());

if (env == 'development') {
  app.use(errorhandler());
}
for (var item in process.env) 
  console.log(item," = ",process.env[item]);

routes.init(app);
 var port = process.env.VCAP_APP_PORT || 8080;

//MYMONGO_PORT_27017_TCP_ADDR 
var mdb_port = process.env.MONGO_PORT_27017_TCP_PORT    || 27017;
//var mdb_host = process.env.MONGO_PORT_27017_TCP_ADDR    ||"127.0.0.1";
var mdb_host = "re-risk-engine-staging.mongo"    ||"127.0.0.1";

var dbcreds ={"host":mdb_host,"db":"todos","port":mdb_port,"username":"admin","password":"tartempion"};
console.log("dbcreds",dbcreds);

if(process.env.VCAP_SERVICES){
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var dbcreds = services['mongodb'][0].credentials;
}

if(dbcreds){
  console.log(dbcreds);
  mongoose.connect(dbcreds.host, dbcreds.db, dbcreds.port, {user: dbcreds.username, pass: dbcreds.password});
}else{
  mongoose.connect(mdb_host, "todomvc", 27017);
}

http.createServer(app).listen(port);
console.log("Express server listening on port : " + port);
