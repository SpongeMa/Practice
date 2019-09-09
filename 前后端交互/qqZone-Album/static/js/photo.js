let uploadBtn = document.querySelector('.mybtn');
let masking =document.querySelector('.masking');
let closeBtn = masking.querySelector('.close');

//上传框内的上传按钮div
let showContainer = document.querySelector('.showContainer');
//上传框的上传图片按钮
let fileInputBtn = showContainer.querySelector('input');

//显示待上传图片div
let loadContainer = document.querySelector('.loadContainer');
//显示待上传图片后继续添加图片按钮
let fileAddInputBtn = loadContainer.querySelector('input');
//文件暂存数组
let fileArr=[];

uploadBtn.addEventListener('click',function(){
    masking.style.display='block';
});
closeBtn.addEventListener('click',()=>{
    masking.style.display='none';
});
fileInputBtn.addEventListener('change',()=>{
    loadContainer.style.display = 'block';
    showContainer.style.display='none';
    
    Array.from(fileInputBtn.files).forEach(item => {
        let file = new FileUpload(item);
        file.creatEle();
        fileArr.push(file);
    });
    console.log(fileArr);
})
fileAddInputBtn.addEventListener('change',()=>{
    Array.from(fileAddInputBtn.files).forEach(item => {
        let file = new FileUpload(item);
        file.creatEle();
        fileArr.push(file);
    });
    console.log(fileArr);
})
document.querySelector('.uploadBtn').addEventListener('click',()=>{
    async function queue(){
        for(let i=0;i<fileArr.length;i++){
            await fileArr[i].upload();
        }
    }
    queue();
});

//文件上传类
class FileUpload{
    constructor(file){
        this.file=file;
        this.ele='';
    }
    creatEle(){
        let uploadPhotoItem = document.createElement('div');
        uploadPhotoItem.classList.add('uploadPhotoItem');
        let fileReader = new FileReader();
        fileReader.readAsDataURL(this.file);
        let _this=this;
        fileReader.onload =function(){
            uploadPhotoItem.innerHTML = `
                <span class="myProgress">
                    <span class="plan"></span>
                    <span class='progressText'>30%</span>
                </span>
                <img src=${fileReader.result} />
                <span class="pictureName">
                    ${_this.file.name}
                </span>
            `;
        }
        this.ele=uploadPhotoItem;
        loadContainer.querySelector('.wantUpload').appendChild(uploadPhotoItem); 
    }
    upload(){
        return new Promise(resolve=>{
            let xhr = new XMLHttpRequest();
            let form = new FormData();
            form.append('file',this.file);
            xhr.open('post','/upload',true);
            xhr.upload.onprogress=(evt)=>{
                // console.log(evt.loaded,evt.total);
                let percent=evt.loaded/evt.total*100;
                console.log(percent);
                
                this.ele.querySelector('.myProgress').style.display='block';
                this.ele.querySelector('.myProgress .plan').style.width=percent.toFixed(0)+'%';
                this.ele.querySelector('.myProgress .progressText').innerHTML=percent.toFixed(0)+'%';
            }
            xhr.upload.onload=()=>{
                resolve();
            }
            xhr.onload=function(){
                console.log(xhr.responseText);
            }
            xhr.send(form);
        });
    }
}
