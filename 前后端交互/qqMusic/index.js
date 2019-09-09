const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const md5 = require('md5');
let musicData = require('./data/music.json');
let usersData = require('./data/users.json');
const app = new Koa();
const router = new Router();
app.use(views(__dirname+'/views'));
app.use(static(__dirname+'/static'));;
app.use(bodyParser());
router.get('/login',async ctx=>{
    await ctx.render('login.pug');
    if(ctx.cookies.get('isLogin')){
        ctx.redirect('/list');
    }
})
router.post('/checkUser',ctx=>{
    //判断用户名密码是否正确
    let res = usersData.find(v=>v.username===ctx.request.body.username&&v.pwd===parseInt(ctx.request.body.pwd));
    if(res){
        //判断是否勾选记住密码
        if(ctx.request.body.rememberMe){
            //对用户名密码进行加密
            let value=md5(ctx.request.body.username+ctx.request.body.pwd);
            ctx.cookies.set('isLogin',value,{
                maxAge:1000*3600*24*7
            })
        }
        ctx.redirect('/list');
    }else{
        ctx.redirect('/error');
    }
})
router.get('/detail',async ctx=>{
    await ctx.render('detail.pug');
})
router.get('/list',async ctx=>{
    await ctx.render('list.pug',{
        musicData
    });
})
router.get('/error',async ctx=>{
    await ctx.render('error.pug');
})
app.use(router.routes());
app.listen(3000);