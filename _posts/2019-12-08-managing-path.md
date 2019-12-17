---
layout: post
blogTitle: How I manage PATH
blogImage: path.webp
tags:
 - PATH
 - GNU/Linux
credits:
  - ["unsplash", "https://unsplash.com/"]
---

i use arch btw. Now that we have established that, lets see what the `PATH` variable is and how it works.

According to <a href="http://www.linfo.org/path_env_var.html" target="_blank">linfo</a>,
<blockquote class="blockquote"><code>PATH</code> is an environmental variable in Linux and other Unix-like operating systems that tells the shell which directories to search for executable files (i.e., ready-to-run programs) in response to commands issued by a user. It increases both the convenience and the safety of such operating systems and is widely considered to be the single most important environmental variable.</blockquote>

<div class="py-4"></div>

What that roughly means is that whenever you type in a command, the shell searches for that name in all the directories present in the <code>PATH</code> variable. The <code>PATH</code> variable looks something like this:

```shell
$ echo $PATH
/usr/bin:/usr/sbin:/some/other/dir:...
```

It is a list of directories separated by \``:`\`. The shell searches for the executable in each directory and ends the search as soon as it finds a file with the same name. *That also means that the order of directories in `PATH` matters.*

{% include post-heading.html header="The usual method" %}

The "standard" way of setting the `PATH`, as seen in the top search result on <a href="https://superuser.com/a/488175" target="_blank">superuser</a> is this:
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

This is bad. Updating the variable to remove a directory can be time consuming, and what if you want to give preference to a directory for an executable? You'll have to change the order in which they are added to `PATH`. Doing it when your `PATH` updates are scattered all over the place doesn't make it easy.

Even if you write all the directories in a single line, it get a little too long to handle sometimes:
```shell
export PATH=$PATH:/your/new/path/here:/another/new/path/here:/oh/and/a/second/too:/here/we/go/again:...
```

{% include post-heading.html header="What I do" %}

I keep all my `PATH` updates in a single file and source that file in `~/.profile`.

That file looks like this:
```shell
#!/bin/bash

# directories which get prepended
prepend_dirs=(
    "$HOME/bin"
    "$HOME/projects/some-project"
    "$HOME/projects/another-one"
    ...
)

# directories which get appended
append_dirs=(
    "$HOME/.some-dir"
    "$HOME/.local/bin"
    "/usr/local/android-studio/bin"
    "$HOME/flutter/bin"
    "$HOME/.cargo/bin"
    ...
)

# generate the strings
prepend_path=$(IFS=":"; echo "${prepend_dirs[*]}")
append_path=$(IFS=":"; echo "${append_dirs[*]}")

# wth is this?!
export PATH="${prepend_path:+${prepend_path}:}$PATH${append_path:+:${append_path}}"
```

<h2 class="section-header pt-4">Explanation</h2>
I maintain two arrays: one for prepending and one for appending.

I generate the string (`prepend_path, append_path`) which gets added to `PATH`. This does not pollute your `IFS`, since the whole command is ran in a subshell. Also, printing `${array[*]}` expands to all elements separated by the first character of `IFS`, which currently is \``:`\`.

The last line is special. It could simply have been

```shell
export PATH="$prepend_path:$PATH:$append_path"
```

Although, a problem might arise when either `prepend_path` or `append_path` is empty. The final `PATH` might end up looking like this: `:/usr/bin:/usr/sbin:...:/home/user/bin:`.

Solution: bash array parameter expansion
<blockquote class="blockquote">
<a href="https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html" target="_blank">${parameter:+word}</a>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;If parameter is null or unset, nothing is substituted, otherwise the expansion of word is substituted.
</blockquote>

So, if either of them are empty, the corresponding \``:`\` won't be added. Cool!

This way, you can easily add/remove directories from `PATH` and easily manage the order too.

{% include post-heading.html header="" %}
This file, along with various other config files can be found in my <a href="https://github.com/yoogottamk/dotfiles" target="_blank">dotfiles</a> repo.

So, did you like it? Did I miss something? Did I do something in the wrong way? Please comment below and improve my knowledge!
