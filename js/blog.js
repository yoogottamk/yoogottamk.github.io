---
---

const allBlogs = [
{% for blog in site.posts %}
    {
        "id": "{{ blog.id | strip_newlines | escape }}",
        "tags": [
        {% for tag in blog.tags %}
            "{{ tag }}",
        {% endfor %}
        ],
        "title": "{{ blog.blogTitle | strip_newlines | escape }}",
        "content": "{{ blog.content | strip_newlines | escape }}"
    },
{% endfor %}
];

function isRelevant(blog, query) {
    return (
        blog.title.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query) ||
        blog.tags.join("|").toLowerCase().includes(query)
    );
}

function getRelevantBlogs(query) {
    let relevantBlogs = [];

    allBlogs.forEach(blog => {
        if(isRelevant(blog, query))
            relevantBlogs.push(blog.id);
    });

    return relevantBlogs;
}

function init() {
    let $searchBar = $("#searchBar");

    $searchBar.on("input propertychange", function() {
        let query = $searchBar.val().toLowerCase(),
            $parent = $("div.posts"),
            $notFound = $("#not-found");

        $notFound.html("");
        $parent.children().each(function() {
            $(this).css({ "display": "flex" });
        });

        if(!query.length) {
            return;
        }

        let relevantBlogs = getRelevantBlogs(query);

        if(!relevantBlogs.length) {
            $notFound.html("No such post has been written (yet)!");
        }

        $parent.children().each(function() {
            if(!relevantBlogs.includes($(this).attr("id")))
                $(this).css({ "display": "none" });
        });
    });
}

document.addEventListener("DOMContentLoaded", init);
