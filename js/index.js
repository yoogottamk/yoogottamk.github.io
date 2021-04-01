---
---

let $output,
    $prompt,
    $error,
    cwd = "{{ '/' | relative_url }}";

const routes = {
    "{{ '/' | relative_url }}": [
        {% for url in site.data.navigation %}
            "{{ url.url | relative_url }}",
        {% endfor %}
    ],
    "{{ '/about/' | relative_url }}": [],
    "{{ '/blog/' | relative_url }}": [
        {% for page in site.posts %}
            "{{ page.url | relative_url }}",
        {% endfor %}
    ],
    "{{ '/projects/' | relative_url }}": [
        {% for page in site.projects %}
            "{{ page.url | relative_url }}",
        {% endfor %}
    ],
    "{{ '/snippets/' | relative_url }}": [
        {% for page in site.snippets %}
            "{{ page.url | relative_url }}",
        {% endfor %}
    ],
}, helpStrings = {
    "ls": "Usage: ls [dir]\nList the files in a directory\nDefaults to current directory\nTakes absolute and relative paths\n",
    "cd": "Usage: cd [dir]\nChange the current directory to dir\nDefaults to root directory\nTakes absolute and relative paths\n",
    "cat": "Usage: cat file\nView a page on this website\nTakes absolute and relative paths\n",
    "clear": "Usage: clear\nClears the screen\n",
    "help": "Usage: help [cmd]\nDisplay help on cmd or show help for all commands\n",
},
    root = cwd;

function ls(dir) {
    if(!dir) dir = cwd;

    switch(dir) {
        case ".":
            dir = cwd;
            break;
        case "..":
            dir = cwd.slice(0, -1).split("/").slice(0, -1).join("/") || root;
            break;
        default:
            // relative or absolute?
            if(dir[0] != "/")
                dir = cwd + dir;

            // allow for the trailing '/'
            if((dir + "/") in routes)
                dir = dir + "/";

            if(!(dir in routes))
                return "Error! No such directory exists";
    }

    $output.text(routes[dir].map(x => x.replace(cwd, '')).join("\n"));

    return 0;
}

function cd(dir) {
    // empty => home
    if(!dir) dir = root;

    switch(dir) {
        case ".":
            dir = cwd;
            break;
        case "..":
            dir = cwd.slice(0, -1).split("/").slice(0, -1).join("/") || root;
            break;
        default:
            // handle relative parts
            // dir != ".." since handled above
            if(dir.startsWith("..")) {
                cd("..");
                return cd(dir.slice(3)); // remove "../"
            }

            // remove './' if there
            if(dir.startsWith("./")) {
                while(dir.startsWith("./"))
                    dir = dir.slice(2);

                return cd(dir);
            }

            // relative or absolute?
            if(dir[0] != "/")
                dir = cwd + dir;

            // allow for the trailing '/'
            if((dir + "/") in routes)
                dir = dir + "/";

            if(!(dir in routes))
                return `Error! "${dir}": No such directory exists`;
    }

    if(dir.length < root.length)
        dir = root;

    cwd = dir;

    // if cwd doesn't have any pages under it, goto that page!
    if(!routes[cwd].length)
        window.location.href = cwd;

    $prompt.text(cwd);

    return 0;
}

function cat(file) {
    if(!file) return "Error! Please specify a file";

    let isAbsolutePath = file[0] == "/";

    // it's a path!
    if(file.includes("/")) {
        if(isAbsolutePath) cd();

        // remove last element since it is the file
        file.split("/").filter(x => x).slice(0, -1).forEach(dir => cd(dir));

        file = file.split("/").pop();
    }

    if(routes[cwd].includes(cwd + file))
        window.location.href = cwd + file;
    else
        return `Error! "${file}": No such file exists`;

    // not reqd since href changes and it gets cleared, but anyways
    return 0;
}

function help(cmd) {
    if(cmd in helpStrings) {
        $output.text(helpStrings[cmd]);
    } else {
        let output = "";
        for(cmd in helpStrings)
            output += cmd + "\n" + helpStrings[cmd] + "\n";
        $output.text(output);
    }
}

function clear() {
    $output.text("");
    $error.text("");
}

const functionMap = {
    "ls": ls,
    "cd": cd,
    "cat": cat,
    "clear": clear,
    "help": help,
};

function handleCommand(e) {
    e.preventDefault();

    let $cli = $("#cli"),
        text = $cli.val(),
        err = "";

    if(text == "") return;

    clear();

    let [cmd, arg] = [...text.split(" ")];

    $cli.val("");

    if(cmd in functionMap)
        err = functionMap[cmd](arg);
    else
        err = `Error! "${cmd}": No such command exists.\nRun 'help' to know more`;

    if(err) {
        $error.text(err);
    }
}

function init() {
    $output = $("#terminal-output");
    $prompt = $("#prompt");
    $error = $("#terminal-error");

    $("#cli-form").submit(handleCommand);

    $("#cli").focus();
}

document.addEventListener("DOMContentLoaded", init);
