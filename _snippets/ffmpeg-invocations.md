---
layout: snippet
snippetTitle: ffmpeg invocations
tags:
 - ffmpeg
date: 2021-09-16
---

Here's a list of ffmpeg filters/commands I use often but still can't recall from memory. I'll try to include the original source wherever I can find it. Since the original sources do a great job at explaining the options, I'm not going to repeat them here.

{% include post-heading.html %}

## Index
<ul>
{% for invocation in site.data.snippets.ffmpeg-invocations %}
  <li><a href="#{{ invocation.title | slugify }}">{{ invocation.title }}</a></li>
{% endfor %}
</ul>

{% include post-heading.html %}

{% for invocation in site.data.snippets.ffmpeg-invocations %}
  <h3 id="{{ invocation.title | slugify }}">{{ invocation.title }} <a href="{{ invocation.source }}" rel="noopener" target="_blank">[source]</a></h3>
  {% if invocation.comments %}
  {{ invocation.comments }}
  {% endif %}
  {% include copy-code.html %}
  ```sh
  {{ invocation.command }}
  ```
  <div class="py-4"></div>
{% endfor %}
