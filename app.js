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

routes.init(app);

var port = process.env.VCAP_APP_PORT || 3000;
var dbipaddr = process.env.MYMONGO_PORT_27017_TCP_ADDR|"127.0.0.1";
var dbcreds ={"host":dbipaddr,"db":"","port":"27017","username":"test","password":"test"};
if(process.env.VCAP_SERVICES){
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var dbcreds;
  if ( services['azure-cosmosdb-mongo-account']==null){
     dbcreds = services['mongodb'][0].credentials
  }else{
     dbcreds = services['azure-cosmosdb-mongo-account'][0].credentials
  }
	
  dbcreds.db=dbcreds.username; // for azure cosmosdb
}

if(dbcreds){
  var mongoDB = 'mongodb://'+dbcreds.username+':'+ encodeURIComponent(dbcreds.password)+"@"+dbcreds.host+':'+dbcreds.port+'/?ssl=false';
	console.log("mongodb url : ",mongoDB);
  mongoose.connect(mongoDB/*,{useNewUrlParser: true}*/);
}else{
  mongoose.connect(dbipaddr, "todomvc", 27017);

}

http.createServer(app).listen(port);
console.log("Express server listening on port" + port);
