---
---

const allSnippets = [
{% for snippet in site.snippets %}
    {
        "id": "{{ snippet.id | strip_newlines | escape }}",
        "tags": [
        {% for tag in snippet.tags %}
            "{{ tag }}",
        {% endfor %}
        ],
        "title": "{{ snippet.snippetTitle | strip_newlines | escape }}",
    },
{% endfor %}
];

function isRelevant(snippet, query) {
    return (
        snippet.title.toLowerCase().includes(query) ||
        snippet.tags.join("|").toLowerCase().includes(query)
    );
}

function getRelevantSnippets(query) {
    let relevantSnippets = [];

    allSnippets.forEach(snippet => {
        if(isRelevant(snippet, query))
            relevantSnippets.push(snippet.id);
    });

    return relevantSnippets;
}

function init() {
    let $searchBar = $("#searchBar");

    $searchBar.on("input propertychange", function() {
        let query = $searchBar.val().toLowerCase(),
            $parent = $("div.snippets"),
            $notFound = $("#not-found");

        $notFound.html("");
        $parent.children().each(function() {
            $(this).css({ "display": "flex" });
        });

        if(!query.length) {
            return;
        }

        let relevantSnippets = getRelevantSnippets(query);

        if(!relevantSnippets.length) {
            $notFound.html("I haven't worked on this (yet)!");
        }

        $parent.children().each(function() {
            if(!relevantSnippets.includes($(this).attr("id")))
                $(this).css({ "display": "none" });
        });
    });
}

document.addEventListener("DOMContentLoaded", init);
