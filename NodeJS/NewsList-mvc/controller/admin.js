let adminModel = require('../model/admin.js');
let newsData = adminModel.getData();

module.exports={
    async showIndex(ctx){
        await ctx.render('admin/admin.pug');
    },
    async showAddNews(ctx){
        await ctx.render('admin/addNews.pug');
    },
    async showNewsList(ctx){
        let totalPage = Math.ceil(newsData.length/5);
        let currentPage =1;
        let p = ctx.query.p || currentPage;
        let renderData = newsData.slice((p-1)*5,p*5);
        await ctx.render('admin/newsList.pug',{
            renderData,
            totalPage
        });
    },
    async addNews(ctx){
        // console.log(ctx.request.body);
        // console.log(ctx.request.files);
        let res=await adminModel.setData(ctx);
        await ctx.render('admin/message.pug',{
            res
        })
        
    }
}