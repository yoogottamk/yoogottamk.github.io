---
layout: post
blogTitle: Editing in vim from anywhere*
blogImage: edit-vim.webp
tags:
 - vim
 - automation
 - X11
---

I love vim. Once you start using it (properly), you want it everywhere. The modal editing is...

...wait, I don't need to sell vim to you, you came here because you already know how great it is!

<h2 class="section-header pt-4">(*)</h2>
This _should_ work if you are using X11.

{% include post-heading.html header="How" %}

What would you do if you wanted shift what you were typing to vim?

This is what comes to mind:
1. Copy the text
2. Open vim and paste it there
3. Edit
4. Copy it to the system clipboard
5. Paste

Hmmm. Only if I could automate this...

<h2 class="section-header pt-4">Enter xdotool</h2>
<blockquote class="blockquote">
<a href="https://www.semicomplete.com/projects/xdotool/" target="_blank" rel="noopener">What is xdotool?</a><br>
This tool lets you simulate keyboard input and mouse activity, move and resize windows, etc. It does this using X11’s XTEST extension and other Xlib functions.
<br>
</blockquote>

<h2 class="section-header pt-4">Requirements</h2>
 - xdotool: for simulating copy/paste actions
 - xclip: for getting/setting clipboard content

{% include post-heading.html header="Code" %}

```shell
#!/bin/bash

# you can set this to the one you use
TERMINAL=uxterm

file=`mktemp`

# a small delay is usually required when dealing with xdotool
sleep 0.5s

# copy whatever was selected
xdotool key ctrl+c

# put clipboard contents inside a file
xclip -selection clipboard -o > $file
# open preferred text editor (vim!)
"$TERMINAL" -e "$EDITOR $file"
# when done with editing, copy contents to clipboard
xclip -selection clipboard -i < $file

sleep 0.1s

# replace the selection which was just copied
xdotool key ctrl+v

rm $file
```

<h2 class="section-header pt-4">How to use</h2>
1. Save this file somewhere and make sure it can be executed (`chmod +x`)
2. If not already present, <a href="https://yoogottamk.github.io/blog/managing-path" target="_blank" rel="noopener">add the directory to `PATH`</a> (not exactly a necessity but now it's easier to run it manually too)
3. Make this accessible by a keyboard shortcut. (e.g. <a href="https://askubuntu.com/a/525495" target="_blank" rel="noopener">for ubuntu</a>)
4. Enjoy

Now, whenever I want to edit something in vim, I select the desired portion and press the hotkey and voila, my text is in vim! Edit, save and close, and the original text gets replaced by this!

<h2 class="section-header pt-4">i3 users</h2>
A bindsym will do the job. You might want to use a terminal which you don't use regularly and make it a floating window.

Here's what I did (i3conf):
```
bindsym $mod+q exec vimedit
for_window [class="UXTerm"] floating enable
```

This made the script available to me with `super+q`. I don't have to specify the whole path to the file since I update `PATH` before loading i3.

{% include post-heading.html header="Demo" %}
<div align="center" class="embed-responsive embed-responsive-16by9">
  <video controls class="embed-responsive-item">
    <source src="{{ '/assets/videos/posts/vim-edit.mp4' | relative_url }}" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

{% include post-heading.html header="" %}
This, along with various other cool stuff can be found in my <a href="https://github.com/yoogottamk/dotfiles" target="_blank" rel="noopener">dotfiles</a> repo.

So, did you like it? Did I miss something? Did I do something in the wrong way? Please comment below and improve my knowledge!
