function qS(e){return document.querySelector(e)}function time(){return(new Date).getTime()}var root=process.cwd(),nw=require("nw.gui"),fs=require("fs"),store=require(root+"/js/vendor/json-store.js"),settings=store(root+"/data/settings.json"),win=nw.Window.get();win.isMaximized=!1;var app=function(){"use strict";return{run:function(){this.preloader(".loader"),this.templating(),this.window(),qS("#debug").addEventListener("click",function(e){e.preventDefault(),win.showDevTools()},!1),qS("#open").addEventListener("click",function(e){e.preventDefault(),app.clickEvent("openFile")},!1),qS("#openFile").addEventListener("change",function(){app.openFiles(this.value,document)},!1),qS("#save").addEventListener("click",function(e){e.preventDefault(),app.clickEvent("saveFile")},!1),qS("#saveFile").addEventListener("change",function(){app.saveFiles(this.value,document)},!1);var e=qS("#htmlEditor");e&&e.addEventListener("click",function(e){e.preventDefault(),location.href="./html_code.html"},!1);var n=qS("#mkdEditor");n&&n.addEventListener("click",function(e){e.preventDefault(),location.href="./index.html"},!1)},refresh:function(){location&&location.reload()},templating:function(){var e,n=document.querySelectorAll(".tpl");Array.prototype.forEach.call(n,function(n){e=n.getAttribute("data-tpl"),e&&(n.textContent=settings.get(e))})},preloader:function(e){var n=document.querySelector(e),t=setInterval(function(){n.classList.add("finish");var e=setTimeout(function(){n.remove(),clearTimeout(e)},800);clearInterval(t)},1800)},clickEvent:function(e){var n=document.createEvent("MouseEvents");n.initMouseEvent("click"),document.getElementById(e).dispatchEvent(n)},openFiles:function(e){fs.readFile(e,"utf-8",function(e,n){qS("#editor-area").value=n})},saveFiles:function(e){var n=qS("#editor-area").value;fs.writeFile(e,n)},window:function(){qS("#windowControlMinimize").onclick=function(){win.minimize()},qS("#windowControlClose").onclick=function(){win.close()},qS("#windowControlMaximize").onclick=function(){win.isMaximized?win.unmaximize():win.maximize()},win.on("maximize",function(){win.isMaximized=!0}),win.on("unmaximize",function(){win.isMaximized=!1})}}}();window.addEventListener("load",function(){app.run()});
