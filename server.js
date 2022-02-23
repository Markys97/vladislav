const express= require('express');
const mysql= require('mysql2');
const session= require('express-session');
const bodyParser= require('body-parser');
const { localsName } = require('ejs');
const app= express();
const PORT= process.env.PORT ?? 8000;

app.use(express.static(__dirname + '/public'));
app.use(session({
    secret:'marcus',
    resave: false,
    saveUninitialized: false
}))

 app.set('view engine','ejs')

const connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'restaurant'
})

connection.connect((err)=>{
    if(err){
        throw err
    }else{
        console.log('database connecting')
    }
})

var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
// POST /login gets urlencoded bodies


app.get('/Home',(req,res)=>{
   
    let row;
    let panier=[];
    req.session.panier=panier;
    console.log(req.session.panier)
    
    connection.query('select * from pizza',(err, data)=>{
        if(err){
            throw err
        }else{
           row= data
        }
        res.render('Home',{title:'Home',row,active:'shop'})
    })
 
  
})

app.get('/order/id=:id',(req,res)=>{
    let id= req.params.id
    let price;
    let  name;
    let picture;
   let datas;
   
   connection.query('select picture,price,name from pizza where id='+id,(err,data)=>{
       if(err){
           throw err
       }
       else{
            data.forEach(element => {
                picture=element['picture'];
                price= element['price'];
                name= element['name']
            });
            connection.query('select * from ingredient',(err,result)=>{
                if(err){
                    throw err
                }else{
                    datas=result
                }
                res.render('order',{title:'Order',picture,price,name,datas,active:''})
            })
       
       }
       
   })
   
})

app.get('/connection',(req,res)=>{

    
  
    res.render('connection',{title:'connection',active:'connection'})
})
app.post('/saveOrder', urlencodedParser, function (req, res) {

    let orderJson= req.body.order

   connection.query("INSERT INTO commande( `order`) VALUES (?)",[orderJson])
    


   res.send('success')
   
})











app.listen(PORT,()=>{
    console.log('server runn onnn port '+ PORT)
})