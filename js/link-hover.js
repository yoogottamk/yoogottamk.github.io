$("document").ready(() => {
  document.querySelectorAll("a").forEach((el) => {
    // only show previews for stuff opening in new page
    // an okayish heuristic for the previews I dont want to have
    if (el.getAttribute("target") != "_blank") return;

    fetch(`https://url2og.herokuapp.com/api/v1/${encodeURIComponent(el.href)}`)
      .then((resp) => resp.json())
      .then((data) => {
        let { title, image } = data;
        if (title && image) {
          el.setAttribute("data-link-title", title);
          el.setAttribute("data-link-image", image);
        }
      }).catch((_err) => {});

    el.addEventListener("mouseover", () => {
      let offset = el.getBoundingClientRect().left;
      if (el.getAttribute("data-preview-inserted") == "true") {
        let preview = el.querySelector(".link-preview");
        preview.style.display = "block";
        preview.style.left = `${offset}px`;
        return;
      }

      let title = el.getAttribute("data-link-title"),
        image = el.getAttribute("data-link-image");
      if (!title || !image) return;

      let html = `
        <div class="row link-preview" style="left: ${offset}px">
          <img src="${image}">
          <p>${title}</p>
        </div>
      `;
      el.insertAdjacentHTML("beforeend", html);
      el.setAttribute("data-preview-inserted", "true");
    });

    el.addEventListener("mouseout", () => {
      el.querySelector(".link-preview").style.display = "none";
    });
  });
});
