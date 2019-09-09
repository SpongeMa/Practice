window.onload=function(){
    //换肤功能
    let colorArr=["white","rgb(204,232,207)", "rgb(200,200,169)", "rgb(114,111,128)"];
    let key=localStorage.getItem('key')||0;
    if(localStorage.getItem('key')){
        document.body.style.backgroundColor = colorArr[localStorage.getItem('key')];
    }
    document.querySelector('.changeSkin').onclick=function(){
        key++;
        key = key==colorArr.length?0:key;
        localStorage.setItem('key',key);
        document.body.style.backgroundColor = colorArr[key];
    }
   
    //给每首歌添加鼠标经过事件，控制播放按钮的显示与关闭
    let listContainer=document.querySelectorAll('.listContainer');
    let btnController=document.querySelectorAll('.btnController');
    listContainer.forEach((item,index)=>{
       console.log(item)
        item.onmouseover = function(){
            btnController.forEach((v,i)=>{
                v.style.display='none';
                if(i==(index-1))
                    btnController[i].style.display='block';
            })
        }
    })
}
function showDetail(musicItem){
    //去重
    if(localStorage.getItem('musicData')){
        let musicData = JSON.parse(localStorage.getItem('musicData'));
        if(!musicData.find((v,i)=>v.id==musicItem.id))
            musicData.push(musicItem);
            localStorage.setItem('musicData',JSON.stringify(musicData));
    }else{
        localStorage.setItem('musicData',JSON.stringify([musicItem]));
    }
    
    //当isOpen状态为false才可以打开（不允许打开多个页面）
    if(localStorage.getItem('isOpen')!=='true')
        window.open("/detail");
}