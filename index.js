const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require('mongoose');

var session = require("express-session");

const app = express();

const Posts = require('./models/posts');
const Users = require('./models/users');
const { Console } = require("console");

mongoose.connect( 'mongodb+srv://root:Gj7XzWsjKeznZVkB@cluster0.dgsqn.mongodb.net/dnz?retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Conectado com sucesso');
}).catch((err)=>{
    console.log(err.message);
});

app.use(session({
    secret: 'keybord cat',
    cookie: { maxAge: 60000}
}))

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

            posts = posts.map(function(val){
                return{
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    shortDescription: val.conteudo.substr(0, 200),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria
                }
            })

            Posts.find({}).sort({'views': -1}).limit(4).exec((err, postsTop)=>{

                postsTop = postsTop.map(function(val){
                    return{
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        shortDescription: val.conteudo.substr(0, 200),
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria
                    }
                })
                res.render('home', {posts: posts, postsTop: postsTop});
            })
        });      
    }else{

        Posts.find({titulo: {$regex: req.query.busca, $options:"i"}},(err, posts)=>{

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

            res.render('busca', {posts: posts, contagem: posts.length});
        })

       
    }

})

app.get('/:slug',(req, res)=>{
    Posts.findOneAndUpdate({slug: req.params.slug}, {$inc: {views: 1}}, {new: true}, (err, response)=>{

        if(response != null){

            Posts.find({}).sort({'views': -1}).limit(4).exec((err, postsTop)=>{

                postsTop = postsTop.map(function(val){
                    return{
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        shortDescription: val.conteudo.substr(0, 200),
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria
                    }
                })
                res.render('single', {noticia: response, postsTop: postsTop});
            })        
        } else {
            res.render('error', {});
        }
       
    })
})

app.get('/admin/login', (req, res)=>{
    if(req.session.login == null){
        res.render('login');
    }else{
        res.render('admin-panel', {});
    }
})

app.get('/registro/novo-cadastro', (req,res)=>{
    res.render('cadastro',{});
})
app.post('/admin/login', (req, res)=>{
    let user = req.body.login;
    let senha = req.body.senha;
    Users.findOne({user: user}).exec((err, user)=>{
        if(user.senha = senha){
            if(user.admin = true){

            }else{
                
            }
        }else{

        }
    })
})


app.listen(5000, ()=>{
    console.log('Server Rodando!');
})