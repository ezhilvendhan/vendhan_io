{{{
    "id"       : "20180610icpsl",
    "title"    : "Saving and Loading an image classifier model",
    "tags"     : ["ai", "deep learning", "machine learning", "image", "classifier", "pytorch", "load", "save"],
    "category" : "Tech",
    "date"     : "2018-06-10",
    "dateText" : "10 June 2018"
}}}

In the [previous post](/#/posts/20180517icp), we used a pre-trained `densenet-121` model and created an image classifier out of it using PyTorch. In this post, let us see how we can save this model and load it and use when necessary.
Loading a saved model will enable us to run model in a non-GPU environment say, a mobile phone.

Here are our imports, we had in the previous post:

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

- Save the checkpoint
- Load the checkpoint
- Test the network
<br>

# Save the checkpoint
`train_image_data` was our training set. While saving the trained model checkpoint i.e. the optimiser state, 
we will also save the other attributes of the model like number of input, hidden and output layers, learning rate,
epoch, model architecture, class to indices. 
These attributes will be saved to the checkpoint file and will be used while loading the model.

```python
model.class_to_idx = train_image_data.class_to_idx
checkpoint = {'input_size': 1024,
              'output_size': 102,
              'hidden_layers': [400],
              'learning_rate': learning_rate,
              'epoch': epoch,
              'arch': 'densenet121',
              'class_to_idx': model.class_to_idx,
              'state_dict': model.state_dict()}

torch.save(checkpoint, 'checkpoint.pth')
```


# Load the checkpoint
Now, let us load the saved model.

```python
def load_checkpoint(filepath, gpu=false):
    # Load the checkpoint file
    if gpu:
        checkpoint = torch.load(filepath)
    else:
        checkpoint = torch.load(filepath,
                                map_location=lambda storage, loc: storage)
    #Load the model based on the architecture mentioned in the checkpoint
    model = getattr(models, checkpoint['arch'])(pretrained=True)
    hidden_layers = checkpoint['hidden_layers']
    #Create a classifier based on the checkpoint attributes
    classifier = nn.Sequential(OrderedDict([
                          ('fc1', nn.Linear(checkpoint['input_size'], hidden_layers[0])),
                          ('relu1', nn.ReLU()),
                          ('dropout1', nn.Dropout(p=0.5)),
                          ('fc2', nn.Linear(hidden_layers[0], checkpoint['output_size'])),
                          ('output', nn.LogSoftmax(dim=1))]))
    model.classifier = classifier
    #Load optimiser state from the checkpoint
    model.load_state_dict(checkpoint['state_dict'])
    #add class to index from the checkpoint
    model.class_to_idx = checkpoint['class_to_idx']
    
    return model

model = load_checkpoint('checkpoint.pth')
```

That's it! Our model is now loaded and ready for predictions.


# Test the network
Its time to do so some predictions. But how to feed our image to this model?
We have to write a few helper functions to convert the image in to a format which can be read by our model.
Also we may need to see the top `n` predictions that our model will come with.

Let us first convert the image to a numpy array. 
Remember, we also need to scale, crop and normalize 
this image as we did to our training set in the previous post.

The function below takes a [PIL](https://pillow.readthedocs.io/en/latest/reference/Image.html) image object as a parameter and converts the image to a numpy array

```python
def process_image(img):
    ''' Scales, crops, and normalizes a PIL image for a PyTorch model,
        returns an Numpy array
    '''
    
    #Process a PIL image for use in a PyTorch model
    width, height = img.size
    #Resize image into a thumbnail, keeping the aspect ratio
    if width > height:
        img.thumbnail((height, 256), Image.ANTIALIAS)
    else:
        img.thumbnail((256, width), Image.ANTIALIAS)
    half_the_width = img.size[0] / 2
    half_the_height = img.size[1] / 2
    # Crop Image to the center
    img = img.crop(
        (
            half_the_width - 112,
            half_the_height - 112,
            half_the_width + 112,
            half_the_height + 112
        )
    )

    #Image Normalization
    np_image = np.array(img)
    img = np_image/255
    img=(img-np.array([0.485, 0.456, 0.406]))/np.array([0.229, 0.224, 0.225])

    # This is needed, as pyTorch expects color channel 
    # in the first dimension instead of third
    img = img.transpose((2,0,1))
    img = np.expand_dims(img, axis=0)
    img = torch.from_numpy(img).float()
    img = Variable(img, volatile=True)
    return img
```

Our prediction function will take up the following arguments: `image_path`, loaded `model`, `topk` - the top `n` probabilities of the predictions

```python
def predict(image_path, model, topk):
    """Predict the class (or classes) of an image 
    using a trained deep learning model."""
    # Turn-off feature drop-out
    model.eval()
    # Create a PIL Image object from the path
    image = Image.open(image_path)
    image = process_image(image)
    output = model.forward(image)
    output = torch.exp(output).data
    # Get top k probabilities
    probs, classes = output.topk(topk)
    ind = model.class_to_idx
    res = dict((v, k) for k, v in ind.items())
    classes = [res[x] for x in classes.cpu().numpy()[0]]
    return probs, classes
```

Testing time, ahoy!

```python
probs, classes = predict('flowers/test/15/image_06351.jpg', model)
print(probs)
print(classes)
```

You will get a result similar to this:
```
 0.5564  0.0900  0.0616  0.0486  0.0307

['15', '84', '18', '4', '43']
```

The first line denotes the probabilities of the classes and second line - the image classes.

Let us make the classes more readable.
We have a JSON file that has the mapping of classes and names. 
We will load it and display the names of the classes.

```python
with open('cat_to_name.json', 'r') as f:
    cat_to_name = json.load(f)
```

We will also display the image and class predictions and probabilities as a horizontal bar chart to be more clear.

```python
# Display an image along with the top 5 classes
img_path = 'flowers/test/100/image_07926.jpg'
cat = '100'
plt.imshow(Image.open(img_path))
plt.axis('off')
plt.title(cat_to_name[cat])
ps, classes = predict(img_path, model)

fig, (ax2) = plt.subplots()

ax2.barh(classes, ps.cpu().numpy().reshape(1,5)[0])
ax2.set_yticklabels([cat_to_name.get(x) for x in classes], size='large');
ax2.set_title('Class Probability - ' + cat_to_name[cat])
plt.xlim(0, 1);
```

Running the above code, we can get something like below:
You can also play with the results of this classifier implementation [here](/#/actions/ic1).
<img src="/resources/img/ic1-result.png" style="width: 60%;">



