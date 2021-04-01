---
layout: snippet
snippetTitle: FDDB Loader
tags:
 - python
 - fddb
 - dataset-loader
date: 2021-04-01
---

## Imports
{% include copy-code.html %}
```python
from glob import glob
from itertools import combinations
from random import shuffle

import cv2 as cv
import numpy as np
```

## Code
{% include copy-code.html %}
```python
class FDDBLoader:
    """
    FDDB Dataset Loader

    Setup:
        Download the images      [http://vis-www.cs.umass.edu/fddb/originalPics.tar.gz]
                 and annotations [http://vis-www.cs.umass.edu/fddb/FDDB-folds.tgz]
        and extract them in `../dataset`

        It should look like this:
            ```
            ../dataset
            ├── 2002
            ├── 2003
            └── FDDB-folds
            ```

    Usage:
        Defaults are good enough.
        for configuration options, read doc for the constructor

            ```
            fddb = FDDBLoader(n_samples=10)
            for face in fddb.load():
                ...
            ```
    """

    def __init__(
        self,
        allow_occluding=False,
        n_samples=1000,
        return_grayscale=True,
        random_samples=True,
    ):
        """
        Args:
            allow_occluding: should overlapping faces be returned?
            n_samples: number of faces which are needed
            return_grayscale: should returned face be grayscale?
            random_samples: should this return the faces in (semi-)random order?
        """
        self.n_samples = n_samples
        self.imread_mode = 0 if return_grayscale else 1
        self.allow_occluding = allow_occluding
        self.annotation_files = glob(
            "../dataset/FDDB-folds/FDDB-fold-*-ellipseList.txt"
        )
        self.returned_faces = 0

        if random_samples:
            shuffle(self.annotation_files)

    @staticmethod
    def elliptical2rect(centre, axes, angle):
        """
        Converts elliptical parameters to a rectangular bounding box

        TODO: Since this doesn't know about image bounds, its possible
                that this returns coordinates that are outside the image.
                I haven't faced this issue so far though

        Args:
            centre: (cx, cy)
            axes: (a, b) # aligned to x and y. not major/minor
            angle: rotation angle (as present in the FDDB annotations)

        Returns:
            (x, y, w, h): top left coords and size of bounding box
        """
        cx, cy = centre
        a, b = axes

        cos_angle = np.cos(np.deg2rad(angle))

        vertical_component = a * cos_angle
        horizontal_component = b * cos_angle

        tl_y = max(0, int(cy - vertical_component))
        height = 2 * int(vertical_component)

        tl_x = max(0, int(cx - horizontal_component))
        width = 2 * int(horizontal_component)

        return (tl_x, tl_y, width, height)

    @staticmethod
    def does_intersect(rect1, rect2):
        """
        Checks if two bounding boxes intersect
        """
        x1, y1, w1, h1 = rect1
        x2, y2, w2, h2 = rect2
        minarea = (w1 + w2) * (h1 + h2)

        minx, miny = min(x1, x2), min(y1, y2)
        maxx, maxy = max(x1 + w1, x2 + w2), max(y1 + h1, y2 + h2)

        return ((maxx - minx) * (maxy - miny)) < minarea

    @staticmethod
    def load_from_file(annotation_file, allow_occluding, imread_mode):
        """
        Generator, yields faces from a single file until they can be loaded.

        Args:
            annotation_file: annotation file to read data from
            allow_occluding: should overlapping faces be returned?
            imread_mode: opencv imread mode
        """
        file_obj = open(annotation_file, "r")

        while True:
            img_name = file_obj.readline().strip()
            if img_name == "":
                break  # EOF
            img = cv.imread(f"../dataset/{img_name}.jpg", imread_mode)

            n_faces = int(file_obj.readline().strip())
            faces = []
            rects = []

            for i in range(n_faces):
                elliptical_params = list(
                    map(float, filter(bool, file_obj.readline().strip().split(" ")))
                )[:-1]
                a, b, angle, cx, cy = elliptical_params
                rect_params = FDDBLoader.elliptical2rect((cx, cy), (a, b), angle)
                x, y, w, h = rect_params

                rects.append(rect_params)
                faces.append(img[y : y + h, x : x + w])

            filtered_faces = []

            if allow_occluding or n_faces == 1:
                filtered_faces = faces
            else:
                ret_allowed = [True for _ in range(n_faces)]
                # for all pairs, check if they intersect
                combos_to_check = combinations(range(n_faces), 2)

                for i, j in combos_to_check:
                    if FDDBLoader.does_intersect(rects[i], rects[j]):
                        ret_allowed[i] = ret_allowed[j] = False

                for i in range(n_faces):
                    if ret_allowed[i]:
                        filtered_faces.append(faces[i])

            yield from filtered_faces

    def load(self):
        """
        Generator, yields faces from all the annotation files present
        """
        current_file_idx = 0
        while current_file_idx < len(self.annotation_files):
            current_file_loader = self.load_from_file(
                self.annotation_files[current_file_idx],
                self.allow_occluding,
                self.imread_mode,
            )

            for ret in current_file_loader:
                yield ret
                self.returned_faces += 1

                if self.returned_faces == self.n_samples:
                    current_file_loader.close()
                    return

            current_file_idx += 1
```
