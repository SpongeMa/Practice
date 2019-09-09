const fs = require('fs');
let newsData = require('../data/data.json');

module.exports={
    getData(){
        return newsData;
    },
    setData(ctx){
        let {title,content,type,country}=ctx.request.body;
        let date = new Date();
        let tempData = {
            id:newsData[newsData.length-1].id+1,
            title,
            content,
            addTime: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
            country,
            type
        }
        if(typeof ctx.request.files!=='undefined'){
            let imgName = ctx.request.files.img.name;
            let tempPath = ctx.request.files.img.path;
            fs.writeFileSync('static/img/'+imgName,fs.readFileSync(tempPath));
            tempData.imgUrl='/img/'+imgName;
        }
        
        newsData.push(tempData);
        return new Promise(resolve=>{
            fs.writeFile('data/data.json',JSON.stringify(newsData),(err)=>{
                if(err){
                    console.log(err);
                    resolve({
                        code:0,
                        info:"写入失败"
                    });
                }else{
                    console.log('写入成功');
                    resolve({
                        code:1,
                        info:"写入成功"
                    });
                }
            });
            
        })
    }
}
