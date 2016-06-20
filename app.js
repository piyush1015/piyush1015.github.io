
var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    ejs      = require('ejs')


Schema = new mongoose.Schema({
    dName : String,
    aName : String,
    dContactno: String,
    dEmail: String,
    dAddress : String,
    aType:String,
    aQuantity:String,
    postedOn: Date
}),

Sdonation = mongoose.model('Sdonation', Schema);

mongoose.connect('mongodb://piyush:abcd@ds019054.mlab.com:19054/piyush1010');


var app = express()

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(__dirname + '/public'));

app.get('/api', function (req, res) {
    res.json(200, {msg: 'OK' });
})

app.get('/donors', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Sdonation.find({}, function ( err, donors ){
        if(!err && donors){
            res.render('donors.ejs',{
                data :  donors
            })
        } else {
            console.log(err)
        }
    });
});

app.get('/admin', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Sdonation.find({}, function ( err, donors ){
        if(!err && donors){
            res.render('admin.ejs',{
                data :  donors
            })
        } else {
            console.log(err)
        }
    });
});


app.get('/addSdonation', function(req, res){
    res.render('addPost.ejs')
})

app.get('/', function(req, res){
    Sdonation.find({}).limit(3).exec(function(err, donors){
        if(!err && donors){
            res.render('index.ejs',{
                data :  donors
            })
        } else{
            console.log(err);
            res.status(500).send("something went wrong while fetching donation summary");
        }
    })
})

app.post('/api/addSdonation', function (req, res) {
    var donation = new Sdonation(
        {
             dName: req.body.dName, 
             aName : req.body.aName,
             dContactno : req.body.dContactno,
             dEmail : req.body.dEmail,
             dAddress: req.body.dAddress,
             aType:req.body.aType,
             aQuantity:req.body.aQuantity,
             postedOn:Date.now()
        }
    );

    // http://mongoosejs.com/docs/api.html#model_Model-save
    donation.save(function (err, data) {
        if(!err && data){
            console.log('Record added successfully');
            res.redirect('/donors')
        } else {
            res.json(500, {msg: 'Something went wrong' });
            console.log(err)
        }

    });
})

app.get('/api/donors', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    User.remove({ category: 'music' }, function ( err ) {
        if(!err){
            console.log("User deleted successfully")
        } else{
            console.log(err)
        }
    });
})

app.get('/donation/:id', function(req, res){
    Sdonation.findById( req.params.id, function ( err, donation ) {
        if(!err && donation){
            res.render('donationDetail.ejs',{
                data : donation
            })
        } else {
            console.log(err)
        }
    });
} )

app.get('/about', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Sdonation.find({}, function ( err, donors ){
        if(!err && donors){
            res.render('about.ejs',{
                data :  donors
            })
        } else {
            console.log(err)
        }
    });
});
app.get('/editSdonation/:id', function(req, res){
    Sdonation.findById( req.params.id, function ( err, donation ) {
        if(!err && donation){
            res.render('editPost.ejs',{
                data : donation
            })
        } else {
            console.log(err)
        }
    });

})

app.post('/api/editSdonation/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Sdonation.findById( req.params.id, function ( err, donation ) {
            donation.dName = req.body.dName,
            donation.aName = req.body.aName,
            donation.dContactno = req.body.dContactno,
            donation.dEmail = req.body.dEmail,
            donation.dAddress = req.body.dAddress,
            donation.aType=req.body.aType,
            donation.aQuantity=req.body.aQuantity,
            
            // http://mongoosejs.com/docs/api.html#model_Model-save
            donation.save( function ( err, data ){
            if(!err && data){
                res.redirect('/donors')
            } else {
                console.log(err)
            }

        });
    });
});

app.get('/api/deleteSdonation/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Sdonation.findById( req.params.id, function ( err, donation ) {
        // http://mongoosejs.com/docs/api.html#model_Model.remove
        donation.remove( function ( err ){
           console.log("Record deleted successfully")
            res.redirect('/admin')
        });
    });
});

app.listen(1015);
console.log('server running on port -->> 1015');

