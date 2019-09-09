//页面关闭后设置成关闭状态
window.addEventListener('unload',()=>{
    localStorage.setItem('isOpen',false);
})
//页面中localStorage数据发生变化更新视图
window.addEventListener('storage',()=>{
    updateView();
})

window.onload=function(){
    //页面加载完成后更新视图
    updateView();
    //页面打开后设置成开启状态
    localStorage.setItem('isOpen',true);

    //点击删除
    document.querySelector('.deleteItem').onclick=function(){
        let inputs = document.querySelectorAll('.exchange input');
        let musicData = JSON.parse(localStorage.getItem('musicData'))||[];
        //记录删除个数
        let deleteCount=0;
        inputs.forEach((v,i)=>{
            if(v.checked){
                musicData.splice(i-deleteCount,1); 
                deleteCount++;
            }
        });
        localStorage.setItem('musicData',JSON.stringify(musicData));
        document.querySelector('#selectAll').checked=false;
        updateView();
    }
    //点击清空列表
    document.querySelector('.deleteAll').onclick=function(){
        document.querySelector('#selectAll').checked=false;
        localStorage.removeItem('musicData');
        updateView();
    }
    //点击全选按钮
    document.querySelector('#selectAll').onclick=function(){
        let inputs = document.querySelectorAll('.exchange input');
        if(this.checked){
            inputs.forEach(v=>{
                v.checked=true;
            })
        }else{
            inputs.forEach(v=>{
                v.checked=false;
            })
        }
    }
}


//更新视图函数
function updateView(){
    let musicData = JSON.parse(localStorage.getItem('musicData'));
    let innerhtml = '';
    if(musicData){
        musicData.forEach((v,i) => {
            innerhtml+=`
            <ul class='myul'>
                <input type='checkbox'>
                <li>${v.songName}</li>
                <li>${v.singer}</li>
                <li>${v.time}</li>
            </ul>
            `
        });
    }   
    document.querySelector('.exchange').innerHTML=innerhtml;

}
