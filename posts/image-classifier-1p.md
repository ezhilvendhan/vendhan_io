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

The Image classifier uses one of the pre-trained models in PyTorch - densenet121, vgg13 and vgg16. Training is done on a GPU. You can also use a CPU to train, but it will be very slow.
To create a classifier, we have to do the following:
- Load and transform images
- Train the model
- Test the network
<br>

# Load and transform images
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

Next step is to generalize the images for better network performance. 
For the training dataset, we will randomly scale, crop and flip ths images using below.
Finally, we will conmert the image into a tensor and normalize with a set of mean and 
standard deviations. Doing so will shift each color channel to be 
centered at 0 and within limits -1 to 1.

```python
train_data_transforms = transforms.Compose([transforms.RandomRotation(30),
                                     transforms.RandomResizedCrop(224),
                                     transforms.RandomHorizontalFlip(),
                                     transforms.ToTensor(),
                                     transforms.Normalize([0.485, 0.456, 0.406],
                                                         [0.229, 0.224, 0.225])])
```

In case of testing and validation sets, we will not be randomly rotating the image. Instead we will
just resize to a fixed size and center crop the images. 

```python
test_data_transforms = transforms.Compose([transforms.Resize(225),
                                     transforms.CenterCrop(224),
                                     transforms.ToTensor(),
                                     transforms.Normalize([0.485, 0.456, 0.406],
                                                         [0.229, 0.224, 0.225])])
```

Let us load these images, applying transformations. 
Also, we will define the `batch_size` as well.

```python
# Load the datasets with ImageFolder
train_image_data = datasets.ImageFolder(train_dir, transform=train_data_transforms)
test_image_data = datasets.ImageFolder(test_dir, transform=test_data_transforms)

# Using the image datasets and the trainforms, define the dataloaders
train_loader = torch.utils.data.DataLoader(train_image_data, batch_size=64, shuffle=True)
test_loader = torch.utils.data.DataLoader(test_image_data, batch_size=32)
```
<br>

