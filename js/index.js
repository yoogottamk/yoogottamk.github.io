let e,t,n,r="/";const s={"/":["/blog/","/projects/","/snippets/","/about/"],"/about/":[],"/blog/":["/blog/port-based-routing","/blog/vim-anywhere","/blog/managing-path","/blog/under-construction"],"/projects/":["/projects/under-construction","/projects/c-shell","/projects/website","/projects/visudoku"],"/snippets/":["/snippets/jupyter-imshow","/snippets/fddb-loader","/snippets/lp-visualizer","/snippets/ffmpeg-invocations"]},i={ls:"Usage: ls [dir]\nList the files in a directory\nDefaults to current directory\nTakes absolute and relative paths\n",cd:"Usage: cd [dir]\nChange the current directory to dir\nDefaults to root directory\nTakes absolute and relative paths\n",cat:"Usage: cat file\nView a page on this website\nTakes absolute and relative paths\n",clear:"Usage: clear\nClears the screen\n",help:"Usage: help [cmd]\nDisplay help on cmd or show help for all commands\n"},o=r;function l(e){switch(e||(e=o),e){case".":e=r;break;case"..":e=r.slice(0,-1).split("/").slice(0,-1).join("/")||o;break;default:if(e.startsWith(".."))return l(".."),l(e.slice(3));if(e.startsWith("./")){for(;e.startsWith("./");)e=e.slice(2);return l(e)}if("/"!=e[0]&&(e=r+e),e+"/"in s&&(e+="/"),!(e in s))return`Error! "${e}": No such directory exists`}return e.length<o.length&&(e=o),r=e,s[r].length||(window.location.href=r),t.text(r),0}function a(){e.text(""),n.text("")}const c={ls:function(t){switch(t||(t=r),t){case".":t=r;break;case"..":t=r.slice(0,-1).split("/").slice(0,-1).join("/")||o;break;default:if("/"!=t[0]&&(t=r+t),t+"/"in s&&(t+="/"),!(t in s))return"Error! No such directory exists"}return e.text(s[t].map((e=>e.replace(r,""))).join("\n")),0},cd:l,cat:function(e){if(!e)return"Error! Please specify a file";let t="/"==e[0];return e.includes("/")&&(t&&l(),e.split("/").filter((e=>e)).slice(0,-1).forEach((e=>l(e))),e=e.split("/").pop()),s[r].includes(r+e)?(window.location.href=r+e,0):`Error! "${e}": No such file exists`},clear:a,help:function(t){if(t in i)e.text(i[t]);else{let n="";for(t in i)n+=t+"\n"+i[t]+"\n";e.text(n)}}};function u(e){e.preventDefault();let t=$("#cli"),r=t.val(),s="";if(""==r)return;a();let[i,o]=[...r.split(" ")];t.val(""),s=i in c?c[i](o):`Error! "${i}": No such command exists.\nRun 'help' to know more`,s&&n.text(s)}document.addEventListener("DOMContentLoaded",(function(){e=$("#terminal-output"),t=$("#prompt"),n=$("#terminal-error"),$("#cli-form").submit(u),$("#cli").focus()}));