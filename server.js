var express =   require("express");
var bodyParser =    require("body-parser");
var multer  =   require('multer');
var app =   express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
  //  callback(null, file.fieldname + '-' + Date.now());

    callback(null,Date.now() + '-' + file.originalname );
  }
});
var upload = multer({ storage : storage }).array('userPhoto',2);
app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});
app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        console.log(req.body);
        console.log(req.files);
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});
app.listen(9000,function(){
    console.log("Working on port 9000");
});