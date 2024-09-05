const mongoose = require('mongoose');
const Camp = require('../models/campground');
const allCity = require('./cities');
const {descriptors,places} = require('./seedHelper');



mongoose.connect('mongodb://127.0.0.1:27017/yelp')
.then(()=>{
    console.log('db connected');
    
})
.catch((e)=>{
    console.log(e,' some err');
    
})

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

const getRandom = function(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

const seed = async function(){
    await Camp.deleteMany({});

    for(let i=0;i<5;i++){
        const randCity = getRandom(allCity);
        const randCityName = `${randCity.city}, ${randCity.state}`;

        const randTitle = `${getRandom(descriptors)} ${getRandom(places)}` ;

        const imageSrc = `https://picsum.photos/400?random=${Math.random()}`;

        const price= Math.floor(Math.random()*20)+5;

        // console.log(randTitle,randCityName);
        const camp = new Camp({
            title : randTitle,
            location : randCityName,
            imageSrc, 
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur incidunt natus architecto pariatur maiores nulla, veniam, perferendis, repudiandae ex rem autem aliquid? Tenetur natus illo totam quod commodi voluptatem quae?",
            price,

        })

        await camp.save();


        
    }

    // const camp1 = new Camp({
    //     title : 'my seed camp',
    //     description : 'cheap one',
    // })
    
    // const c1 = await camp1.save();
    // console.log(c1);



}

seed()
.then(()=>{
    mongoose.connection.close();
});

