---
layout: snippet
snippetTitle: Jupyter imshow
tags:
 - opencv
 - python
 - jupyter
 - matplotlib
date: 2021-03-29
---

## Imports
{% include copy-code.html %}
```python
import matplotlib.pyplot as plt
import cv2 as cv
import numpy as np
```

## Code
{% include copy-code.html %}
```python
def imshow(img, ax=None, vmin=None, vmax=None, figsize=(7, 7), external=False, title=""):
    if external:
        cv.imshow("imshow", img)
        
        while 1:
            if cv.waitKey(0) & 0xFF == ord("q"):
                break
        
        cv.destroyAllWindows()
        return
    
    gray = False

    if len(img.shape) == 2:
        gray = True
    if img.shape == 3 and img.shape[-1] == 1:
        gray = True

    # trying to remove as much as possible
    if ax is None:
        _, ax = plt.subplots(figsize=figsize)
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    ax.set_title(title)
    ax.autoscale(tight=True)
    
    if gray:
        ax.imshow(img, cmap="gray", vmin=vmin, vmax=vmax)
    else:
        ax.imshow(img[:, :, ::-1], vmin=vmin, vmax=vmax)
```
