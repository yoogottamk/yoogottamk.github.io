const t=["/404.html","/about/","/blog/tags.html","/blog/","/","/projects/tags.html","/projects/","/snippets/tags.html","/snippets/","/blog/port-based-routing","/blog/vim-anywhere","/blog/managing-path","/blog/under-construction","/projects/under-construction","/projects/c-shell","/projects/website","/projects/visudoku","/snippets/jupyter-imshow","/snippets/fddb-loader","/snippets/lp-visualizer","/snippets/ffmpeg-invocations"],e=window.location.pathname;function n(t,e){const n=Array(t.length+1).fill(null).map((()=>Array(e.length+1).fill(null)));for(let e=0;e<=t.length;e++)n[e][0]=e;for(let t=0;t<=e.length;t++)n[0][t]=t;for(let s=1;s<=t.length;s++)for(let i=1;i<=e.length;i++)n[s][i]=Math.min(n[s-1][i]+1,n[s][i-1]+1,n[s-1][i-1]+!(t[s-1]==e[i-1]));return n[t.length][e.length]}document.addEventListener("DOMContentLoaded",(function(){let s=$("#page-list");s.html(""),t.splice(t.indexOf("/404.html"),1),pageEditDistance=[],t.forEach((t=>pageEditDistance.push({dist:n(e,t),page:t}))),pageEditDistance.sort(((t,e)=>t.dist-e.dist)).slice(0,10),pageEditDistance.forEach((t=>s.append(`<li>[${t.dist}] &nbsp;&nbsp;&nbsp; <a href="${t.page}">${t.page}</a></li>`)))}));