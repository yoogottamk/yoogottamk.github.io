---
---

const allProjects = [
    {% for project in site.projects %}
    {
        "id": "{{ project.id | strip_newlines | escape }}",
        "tags": [
            {% for tag in project.tags %}
                "{{ tag }}",
            {% endfor %}
        ],
        "title": "{{ project.projectTitle | strip_newlines | escape }}",
        "content": "{{ project.content | normalize_whitespace | strip_html | strip_newlines | escape }}"
    },
    {% endfor %}
];

function isRelevant(project, query) {
    return (
        project.title.toLowerCase().includes(query) ||
        project.content.toLowerCase().includes(query) ||
        project.tags.join("|").toLowerCase().includes(query)
    );
}

function getRelevantProjects(query) {
    let relevantProjects = [];

    allProjects.forEach(project => {
        if (isRelevant(project, query))
            relevantProjects.push(project.id);
    });

    return relevantProjects;
}

function filterProjects() {
    let $searchBar = $("#searchBar"),
        query = $searchBar.val().toLowerCase(),
        $parent = $("div.projects"),
        $notFound = $("#not-found");

    history.replaceState(null, '', `?q=${query}`)

    $notFound.html("");
    $parent.children().each(function () {
        $(this).css({"display": "flex"});
    });

    if (!query.length) {
        return;
    }

    let relevantProjects = getRelevantProjects(query);

    if (!relevantProjects.length) {
        $notFound.html("I haven't worked on this (yet)!");
    }

    $parent.children().each(function () {
        if (!relevantProjects.includes($(this).attr("id")))
            $(this).css({"display": "none"});
    });
}

function init() {
    let $searchBar = $("#searchBar"),
        searchParams = new URLSearchParams(window.location.search),
        urlQuery = searchParams.get("q");

    if (searchParams.has("q")) {
        $searchBar.val(urlQuery);
        filterProjects();
    }
    $searchBar.on("input propertychange", filterProjects);
}

document.addEventListener("DOMContentLoaded", init);
