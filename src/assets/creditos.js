const tabs = document.querySelectorAll('.tab_btn')
const all_content = document.querySelectorAll('.content_box')
window.addEventListener("resize", (events)=>setLine())

setLine();
tabs.forEach((tab, index)=>{
    tab.addEventListener('click', (e)=>{
        tabs.forEach(tab=>{tab.classList.remove('active')});
        tab.classList.add('active');

        var line=document.querySelector('.line');
        line.style.width = e.target.offsetWidth + "px";
        line.style.left = e.target.offsetLeft + "px";

        all_content.forEach(content=>{content.classList.add('hidden')});
        all_content[index].classList.remove('hidden')
    })

})

function setLine(){
    var element = document.querySelector('.tab_btn.active');
    var line=document.querySelector('.line');
    line.style.width = element.offsetWidth + "px";
    line.style.left = element.offsetLeft + "px";
}
