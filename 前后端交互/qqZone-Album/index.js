const Koa = require("koa");
const static = require("koa-static");
const koaBody = require("koa-body");
const Router = require("koa-router");
const fs = require("fs");
const userData = require("./data/users.json");
const images = require("./data/images.json");
const app = new Koa();
let router = new Router();
app.use(koaBody({
    multipart: true, // 支持文件上传
}));
app.use(static(__dirname + "/static"));
router.get("/", (ctx, next) => {
    ctx.body = "hello world";
})
//提交表单验证
router.post('/checkUser',ctx=>{
    console.log(ctx.request.body);
    let res = userData.find(v=>v.username==ctx.request.body.username&&v.pwd==parseInt(ctx.request.body.pwd));
    if(res){
        ctx.cookies.set('uid',res.id,{
            'maxAge':1000*3600*24*7
        });
        ctx.redirect('/photo.html');
    }else{
        ctx.redirect('/login.html');
    }
})
//验证用户名
router.get('/checkUserName',ctx=>{
    let res = userData.find(v=>v.username==ctx.query.username);
    if(res){
        ctx.body={
            code:1,
            info:'用户名正确'
        };
    }else{
        ctx.body={
            code:0,
            info:'用户名错误'
        };
    }
})
//存储文件
router.post('/upload',ctx=>{
    let tempPath = ctx.request.files.file.path;
    let tempName = ctx.request.files.file.name;
    let tempData = fs.readFileSync(tempPath);
    fs.writeFileSync('static/imgs/'+tempName,tempData);
    ctx.body='success'
})
app.use(router.routes());
app.listen(3000);