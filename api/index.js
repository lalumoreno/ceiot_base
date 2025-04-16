const express = require("express");
const bodyParser = require("body-parser");
const {MongoClient} = require("mongodb");
const PgMem = require("pg-mem");

const db = PgMem.newDb();

    const render = require("./render.js");
// Measurements database setup and access

let database = null;
const collectionName = "measurements";

async function startDatabase() {
    const uri = "mongodb://localhost:27017/?maxPoolSize=20&w=majority";	
    const connection = await MongoClient.connect(uri, {useNewUrlParser: true});
    database = connection.db();
}

async function getDatabase() {
    if (!database) await startDatabase();
    return database;
}

async function insertMeasurement(message) {
    const timestamp = new Date().toISOString();    
    message.received_at = timestamp;
    const {insertedId} = await database.collection(collectionName).insertOne(message);
    return insertedId;
}

async function getMeasurements() {
    return await database.collection(collectionName).find({}).toArray();	
}

function validateDeviceInput(id, n, k) {
        
    // Validate empty message    
    if (!id || !n || !k || id.trim() === '' || n.trim() === '' || k.trim() === '') {
        return "Invalid input: id, name, and key are required and cannot be empty";
    }

    // Validate id is a number between 1 and 20
    const idNumber = Number(id);
    if (isNaN(idNumber) || idNumber < 1 || idNumber > 20) {
        return "Invalid input: id must be a number between 1 and 20";
    }

    // Validate name is max 20 chars
    if (n.trim().length === 0 || n.length > 20) {
        return "Invalid input: name must be a string with max 20 characters";
    }

    // Validate key is a number of 6 digits    
    const keyNumber = Number(k);
    if (isNaN(keyNumber) || keyNumber < 100000 || keyNumber > 999999) {
        return "Invalid input: key must be a number between 100000 and 999999";
    }

    // Validate id was not already included
    var device = db.public.many("SELECT * FROM devices WHERE device_id = '"+id+"'");    
    if(device.length) {
        return "Invalid input: id already exists";
    }    

    return null;
}

function validateMeasurementInput(id, t, h) {
        
    // Validate empty message    
    if (!id || !t || !h || id.trim() === '' || t.trim() === '' || h.trim() === '') {
        return "Invalid input: id, temperature, and humidity are required and cannot be empty";        
    }

    // Validate measurement is from a registered device
    var device = db.public.many("SELECT * FROM devices WHERE device_id = '"+id+"'");    
    if(device.length == 0) {
        return "Invalid input: id not registered";
    }

    // Validate temperature is a number number between -100 and 100
    const tempNumber = Number(t);
    if (isNaN(tempNumber) || tempNumber < -100 || tempNumber > 100) {
        return "Invalid input: temperature must be a number between -100 and 100";
    }

    // Validate humidity is a number between 0 and 100%
    const humNumber = Number(h);
    if (isNaN(humNumber) || humNumber <= 0 || humNumber > 100) {
        return "Invalid input: humidity must be a number between 0 and 100%";
    }

    return null;
}

// API Server

const app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('spa/static'));

const PORT = 8080;

app.post('/measurement', function (req, res) {
    //console.log("device id    : " + req.body.id + " temperature : " + req.body.t + " humidity    : " + req.body.h);

    // Validate measurement before insert
    const { id, t, h} = req.body;
    const err = validateMeasurementInput(id,t,h);
    const measurementInfo = " {device id: " + req.body.id + " temperature: " + req.body.t + " humidity: " + req.body.h + "}";
    if(err) {
        console.log(err + measurementInfo);
        return res.status(400).send(err);
    }         
     
    const {insertedId} = insertMeasurement({id:req.body.id, t:req.body.t, h:req.body.h});
    console.log("Received NEW measurement" +  measurementInfo);
	res.send("Received NEW measurement");    
});

app.post('/device', function (req, res) {	
    
    //console.log("device id    : " + req.body.id + " name        : " + req.body.n + " key         : " + req.body.k );
    
    // Validate device before insert
    const { id, n, k } = req.body;
    const err = validateDeviceInput(id,n,k);
    const deviceInfo = " {device id: " + req.body.id + " name: " + req.body.n + " key: " + req.body.k + "}";

    if(err) {
        console.log(err + deviceInfo);
        return res.status(400).send(err);
    }    

    db.public.none("INSERT INTO devices VALUES ('"+req.body.id+ "', '"+req.body.n+ "', '"+req.body.k+ "')");
    console.log("Received NEW device" + deviceInfo);
	res.send("Received NEW device");    
});


app.get('/web/device', function (req, res) {
	var devices = db.public.many("SELECT * FROM devices").map( function(device) {
		console.log(device);
		return '<tr><td><a href=/web/device/'+ device.device_id +'>' + device.device_id + "</a>" +
			       "</td><td>"+ device.name+"</td><td>"+ device.key+"</td></tr>";
	   }
	);
	res.send("<html>"+
		     "<head><title>Sensores</title></head>" +
		     "<body>" +
		        "<table border=\"1\">" +
		           "<tr><th>id</th><th>name</th><th>key</th></tr>" +
		           devices +
		        "</table>" +
		     "</body>" +
		"</html>");
});

app.get('/web/device/:id', function (req,res) {
    var template = "<html>"+
                     "<head><title>Sensor {{name}}</title></head>" +
                     "<body>" +
		        "<h1>{{ name }}</h1>"+
		        "id  : {{ id }}<br/>" +
		        "Key : {{ key }}" +
                     "</body>" +
                "</html>";


    var device = db.public.many("SELECT * FROM devices WHERE device_id = '"+req.params.id+"'");
    console.log(device);
    res.send(render(template,{id:device[0].device_id, key: device[0].key, name:device[0].name}));
});	


app.get('/term/device/:id', function (req, res) {
    var red = "\33[31m";
    var green = "\33[32m";
    var blue = "\33[33m";
    var reset = "\33[0m";
    var template = "Device name " + red   + "   {{name}}" + reset + "\n" +
		   "       id   " + green + "       {{ id }} " + reset +"\n" +
	           "       key  " + blue  + "  {{ key }}" + reset +"\n";
    var device = db.public.many("SELECT * FROM devices WHERE device_id = '"+req.params.id+"'");
    console.log(device);
    res.send(render(template,{id:device[0].device_id, key: device[0].key, name:device[0].name}));
});

app.get('/measurement', async (req,res) => {
    res.send(await getMeasurements());
});

app.get('/device', function(req,res) {
    res.send( db.public.many("SELECT * FROM devices") );
});

startDatabase().then(async() => {

    const addAdminEndpoint = require("./admin.js");
    addAdminEndpoint(app, render);

    console.log("mongo measurement database Up");

    db.public.none("CREATE TABLE devices (device_id VARCHAR, name VARCHAR, key VARCHAR, received_at TIMESTAMPTZ DEFAULT NOW())");    
    db.public.none("CREATE TABLE users (user_id VARCHAR, name VARCHAR, key VARCHAR)");
    db.public.none("INSERT INTO users VALUES ('1','Ana','admin123')");
    db.public.none("INSERT INTO users VALUES ('2','Beto','user123')");

    console.log("sql device database up");

    app.listen(PORT, () => {
        console.log(`Listening at ${PORT}`);
    });
});
