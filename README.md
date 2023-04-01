# d3-mindmap
A JavaScript library for generating mind maps using D3.js.


## Installation

To install d3-mindmap, use the following command:

```
npm i d3-mindmap
```

## Usage

```javascript
import getRender from 'd3-mindmap';

const data = {
  "name": "Root",
  "children": [
    {
      "name": "Child 1",
      "children": [
        {"name": "Grandchild 1"},
        {"name": "Grandchild 2"}
      ]
    },
    {
      "name": "Child 2",
      "children": [
        {"name": "Grandchild 3"},
        {"name": "Grandchild 4"}
      ]
    }
  ]
};

getRender(document.body)(data);
```
Checkout a live demo of d3-mindmap [here](https://necolo.github.io/d3-mindmap/examples/demo2/)

## License
d3-mindmap is licensed under the MIT License.