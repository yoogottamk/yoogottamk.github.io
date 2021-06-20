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
        "content": "{{ blog.content | normalize_whitespace | strip_html | strip_newlines | escape }}"
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
        if (isRelevant(blog, query))
            relevantBlogs.push(blog.id);
    });

    return relevantBlogs;
}

function filterPosts() {
    let $searchBar = $("#searchBar"),
        query = $searchBar.val().toLowerCase(),
        $parent = $("div.posts"),
        $notFound = $("#not-found");

    history.replaceState(null, '', `?q=${query}`)

    $notFound.html("");
    $parent.children().each(function () {
        $(this).css({"display": "flex"});
    });

    if (!query.length) {
        return;
    }

    let relevantBlogs = getRelevantBlogs(query);

    if (!relevantBlogs.length) {
        $notFound.html("No such post has been written (yet)!");
    }

    $parent.children().each(function () {
        if (!relevantBlogs.includes($(this).attr("id")))
            $(this).css({"display": "none"});
    });
}

function init() {
    let $searchBar = $("#searchBar"),
        searchParams = new URLSearchParams(window.location.search),
        urlQuery = searchParams.get("q");

    if (searchParams.has("q")) {
        $searchBar.val(urlQuery);
        filterPosts();
    }
    $searchBar.on("input propertychange", filterPosts);
}

document.addEventListener("DOMContentLoaded", init);
