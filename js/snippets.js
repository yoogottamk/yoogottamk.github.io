const t=[{id:"/snippets/jupyter-imshow",tags:["opencv","python","jupyter","matplotlib"],title:"Jupyter imshow"},{id:"/snippets/fddb-loader",tags:["python","fddb","dataset-loader"],title:"FDDB Loader"}];document.addEventListener("DOMContentLoaded",(function(){let e=$("#searchBar");e.on("input propertychange",(function(){let n=e.val().toLowerCase(),i=$("div.snippets"),o=$("#not-found");if(o.html(""),i.children().each((function(){$(this).css({display:"flex"})})),!n.length)return;let s=function(e){let n=[];return t.forEach((t=>{(function(t,e){return t.title.toLowerCase().includes(e)||t.tags.join("|").toLowerCase().includes(e)})(t,e)&&n.push(t.id)})),n}(n);s.length||o.html("I haven't worked on this (yet)!"),i.children().each((function(){s.includes($(this).attr("id"))||$(this).css({display:"none"})}))}))}));