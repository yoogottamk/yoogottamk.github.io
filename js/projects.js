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
        "content": "{{ project.content | strip_newlines | escape }}"
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
        if(isRelevant(project, query))
            relevantProjects.push(project.id);
    });

    return relevantProjects;
}

function init() {
    let $searchBar = $("#searchBar");

    $searchBar.on("input propertychange", function() {
        let query = $searchBar.val(),
            $parent = $("div.projects"),
            $notFound = $("#not-found");

        $notFound.html("");
        $parent.children().each(function() {
            $(this).css({ "display": "flex" });
        });

        if(!query.length) {
            return;
        }

        let relevantProjects = getRelevantProjects(query);

        if(!relevantProjects.length) {
            $notFound.html("I haven't worked on this (yet)!");
        }

        $parent.children().each(function() {
            if(!relevantProjects.includes($(this).attr("id")))
                $(this).css({ "display": "none" });
        });
    });
}

document.addEventListener("DOMContentLoaded", init);
