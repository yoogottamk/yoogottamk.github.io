---
layout: post
blogTitle: How I manage PATH
blogImage: 404.jpg
tags:
 - PATH
 - GNU/Linux
---

<h1 class="section-header">Introduction</h1>
i use arch btw. Now that we have established that, lets see what the `PATH` variable is.

According to <a href="http://www.linfo.org/path_env_var.html">linfo</a>,
<blockquote class="blockquote"><code>PATH</code> is an environmental variable in Linux and other Unix-like operating systems that tells the shell which directories to search for executable files (i.e., ready-to-run programs) in response to commands issued by a user. It increases both the convenience and the safety of such operating systems and is widely considered to be the single most important environmental variable.</blockquote>

<div class="py-4"></div>

What that roughly means is that whenever you type in a command, the shell searches for that name in all the directories present in the <code>PATH</code> variable. The <code>PATH</code> variable looks something like this:

```shell
$ echo $PATH
/usr/bin:/usr/sbin:/some/other/dir:...
```

It is a list of directories separated by \``:`\`. The shell searches for the executable in each directory and ends the search as soon as it finds a file with the same name. *That also means that the order of directories in `PATH` matters.*

{% include divide.html %}

<h1 class="section-header">The usual method</h1>
The "standard" way of setting the `PATH`, as seen in the top search result on <a href="https://superuser.com/a/488175">superuser</a> is this:
```shell
$ export PATH=$PATH:/your/new/path/here
```

Now, this works fine when you only need to add a few directories to `PATH`, and you always do that in a single file at the same place. However, the most common pattern I have seen is:
```shell
...
export PATH=$PATH:/your/new/path/here
...
export PATH=$PATH:/another/new/path/here:/oh/and/a/second/too
...
export PATH=$PATH:/here/we/go/again
...
```

This is bad practice. Updating the variable to remove a directory can be messy, and what if you want to give preference to a directory for an executable? You'll have to change the order in which they are added to `PATH`. Doing it when your `PATH` updates are scattered all over the place doesn't look easy, right?

Even if you do this in a single line, it can be a little overwhelming sometimes:
```shell
export PATH=$PATH:/your/new/path/here:/another/new/path/here:/oh/and/a/second/too:/here/we/go/again:...
```

{% include divide.html %}

<h1 class="section-header">What I do</h1>
I keep all my `PATH` updates in a single file and source that file in `~/.profile`.

That file looks like this:
```shell
#!/bin/bash

path_dirs=(
    "$HOME/bin"
    "$HOME/.some-dir"
    "$HOME/.local/bin"
    "$HOME/projects/some-project"
    "$HOME/projects/another-one"
    "/usr/local/android-studio/bin"
    "$HOME/flutter/bin"
    "$HOME/.cargo/bin"
    ...
)

appended_path=$(IFS=":$IFS"; printf "%s" "${path_dirs[*]}")

export PATH="$PATH:$appended_path"
```

Explanation:
