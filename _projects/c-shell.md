---
layout: project
projectTitle: ysh
projectImage: ysh.webp
tags:
 - shell
 - c
date: 2019-12-08
---

This is a shell completely written in C which supports background / foreground jobs, semicolon list of commands, input / output redirection, piping, escaping within quotes(both double and single) and handles some signals like SIGINT(\<C-c\>) and SIGTSTP(\<C-z\>).

<div class="py-4"></div>
{% include post-heading.html header="Features" nodots="true" %}

<h4>The following shell builtins were implemented:</h4>
<ul>
  {% for builtin in site.data.c-shell["builtins"] %}
    <li><kbd>{{ builtin.name }}</kbd> {{ builtin.desc }}</li>
  {% endfor %}
</ul>
Any external command was executed using the `exec` syscall

<h4>The following features were implemented:</h4>
<ul>
  {% for feature in site.data.c-shell["features"] %}
    <li>{{ feature }}</li>
  {% endfor %}
</ul>

{% include post-heading.html header="Image(s)" %}
<div id="displayImages" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner">
  {% for img in site.data.projects.c-shell["images"] %}
    <div class="carousel-item {% if forloop.first %} active {% endif %}">
      <img class="d-block mx-auto" src="{{ '/assets/images/' | append: img | relative_url }}" alt="" height="600px">
    </div>
  {% endfor %}
  </div>
  <a class="carousel-control-prev" href="#displayImages" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#displayImages" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>

{% include post-heading.html header="Code" %}
The code, along with instructions to build and use it can be found on github, at <a href="https://github.com/yoogottamk/ysh" target="_blank" rel="noopener">yoogottamk/ysh</a>.
