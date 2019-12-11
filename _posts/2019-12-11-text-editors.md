---
layout: post
blogTitle: Text editors
blogImage: editor.webp
tags:
 - editors
 - vim
 - atom
 - vscode
 - sublime
 - emacs
---

A text editor is a program that lets you edit text. There are a LOT OF text editors out there and choosing among them can be a difficult task.

People usually choose the one which they see others using. Some go ahead and try various of them before settling on one [I am one of those people], and, even after settling on one, they keep a lookout for new, helpful features in other editors.

{% include post-heading.html header="My history" %}

I love vim. I have been using it as my primary text editor (for programming and all other purposes) since 2016. Some other text editors which I have used (and still do if something unique to that editor comes up) are:
<ul>
  {% for editor in site.data['2019-12-11-text-editors'].editors %}
    <li><a href="{{ editor.link }}">{{ editor.name }}</a></li>
  {% endfor %}
  <li>Some more that I don't remember now</li>
</ul>

{% include post-heading.html header="My experiences" %}

Before settling on vim, I used Notepad++, Atom, Sublime Text and VS Code as my primary text editor for a long time. I used to switch between them a lot, trying to find the perfect one. Here is what I think about them:

<hr class="w-75 my-5" style="background-color: gray; height: 1px; border: 0;">
{% for editor in site.data['2019-12-11-text-editors'].comparison %}
  <h2>{{ editor.name }}</h2>
  {{ editor.desc }}

  <h5>Things that I like about it:</h5>
  <ul>
    {% for good in editor.good %}
      <li>{{ good }}</li>
    {% endfor %}
  </ul>

  <h5>Why I moved on:</h5>
  {{ editor.bad }}

  <hr class="w-75 my-5" style="background-color: gray; height: 1px; border: 0;">
{% endfor %}

{% include post-heading.html %}

This is my view of a few editors. Do you have something more to add? Please comment below!
