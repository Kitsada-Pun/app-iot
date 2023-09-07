const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex");
const app = express();
const multer = require("multer");
const { raw } = require("mysql");

const db = knex({
  client: "mysql",
  connection: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASS || "",
    database: process.env.MYSQL_DB || "iote1-5",
    supportBigNumber: true,
    timezone: "+7:00",
    dateStrings: true,
    charset: "utf8mb4_unicode_ci",
  },
});
app.use(cors());
app.use(bodyParser.json());
///////////////////////////////////
app.use(express.static(__dirname + '/public'))
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/photos');
  },
  filename: function (req, file, callback) {
  //  callback(null, file.fieldname + '-' + Date.now());
    callback(null,Date.now() + '-' + file.originalname );
  }
});
 var upload = multer({ storage: storage })
// var upload = multer({ storage : storage }).array('userPhoto',2);
app.post('/stats', upload.single('file'), function (req, res) {
   // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body will hold the text fields, if there were any 
   console.log('req.file=',req.file)
   console.log('req.file=',req.file.filename)
   console.log('req.body' , req.body)
});
app.post('/upload',function(req,res){
    upload(req,res,function(err) {
       console.log('fileupload')
        console.log(req.body);
        console.log(req.file);
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});
app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
   console.log('คุณสมบัติของfile:',req.file)

  //  let ext = req.file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
console.log('req.file.originalname=', req.file.originalname) 
console.log('req.file.originalname.lastIndexOf(.)',req.file.originalname.lastIndexOf('.'))
console.log('file.originalname.length=',req.file.originalname.length)

    if (!req.file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(req.file)
  
})

// uploading multiple images together
app.post('/multi', upload.any(), (req, res) => {
  console.log('multi')
  const files = req.files
  console.log('file:',files)
  console.log('name:',req.body.fname)
  console.log('lname:',req.body.lname)
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
 
    res.send({'files=>': files,
              'status': 'ok'
                })
  
})



////////////////////////////////////
// http://localhost:7001
app.get("/", (req, res) => {
  console.log("test api");
  res.send({ ok: 1 });
});
// http://localhost:7001/lists
app.get("/lists", async (req, res) => {
  console.log("show user");
  let row = await db("users_advisor");
  // .where("major_id", 98)
  res.send({
    datas: row,
    status: 1,
  });
});
app.get("/list", async (req, res) => {
  try {
    console.log("show user");
    let row = await db("member");
    // .where("major_id", 98)
    res.send({
      datas: row,
      status: 1,
    });
  } catch (e) {
    console.log(e.message);
    res.send({
      ok: 0,
      error: e.message,
    });
  }
});
app.post("/edit", async (req, res) => {
  try {
    console.log(req.body);
    let row = await db("member").where("id", "=", req.body.id).update({
      username: req.body.username,
      password: req.body.password,
      dep: req.body.dep,
    })
    console.log("row=", row)
    res.send({
      ok: 1,
      data1: row
    })
  } catch (e) {
    console.log(e.message);
    res.send({
      ok: 0,
      error: e.message,
    })
  }
})
app.post("/update", upload.any(), async (req, res) => {
  try {
    console.log('update')
    console.log('req.body.id=',req.body.id)
    console.log('req.files=',req.files)
    console.log('req.file.fname=', req.files[0].filename)
    console.log(req.body);
      let row = await db("member").where("id", "=", req.body.id).update({
      username: req.body.username,
      password: req.body.password,
      dep: req.body.dep,
      img: req.files[0].filename
    });
    // console.log("row=", row);
    res.send({
      ok: 1,
      data: row,
    });
  } catch (e) {
    console.log(e.message);
    res.send({
      ok: 0,
      error: e.message,
    });
  }
});

app.get("/del", async (req, res) => {
  try {
    console.log("show id=", req.query.id);
    let row = await db("member").where("id", "=", req.query.id).del();
    res.send({
      datas: row,
      ok: 1,
    });
    console.log("row=", row);
  } catch (e) {
    console.log(e.message);
    res.send({
      ok: 0,
      error: e.message,
    });
  }
});
app.get("/listedit", async (req, res) => {
  console.log("show id", req.query);
  let row = await db("member").where("id", req.query.id);
  res.send({
    datas: row[0],
    status: 1,
  });
});
// http://localhost:7001/insert?name='oak'&age='50'

app.get("/insert", async (req, res) => {
  try {
    console.log(req.query);
    console.log(req.query.name);
    ids = await db("member").insert({
      username: req.query.name,
      password: req.query.passwd,
      dep: req.query.dep,
    });
    res.send({
      ok: 1,
      data: req.query,
      ids: ids[0],
    });
  } catch (e) {
    console.log(e.message);
    res.send({
      ok: 0,
      error: e.message,
    });
  }
}); // insert

// http://localhost:7001/insert?name='oak'&age='50'

app.post("/add",  upload.any(), async (req, res) => {
  try {
    console.log('req.files=',req.files)
    console.log('req.file.fname=', req.files[0].filename)
    console.log(req.body);
    
    ids = await db("member").insert({
      username: req.body.username,
      password: req.body.password,
      dep: req.body.dep,
      img: req.files[0].filename,
    });
    res.send({
      ok: 1,
      ids: ids[0],
    });
  } catch (e) {
    console.log(e.message);
    res.send({
      ok: 0,
      error: e.message,
    });
  }
}); // insert
app.listen(7001, () => {
  console.log("ready:candle:7001");
});