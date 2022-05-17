const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require('mongoose');

const app = express();

const Posts = require('./posts.js');

mongoose.connect( 'mongodb+srv://root:Gj7XzWsjKeznZVkB@cluster0.dgsqn.mongodb.net/dnz?retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Conectado com sucesso');
}).catch((err)=>{
    console.log(err.message);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res)=>{

    if(req.query.busca == null){
        Posts.find({}).sort({'_id': -1}).exec((err, posts)=>{

            posts = posts.map((val)=>{
                return{
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    shortDescription: val.conteudo.substr(0, 200),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria
                }
            })
            res.render('home', {posts: posts});
        })    
    }else{
        res.render('busca', {});
    }

})

app.get('/:slug',(req, res)=>{
    Posts.findOneAndUpdate({slug: req.params.slug}, {$inc: {views: 1}}, {new: true}, (err, response)=>{
        res.render('single', {noticia: response});
    })
})

app.listen(5000, ()=>{
    console.log('Server Rodando!');
})