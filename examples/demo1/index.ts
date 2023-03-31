import getRender from '../../src';

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
        {"name": "Grandchild 4"},
        {
          "name": "Child 3",
          "children": [
            {"name": "Grandchild 5"},
            {"name": "Grandchild 6"},
            {
              "name": "Child 4",
              "children": [
                {"name": "Grandchild 7"},
                {"name": "Grandchild 8"},
                {
                  "name": "Child 5",
                  "children": [
                    {"name": "Grandchild 9"},
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const { svgGroup } = getRender(document.body)(data);
svgGroup.attr('transform', 'translate(50, 50) scale(0.7)')