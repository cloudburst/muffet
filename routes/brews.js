var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
// for parsing application/json
router.use(bodyParser.json()); 
// for parsing application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true })); 

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/muffet');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    //we're connected
});

var brew_schema = mongoose.Schema({
    date: Date,
    bean: String,
    dose: Number,
    bw: Number,
    tds: Number,
    lrr: Number,
    extraction: Number,
    grind: String
});

var brew = mongoose.model('brew', brew_schema);

// REST API /brews
router.get('/', function(req, res) {
    brew.find({}).sort({date: -1}).exec(function(err, brews) {
        if (err) throw err;
        res.json(brews);
    });
});

router.get('/:id', function(req, res) {
    brew.findOne({ _id: req.params.id }, function(err, brew) {
        if (err) throw err;
        res.json(brew);
    });
});

router.post('/', function(req, res) {
    var b = new brew({
        date: req.body.date,
        bean: req.body.bean,
        dose: req.body.dose,
        bw: req.body.bw,
        tds: req.body.tds,
        lrr: req.body.lrr,
        extraction: req.body.extraction,
        grind: req.body.grind
    });
    b.save(function(err) {
        if (err) throw err;
        res.json(b);
    });
});

router.put('/:id', function(req, res) {
    brew.findByIdAndUpdate(req.params.id, { 
        $set: { 
            date: req.body.date,
            bean: req.body.bean,
            dose: req.body.dose,
            bw: req.body.bw,
            tds: req.body.tds,
            lrr: req.body.lrr,
            extraction: req.body.extraction,
            grind: req.body.grind
        }}, function(err, b) {
            if (err) throw err;
            res.json(b);
        }
    );
});

module.exports = router;
