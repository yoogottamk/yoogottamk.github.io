const t=["/404.html","/about/","/blog/tags.html","/blog/","/","/projects/tags.html","/projects/","/snippets/tags.html","/snippets/","/blog/port-based-routing","/blog/padding-oracle","/blog/vim-anywhere","/blog/managing-path","/blog/under-construction","/projects/under-construction","/projects/c-shell","/projects/website","/projects/visudoku","/snippets/jupyter-imshow","/snippets/fddb-loader"],e=window.location.pathname;function n(t,e){const n=Array(t.length+1).fill(null).map((()=>Array(e.length+1).fill(null)));for(let e=0;e<=t.length;e++)n[e][0]=e;for(let t=0;t<=e.length;t++)n[0][t]=t;for(let l=1;l<=t.length;l++)for(let s=1;s<=e.length;s++)n[l][s]=Math.min(n[l-1][s]+1,n[l][s-1]+1,n[l-1][s-1]+!(t[l-1]==e[s-1]));return n[t.length][e.length]}document.addEventListener("DOMContentLoaded",(function(){let l=$("#page-list");l.html(""),t.splice(t.indexOf("/404.html"),1),pageEditDistance=[],t.forEach((t=>pageEditDistance.push({dist:n(e,t),page:t}))),pageEditDistance.sort(((t,e)=>t.dist-e.dist)).slice(0,10),pageEditDistance.forEach((t=>l.append(`<li>[${t.dist}] &nbsp;&nbsp;&nbsp; <a href="${t.page}">${t.page}</a></li>`)))}));