const newsRouter = require("./routers/newsRouter");
const adminRouter = require("./routers/adminRouter");

module.exports=(app)=>{ 
    app.use(newsRouter.routes());
    app.use(adminRouter.routes());
}