# Train the model
We are going to use a pre-trained [densenet121](https://www.kaggle.com/pytorch/densenet121/version/2) model here.
```python
model = models.densenet121(pretrained=True)
```

As we are re-training the model, let us freeze the model paramteres and turn off the gradients in the pre-trained model.
```python
for param in model.parameters():
    param.requires_grad = False
```

We will define the number of layers in our model classifier along with the 
activation function. Also, let us drop out some of the features randomly. This is to train our model well and avoid overfitting.

```python
classifier = nn.Sequential(OrderedDict([
                          ('fc1', nn.Linear(1024, 400)),
                          ('relu1', nn.ReLU()),
                          ('dropout1', nn.Dropout(p=0.5)),
                          ('fc2', nn.Linear(400, 102)),
                          ('output', nn.LogSoftmax(dim=1))]))
model.classifier = classifier
```

Next step is to define the epoch, learning rate, criterion and optimiser functions. 
`epoch` is the number of forward and backward passes for all of the training set.
We will go with `3`. <br>
`Learning rate` determines how quickly or slowly you want to update the weights for parameters. Prof. Jeremy Howard of fast.ai recommends a learning rate finder to come up with good learning rates. But for now, we will go with this number `0.001`<br>
`Criterion` function is used to calculate the loss while adjusting the weights. We will be using [Negative Log Likelihood Loss](https://pytorch.org/docs/master/nn.html?highlight=nllloss#torch.nn.NLLLoss) function here since ours is a problem involving `n` number of categories/classes.<br>
`Optimiser` function is used to modify the weights. We will go with [Adam](https://pytorch.org/docs/master/optim.html?highlight=adam#torch.optim.Adam)


```python
criterion = nn.NLLLoss()
learning_rate = 0.001
optimizer = optim.Adam(model.classifier.parameters(), learning_rate=learning_rate)
```

It's training time. We will be training the model using training set and validate the same using a validation set for every 40 iterations during an epoch.

```python
has_gpu = torch.cuda.is_available()
if has_gpu:
    model.cuda()
epoch = 3
print_every = 40
running_loss = 0
step = 0

for e in range(epoch):
    model.train()
    for ii, (inputs, labels) in enumerate(train_loader):
        step += 1
        optimizer.zero_grad()
        inputs, labels = Variable(inputs), Variable(labels)
        if has_gpu:
            inputs, labels = inputs.cuda(), labels.cuda()
        
        outputs = model.forward(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.data[0]
        
        if step % print_every == 0:
            #Turn off feature drop-out
            model.eval()
            accuracy = 0
            valid_loss = 0
            for idx, (v_inputs, v_labels) in enumerate(valid_loader):
                
                v_inputs, v_labels = Variable(v_inputs, volatile=True), \
                                        Variable(v_labels, volatile=True)
                if has_gpu:
                    v_inputs, v_labels = v_inputs.cuda(), v_labels.cuda()

                v_outputs = model.forward(v_inputs)
                valid_loss += criterion(v_outputs, v_labels).data[0]
                ps = torch.exp(v_outputs).data
                equality = (v_labels.data == ps.max(1)[1])
                accuracy += equality.type_as(torch.FloatTensor()).mean()
            print("Epoch: {}/{}.. ".format(e+1, epoch),
                  "Training Loss: {:.3f}.. ".format(running_loss/print_every),
                  "Validation Loss: {:.3f}.. ".format(valid_loss/len(valid_loader)),
                  "Validation Accuracy: {:.3f}".format(accuracy/len(valid_loader)))
            running_loss = 0
            #Enable training mode. So turn on deature drop-out
            model.train()
```

I got the following accuracy during training

```
Epoch: 1/3..  Training Loss: 4.328..  Validation Loss: 3.777..  Validation Accuracy: 0.214
Epoch: 1/3..  Training Loss: 3.449..  Validation Loss: 2.682..  Validation Accuracy: 0.464
Epoch: 2/3..  Training Loss: 2.654..  Validation Loss: 1.886..  Validation Accuracy: 0.656
Epoch: 2/3..  Training Loss: 2.110..  Validation Loss: 1.424..  Validation Accuracy: 0.699
Epoch: 2/3..  Training Loss: 1.792..  Validation Loss: 1.135..  Validation Accuracy: 0.763
Epoch: 3/3..  Training Loss: 1.600..  Validation Loss: 0.918..  Validation Accuracy: 0.806
Epoch: 3/3..  Training Loss: 1.383..  Validation Loss: 0.796..  Validation Accuracy: 0.819
```
During the first epoch we had only `46.4%` of accuracy on the validation set.
But by the end of 3 spochs, our accuracy has improved to `81.9%`. Also, the training loss is greater than validation loss which means there is no overfitting
on the validation set.

# Test the network
Now, let us validate our model on the testing set.

```python
epoch = 3

for e in range(epoch):
    model.eval()
    accuracy = 0
    test_loss = 0
    for idx, (inputs, labels) in enumerate(test_loader):

        inputs, labels = Variable(inputs, volatile=True), Variable(labels, volatile=True)
        inputs, labels = inputs.cuda(), labels.cuda()

        outputs = model.forward(inputs)
        test_loss += criterion(outputs, labels).data[0]
        ps = torch.exp(outputs).data
        equality = (labels.data == ps.max(1)[1])
        accuracy += equality.type_as(torch.FloatTensor()).mean()
    print("Epoch: {}/{}.. ".format(e+1, epoch),
          "Test Loss: {:.3f}.. ".format(test_loss/len(test_loader)),
          "Test Accuracy: {:.3f}".format(accuracy/len(test_loader)))
```

My accuracy is:

```
Epoch: 1/3..  Test Loss: 0.760..  Test Accuracy: 0.833
Epoch: 2/3..  Test Loss: 0.760..  Test Accuracy: 0.833
Epoch: 3/3..  Test Loss: 0.760..  Test Accuracy: 0.833
```

So, the testing set accuracy is around `83.3%` which is better than the validation set accuracy of `81.9%`

In the next post, we will save and load this trained model's checkpoint.
Doing so, we will be able to train a model say, on a GPU and use those checkpoint on another device say, a mobile phone to predict images.
