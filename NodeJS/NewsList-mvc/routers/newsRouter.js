const Router = require("koa-router");
const newsController = require('../controller/news');
const newsRouter = new Router({
    prefix:'/news'    
});
newsRouter.get("/index",newsController.showIndex);
newsRouter.get("/detail",newsController.showDetail);
module.exports = newsRouter;