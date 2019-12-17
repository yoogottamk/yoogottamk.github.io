---
---

const knownPageList = [
    {% for page in site.html_pages %}
        "{{ page.url | relative_url }}",
    {% endfor %}
    {% for collection in site.collections %}
        {% for page in site[collection.label] %}
            "{{ page.url | relative_url }}",
        {% endfor %}
    {% endfor %}
],
    url = window.location.pathname;

function editDistance(existing, requested) {
    // 2d matrix of required dimensions
    const dist = Array(existing.length + 1).fill(null).map(() => Array(requested.length + 1).fill(null));

    for(let i = 0; i <= existing.length; i++)
        dist[i][0] = i;

    for(let i = 0; i <= requested.length; i++)
        dist[0][i] = i;

    for(let i = 1; i <= existing.length; i++) {
        for(let j = 1; j <= requested.length; j++) {
            dist[i][j] = Math.min(
                dist[i - 1][j] + 1,
                dist[i][j - 1] + 1,
                dist[i - 1][j - 1] + !(existing[i - 1] == requested[j - 1])
            );
        }
    }

    return dist[existing.length][requested.length];
}

function init() {
    let $list = $("#page-list");
    $list.html("");

    knownPageList.splice(knownPageList.indexOf("{{ '/404.html' | relative_url }}"), 1);

    pageEditDistance = [];
    knownPageList.forEach(page => pageEditDistance.push({ "dist": editDistance(url, page), "page": page }));

    pageEditDistance.sort((a, b) => a.dist - b.dist).slice(0, 10);

    pageEditDistance.forEach(page => 
        $list.append(`<li>[${page.dist}] &nbsp;&nbsp;&nbsp; <a href="${page.page}">${page.page}</a></li>`)
    );
}

document.addEventListener("DOMContentLoaded", init);
