# d3-mindmap

## Install

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
