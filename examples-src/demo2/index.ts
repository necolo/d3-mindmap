import getRender from '../../src';

/* ----------------------------- create elements ---------------------------- */
const containerEl = document.createElement('div');
containerEl.className = 'container';

const editorEl = document.createElement('textarea');
editorEl.className = 'editor';

const mindmapEl = document.createElement('div');
mindmapEl.className = 'mindmap';

const barEl = document.createElement('div');
barEl.className = 'bar';

const selectorEl = document.createElement('select');
selectorEl.innerHTML = `
  <option value="default">default</option>
  <option value="json">json</option>
`;

const tidyEl = document.createElement('button');
tidyEl.innerText = 'Format';

document.body.appendChild(barEl);
barEl.append(selectorEl);
barEl.append(tidyEl);
document.body.appendChild(containerEl);
containerEl.appendChild(editorEl);
containerEl.appendChild(mindmapEl);

/* ---------------------------------- main ---------------------------------- */
type DataType = 'default' | 'json';
let onType: DataType = 'default';
let value = getSampleData(onType);

const _render = getRender(mindmapEl);
function render() {
  if (onType === 'default') {
    return _render(value);
  }
  return _render(formatJSON(value));
}

editorEl.value = tidy(value);
render();

editorEl.addEventListener('input', debounce(
  e => {
    try {
      const v = e.target.value;
      const json = JSON.parse(v);
      console.log("🚀 ~ file: index.ts:53 ~ json:", json)
      value = json;
      render();
    } catch (e) {

    }
  },
  500,
));

selectorEl.addEventListener('change', ev => {
  // @ts-ignore
  onType = ev.target.value;
  value = getSampleData(onType);
  editorEl.value = tidy(value);
  render();
});

tidyEl.addEventListener('click', ev => {
  editorEl.value = tidy(value);
});

/* -------------------------------- functions ------------------------------- */

// debounce function
function debounce(fn: Function, delay: number) {
  let timer: number;
  return function(...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

function formatJSON(json: unknown, key = 'root') {
  const type = typeof json;
  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
      if (key) {
        return { name: `${key}: ${json}` };
      }
      return { name: json };
    
    case 'undefined':
      if (key) {
        return { name: `${key}: undefined` };
      }
      return { name: 'undefined' };

    case 'object':
      if (Array.isArray(json)) {
        return {
          name: key,
          children: json.map((v, i) => formatJSON(v, i.toString())),
        };
      }

      if (json === null || json === undefined) {
        return { name: 'null' };
      }

      return {
        name: key,
        children: Object.entries(json).map(([key, value]) => formatJSON(value, key)),
      };

    default:
      throw new Error(`Unknown value: ${json}`);
  }
}

function getSampleData(type: DataType) {
  switch (type) {
    case 'json':
      return {
        "name": "John",
        "age": 30,
        "city": "New York",
        "pets": [
          {
            "name": "Fido",
            "species": "dog",
            "age": 5
          },
          {
            "name": "Fluffy",
            "species": "cat",
            "age": 3
          }
        ],
        "languages": {
          "english": true,
          "spanish": true,
          "french": false
        }
      };

    case 'default':
    default:
      return {
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
        ],
      };
  }
}

function tidy(json: any) {
  return JSON.stringify(json, null, 2);
}