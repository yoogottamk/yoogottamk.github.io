$("document").ready(() => {
  document.querySelectorAll("a").forEach((el) => {
    // only show previews for stuff opening in new page
    // an okayish heuristic for the previews I dont want to have
    if (el.getAttribute("target") != "_blank") return;

    fetch(`https://url2og.herokuapp.com/api/v1/${encodeURIComponent(el.href)}`)
      .then((resp) => resp.json())
      .then((data) => {
        let { title, image } = data;
        let html = '<div class="row link-preview" style="display: none">';
        if (image) {
          html += `<img src="${image}">`;
        }
        if (title) {
          html += `<p style="text-align: center">${title}</p>`;
        }
        html += "</div>";
        el.insertAdjacentHTML("beforeend", html);
      }).catch((_err) => {});

    el.addEventListener("mouseover", () => {
      let offset = el.getBoundingClientRect().left;
      let preview = el.querySelector(".link-preview");
      preview.style.display = "block";
      preview.style.left = `${offset}px`;
    });

    el.addEventListener("mouseout", () => {
      el.querySelector(".link-preview").style.display = "none";
    });
  });
});
