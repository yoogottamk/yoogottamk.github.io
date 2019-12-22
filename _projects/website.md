---
layout: project
projectTitle: website
projectImage: notfound.png
tags:
 - jekyll
 - html
 - js
 - css
 - bootstrap
date: 2019-12-21
---

This website (+blog) was built using <a href="https://jekyllrb.com/" rel="noopener" target="_blank">jekyll</a>. The theme was created from scratch. I also used <a href="https://getbootstrap.com/" rel="noopener" target="_blank">bootstrap</a>. I tried to follow best practices everywhere and ended up using almost all of jekyll's features.

<div class="py-4"></div>
{% include post-heading.html header="Highlights" nodots="true" %}
<ul>
  <li>The first thing that strikes you in the <a href="{{ '/' | relative_url }}" target="_blank">homepage</a> is the terminal emulator. It supports some commands like <kbd>ls</kbd>, <kbd>cd</kbd>, etc. I liked the idea of navigating a website like any other directory on your computer and implemented it.</li>
  <li>Extra time was spent on the <a href="{{ '/oops' | relative_url }}" target="_blank">special 404 page</a>, which lists the urls available on the website (generated using jekyll) in increasing order of edit distances, so that you can reach the page you intended to go without having to change the url.</li>
  <li>The <a href="{{ '/blog' | relative_url }}" target="_blank">blog</a> and <a href="{{ '/projects' | relative_url }}" target="_blank">projects</a> pages provide a search functionality, with which you can search by title, tags <em>and even content!</em></li>
  <li>The content being served to you is minified, using a custom github pages deployment, using <a href="https://gulpjs.com/" rel="noopener" target="_blank">gulp</a>.</li>
</ul>

{% include post-heading.html header="Image(s)" %}
<div id="displayImages" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner">
  {% for img in site.data.website["images"] %}
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
This website's code, along with the gulp setup can be found on github, at <a href="https://github.com/yoogottamk/yoogottamk.github.io" target="_blank" rel="noopener">yoogottamk/yoogottamk.github.io</a>.
