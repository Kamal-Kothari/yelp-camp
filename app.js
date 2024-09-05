const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Camp = require('./models/campground');
const methodOverride= require('method-override');
const ejsMate = require('ejs-mate');


const app=express();

mongoose.connect('mongodb://127.0.0.1:27017/yelp')
.then(()=>{
    console.log('db connected');
    
})
.catch((e)=>{
    console.log(e,' some err');
    
})

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


async function createOne( ) {
    const camp1 = new Camp({
        title : 'my camp',
        description : 'cheap one',
    })
    try{
        const c1 = await camp1.save();
        console.log(c1);
        
    }catch(e){
        console.log(e);
        
    }
}
// createOne();

async function deleteAll(){
    await Camp.deleteMany({})
    .then(()=>{
        console.log('deleted all');
        
    }).catch(e=>{
        console.log(e);
        
    })
}

// deleteAll();

app.get('/',(req,res)=>{
    // res.send('home page');
    res.render('campground/home');// res.render('home') => err as home file under campground
})

app.get('/check', (req, res) => {
    res.render('checkLay', { layout: 'layout' }); // or './layout' if you prefer relative path
});

app.get('/camps',async (req,res)=>{
    const allCamps = await Camp.find({});
    res.render('./campground/index',{allCamps});
})

app.get('/camps/new',(req,res)=>{
    res.render('campground/new');
})

app.post('/camps',async (req,res)=>{
    console.log(req.body);
    const newCamp = req.body.campground;
    const newObj = await Camp.create(newCamp);
    res.redirect(`/camps/${newObj._id}`);
    
})

app.get('/camps/:id',async (req,res)=>{
    const id = req.params.id;
    const camp = await Camp.findById(id);
    // console.log(camp);
    res.render('campground/show',camp);
})

app.get('/camps/:id/edit',async (req,res)=>{
    const id = req.params.id;
    const camp = await Camp.findById(id);
    res.render('campground/edit',camp);
})

app.put('/camps/:id',async (req,res)=>{
    console.log(req.body);
    // res.send('edited');
    const id = req.params.id;
    const options ={
        new : true,
        runValidators : true,
    }
    const updated = await Camp.findByIdAndUpdate(id,req.body.campground,options);
    console.log(updated);

    res.redirect(`/camps/${id}`);
    
})

app.delete('/camps/:id',async (req,res)=>{
    const id = req.params.id;
    await Camp.findByIdAndDelete(id);
    res.redirect('/camps');
})

//error handling 
    //use try catch in async and pass err to next , 
    // catch(err){
    //     next(err);
    // }

app.listen(3000,()=>{
    console.log('Listening on port 3000');
    
})

// const camp = new Camp({
//     title : randTitle,
//     location : randCityName,
// })

// {
//     _id: new ObjectId('66d3dd10ddc424f6b80ff10f'),
//     title: 'Maple Hollow',
//     location: 'Austin, Texas',
//     __v: 0
//   }