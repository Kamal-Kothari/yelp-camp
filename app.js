const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Camp = require('./models/campground');
const methodOverride= require('method-override');
const ejsMate = require('ejs-mate');
const { nextTick } = require('process');
const morgan = require('morgan');
const catchAsync = require('./utils/catchAsync');
const Joi = require('joi');
const Review = require('./models/review');


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
app.use(morgan('tiny'));

function validateCampUsingJoi(req,res,next){
    const campSchema = require('./utils/campSchema');

    const result= campSchema.validate(req.body);
    console.log(result.error);
    
    const {error} = result;

    if(error){
        const msg= error.details.map(el=> el.message).join(',')
        console.log('inside joi error');
        throw new Error('validation err from joi')
        
    }

    next(); //missed
}

function validateReviewUsingJoi(req,res,next){
    const reviewSchema = require('./utils/reviewSchema');
    // const campSchema = require('./utils/campSchema');

    const result= reviewSchema.validate(req.body);
    console.log(result.error);
    
    const {error} = result;

    if(error){
        const msg= error.details.map(el=> el.message).join(',')
        console.log('inside joi error');
        throw new Error('validation err from joi')
        
    }

    next(); //missed
}


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

//review routes

app.post('/camps/:campId/reviews',validateReviewUsingJoi,async (req,res)=>{
    const id = req.params.campId;
    const camp = await Camp.findById(id);

    const review = await  Review.create(req.body.review);

    camp.reviews.push(review);
    await camp.save();

    console.log(camp);
    

    res.redirect(`/camps/${camp._id}`);
})

app.delete('/camps/:campId/reviews/:reviewId',async (req,res)=>{
    const {reviewId,campId}=req.params;
    
    const review = await Review.findByIdAndDelete(reviewId);

    await Camp.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } });

    console.log(review);
    

    res.redirect(`/camps/${campId}`);
})

//camp routes

app.get('/',(req,res)=>{
    // res.send('home page');
    res.render('campground/home');// res.render('home') => err as home file under campground
})

app.get('/check', (req, res) => {
    res.render('checkLay', { layout: 'layout' }); // or './layout' if you prefer relative path
});

app.get('/camps',catchAsync(async (req,res)=>{
    const allCamps = await Camp.find({});
    res.render('./campground/index',{allCamps});
}))

app.get('/camps/new',(req,res)=>{
    res.render('campground/new');
})

app.post('/camps',validateCampUsingJoi,catchAsync(async (req,res,next)=>{

    // {
    //     campground: {
    //       title: 'mahableshaw',
    //       location: 'bhuj',
    //       price: '2',
    //       imageSrc: 'https://picsum.photos/400?random=5',
    //       description: 'asds'
    //     }
    //   }

    

    console.log(req.body);
        // z();
    const newCamp = req.body.campground;
    const newObj = await Camp.create(newCamp);
    res.redirect(`/camps/${newObj._id}`);    
}))

// app.get('/camps/:id',async (req,res)=>{
//     const id = req.params.id;
//     const camp = await Camp.findById(id);
//     // console.log(camp);
//     res.render('campground/show',camp);
// })

// app.get('/camps/:id', async (req, res,next) => {
//     try {
//         const id = req.params.id;
//     console.log("ID received:", id); // Check what ID is being used
//     const camp = await Camp.findById(id);
//     if (!camp) {
//         return res.status(404).send("Camp not found");
//     }
//     res.render('campground/show', camp);
//     } catch (e) {
//         next(e);
//     }
// });


// Middleware to check if ID is valid
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid ID format');
  }
  next();
};

app.use('/camps/:id', validateObjectId);

app.get('/camps/:id',catchAsync( async (req, res) => {
    const camp = await Camp.findById(req.params.id).populate('reviews');
    if (!camp) {
      return res.status(404).send('Camp not found');
    }
    res.render('campground/show',camp);
}));



app.get('/camps/:id/edit',catchAsync( async (req,res)=>{
    const id = req.params.id;
    const camp = await Camp.findById(id);
    res.render('campground/edit',camp);
}))

app.put('/camps/:id',validateCampUsingJoi,catchAsync( async (req,res)=>{
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
    
}))

app.delete('/camps/:id',catchAsync( async (req,res)=>{
    const id = req.params.id;
    await Camp.findByIdAndDelete(id);
    // z();
    res.redirect('/camps');
}))

//error handling 
    //use try catch in async and pass err to next , 
    // catch(err){
    //     next(err);
    // }
app.use((err,req,res,next)=>{
    if(err){
        console.log(err.message);
        console.log(err.stack);

    } 
        
    
    res.send('some err');
})

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