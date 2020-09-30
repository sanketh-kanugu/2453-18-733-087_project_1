var express=require('express');
var app=express();

//bodyparser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//for mongodb
const MongoClient=require('mongodb').MongoClient;

//connecting server file for awt
let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');
        
//database connection
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalmanagement';
let db
MongoClient.connect(url,{useUnifiedToplogy:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database:${url}`);
    console.log(`Database:${dbName}`);
});

//Fetching hospital details
app.get("/rdhospdetails",(req,res)=>{
    console.log("Fetching data from hospital collection");
    var data = db.collection('hospitals').find().toArray().then(result => res.send(result));
});

//Fetching ventilators details
app.get("/rdventdetails",(req,res)=>{
    console.log("Fetching data from ventilator collection");
    var data = db.collection('ventilators').find().toArray().then(result => res.send(result));
});
//search ventilators by status
app.post('/srchventbysts',middleware.checkToken,(req,res)=>{
    var status = req.query.Status;
    console.log("searching ventilators which are ",status);
    var data = db.collection('ventilators').find({"Status":status}).toArray()
        .then(result=>{
        if(result.length==0)
        {   
            console.log("->ventilators of given status NOT FOUND");
            res.send("No ventilators with given status");
        }
        else
        {
            console.log("-> Ventilators of given status FOUND")
            res.json(result);
        }
    });
});
//search ventilators by hospital name
app.post('/srchventbyhospname',middleware.checkToken,(req,res)=>{
    var name = req.query.Name;
    console.log("searching ventilators details of ",name);
    var data = db.collection('ventilators').find({"Name":new RegExp(name,'i')}).toArray()
        .then(result=>{
        if(result.length==0)
        {
            console.log("-> INVALID hospital name");
            res.send("ventilators of given hospital name  NOT FOUND");
        }
        else
        {   
            console.log("-> ventilators of given hospital name FOUND")
            res.json(result);
        }
    });
});

//search hospital by name
app.post('/srchhospbyname',middleware.checkToken,(req,res)=>{
    const name=req.query.Name;
    console.log("searching hospital with name:",name);
    const data=db.collection("hospitals").find({'Name':new RegExp(name,'i')}).toArray()
        .then(result=>{
        if(result.length==0)
        {
            console.log("-> INVALID hospital name");
            res.send("Hospitals of given name is NOT FOUND");
        }
        else
        {   
            console.log("-> Hospitals of given name is FOUND")
            res.json(result);
        }
    });
});

//update ventilators
app.put('/updtvent',middleware.checkToken,(req,res)=>{
    var vid = {"Ventilator_id":req.query.Ventilator_id};
    var data = db.collection('ventilators').find(vid).toArray()
        .then(result=>{
        if(result.length!=0)
        {
            console.log("-> UPADTING status of:",vid);
            var doc ={$set:{"Status": req.body.Status}};
            db.collection("ventilators").updateOne(vid,doc,function(err,result){
                res.send("1 document updated");
                if(err)throw err;
            });
        }
            
        else
        {
            console.log("-> Ventilator of given id is NOT FOUND");
            res.send("INVALID ventilator id");
        }
        
    });
    
});

//adding ventailators
app.post('/addvent',middleware.checkToken,(req,res)=>{
    const hid = req.body.Hospital_id;
    const vid = req.body.Ventilator_id;
    const sta = req.body.Status;
    const name = req.body.Name;

    console.log("-> Adding NEW ventilator details");

    var doc ={"Hospital_id":hid,"Ventilator_id":vid,"Status":sta,"Name":name };

    db.collection("ventilators").insertOne(doc,function(err,result){
        res.send('NEW ventilator details inserted');
    });
});


//delete ventilators by vent_id
app.delete('/delventbyid',middleware.checkToken,(req,res)=>{
    var vid=req.query.Ventilator_id;
    var data = db.collection('ventilators').find({"Ventilator_id":vid}).toArray()
        .then(result=>{
        if(result.length==0)
        {
            console.log("-> Ventilator of given id is NOT FOUND");
            res.send("Ventilators of given id NOT FOUND");
        }
        else
        {
            console.log("-> Deleted ventilator with id: ",vid);
            var doc={"Ventilator_id":vid};
            db.collection('ventilators').deleteOne(doc,function(err,obj){
                if(err)throw err;
                res.send("Deleted ventilator with given id");
            });
        }
        
    });
    
});
app.listen(3000);






