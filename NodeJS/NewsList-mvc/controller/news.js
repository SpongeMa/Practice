const newsModel=require('../model/news');
let newsData = newsModel.getData();
let totalPage = Math.ceil(newsData.length/5);

module.exports={
    async showIndex(ctx){
        let currentPage=1;
        let p = ctx.query.p||currentPage;
        let renderData = newsData.slice((p-1)*5,p*5);
        await ctx.render('news/index.pug',{
            renderData,
            totalPage
        });
    },
    async showDetail(ctx){
        let id = ctx.query.id;
        let detailData=newsData[id-1];
        await ctx.render('news/detail.pug',{
            detailData
        });
    }
}