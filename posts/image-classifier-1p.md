{{{
    "id"       : "20180517icp",
    "title"    : "My First Image Classifier using pre-trained models in PyTorch",
    "tags"     : ["ai", "deep learning", "machine learning", "image", "classifier", "pytorch"],
    "category" : "Tech",
    "date"     : "2018-05-17",
    "dateText" : "17 May 2018"
}}}

This is my First Image Classifier using PyTorch. It was developed as a part of my [AI programming with Python](https://www.udacity.com/course/ai-programming-python-nanodegree--nd089) Nanodegree with Udacity. It's an excellent course to learn the basics of AI programming.

The project is to classify a set of flower images across 102 flower species. This is the [dataset](http://www.robots.ox.ac.uk/~vgg/data/flowers/102/index.html) used.
You can play with the results of this classifier implementation [here](/#/actions/ic1).

The Image classifier uses one of the pre-trained models in PyTorch - densenet121, vgg13 and vgg16.
To create a classifier, we have to do the following:
- Load and transform images
- Train the model
- Test

## Load and transform images
Let's import the dependencies here:

```python
    import matplotlib.pyplot as plt

    import torch
    from torch import nn
    from torch import optim
    import torch.nn.functional as F
    from torch.autograd import Variable
    from torchvision import datasets, transforms, models
    
    from collections import OrderedDict
    import numpy as np
    from PIL import Image
    import json
    import random
```