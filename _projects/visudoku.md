---
layout: project
projectTitle: ViSudoku
projectImage: projects/visudoku/Original.webp
tags:
 - opencv
 - ml
 - sudoku
 - python
 - cpp
date: 2019-12-25
---

Takes an image of a sudoku puzzle as input and solves it. Uses <a href="https://opencv.org/" target="_blank" rel="noopener">OpenCV</a> and <a href="https://scikit-learn.org/" target="_blank" rel="noopener">scikit-learn</a>.

<div class="py-4"></div>
{% include post-heading.html header="Overview" nodots="true" %}
Here is a basic outline of how this algorithm works
<ul>
  <li>Once I get the image, the largest 'box' is assumed to be the sudoku puzzle.</li>
  <li>The box is then extracted from the image and 'flattened'.</li>
  <li>Now that we have the puzzle, we need to get the individual digits. For this, I 'reinforce' the grid by drawing more lines above it. I also add the bounding box seperately. This was done to 'strongly' divide to seperate out the individual digits.</li>
  <li>The next step is to extract all the 'boxes' in the image. The largest 82 are picked. The largest one is the whole box and the next 81 are the individual boxes.</li>
  <li>Now that we have each digit, it is necessary to have them in the correct order to reconstruct the puzzle. For this, I use the central coordinates to arrange them back in place.</li>
  <li>Now, I use a <a href="https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html">knn classifier</a> to recognize each digit (with near perfect accuracy)</li>
  <li>The only thing left is to solve this puzzle, which can be done by recursion.</li>
  <li>It has been packaged as a docker image with a UI</li>
  <li>The solution is cached so, if the same image is given, it runs much faster</li>
</ul>

{% include post-heading.html header="Image(s)" %}
<div id="displayImages" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner">
  {% for img in site.data.projects.visudoku["images"] %}
    <div class="carousel-item {% if forloop.first %} active {% endif %}">
      <img class="d-block mx-auto" src="{{ '/assets/images/projects/' | append: img | relative_url }}" alt="" height="600px">
    </div>
  {% endfor %}
  </div>
  <a class="carousel-control-prev" href="#displayImages" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#displayImages" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>

{% include post-heading.html header="Demo" %}
<div align="center" class="embed-responsive embed-responsive-16by9">
  <video controls class="embed-responsive-item">
    <source src="{{ '/assets/videos/projects/visudoku.mp4' | relative_url }}" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

{% include post-heading.html header="Code" %}
This code, along with the printed digit training data can be found on github, at <a href="https://github.com/yoogottamk/visudoku" target="_blank" rel="noopener">yoogottamk/visudoku</a>.
