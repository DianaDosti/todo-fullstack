const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://todoDiana:testtodo@cluster0.opfu5.mongodb.net/newtodolistdb', {useNewUrlParser: true ,  useFindAndModify: true}); // connection to my db

//date
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
var currentDay = today.toLocaleDateString("en-US", options);
var time = today.getHours() + ':' + today.getMinutes();


// Schema
const todoSchema = new mongoose.Schema({
name: String
});
// collections
const TodoDaily = mongoose.model('TodoDaily', todoSchema);
const TodoWork = mongoose.model('TodoWork', todoSchema);

const todo1 = new TodoDaily({
name: 'Add your todo'
});

const todo2 = new TodoWork({
name: 'Everything that you have to do'
});

const defaultDailyTodos = [todo1];  //default document for daily 
const defaultWorkTodos = [todo2];   // default document for work


// ##

app.get('/', (req, res) =>{
    TodoDaily.find({}, (err, todos) =>{

        if(todos.length === 0){
            TodoDaily.insertMany(defaultDailyTodos, (err) =>{
                if(err){
                console.log(err);
                }else{
                console.log('Data added');
                }
            });
            res.redirect('/');
        }
        else{
           
            res.render('list', {day: currentDay, time: time, listTitle: 'Daily', newListItem: todos});
        }
    });
   
    
});

// ##

app.get('/work', (req, res) =>{
    TodoWork.find({}, (err, worktodos) =>{
        if(worktodos.length === 0){
            TodoWork.insertMany(defaultWorkTodos, (err) =>{
                if(err){
                console.log(err);
                }else{
                console.log('Data added');
                }
            });
            res.redirect('/work');
        }else{
            res.render('list', {day: currentDay, time: time, listTitle: 'work', newListItem: worktodos});
        }
    });
    
});

// ##

app.post('/', (req, res) =>{
const  itemName = req.body.itemText;
let list =  req.body.list;

if(list === 'Daily'){
    const item = new TodoDaily ({
        name: itemName
    });
item.save();
res.redirect('/');
}
else if(list === 'work'){
const workItem = new TodoWork ({
    name: itemName
});
workItem.save();
res.redirect('/work');
}
});

// delete items

app.post('/delete', (req, res) =>{
const deleteItemDaily = req.body.Daily;
const deleteItemWork = req.body.work;
console.log(deleteItemWork);
if(deleteItemDaily) {
    TodoDaily.deleteOne({_id: deleteItemDaily}, (err) =>{
        if(!err){
            res.redirect('/');
        }else{
            console.log(err);
        }
    });
}else if(deleteItemWork){
    TodoWork.deleteOne({_id: deleteItemWork} , (err) =>{
        if(!err){
            res.redirect('/work');
        }else{
            console.log(err);
        }
    });
}
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, ()=>{
console.log("server started");
});