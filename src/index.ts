import { hierarchy, tree as createTree, HierarchyNode } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import 'd3-transition';

interface MindMapData {
  name: string;
  children?: MindMapData[];
}

interface Options {
  colorSet?: string[];
}

interface Axis {
  x: number;
  y: number;
}

function diagonal(s: Axis, d: Axis) {
  return `M ${s.y} ${s.x}
    C ${(s.y + d.y) / 2} ${s.x},
      ${(s.y + d.y) / 2} ${d.x},
      ${d.y} ${d.x}`;
}

export default function getRender(container: HTMLElement, options: Options = {}) {

  // init options
  const colorSet = options.colorSet || ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  // init the svg and tree
  const svg = select('body').append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .append('g');

  const height = container.clientHeight;
  const width = container.clientWidth;
  const tree = createTree<MindMapData>().size([height, width]);

  const color = scaleOrdinal(colorSet);
  let root: HierarchyNode<MindMapData> | undefined;

  // update function
  function update(source: HierarchyNode<MindMapData>) {
    if (!root) {
      return;
    }
    const treeData = tree(root);
    const nodes = treeData.descendants();
    const links = treeData.links();
  
    nodes.forEach((d, index) => {
        d.y = d.depth * 180;
    });
  
    let i = 0;
    const node = svg.selectAll('.node')
        .data(nodes, d => d.id || (d.id = ++i));
  
    const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${source.y0}, ${source.x0})`);
  
    nodeEnter.append('circle')
        .attr('r', 1e-6)
        .style('fill', d => color(d.depth));
  
    nodeEnter.append('text')
        .attr('dx', d => d.children || d._children ? -12 : 12)
        .attr('dy', 3)
        .style('text-anchor', d => d.children || d._children ? 'end' : 'start')
        .text(d => d.data.name);
  
    const nodeUpdate = nodeEnter.merge(node);
  
    nodeUpdate.transition()
        .duration(750)
        .attr('transform', d => `translate(${d.y}, ${d.x})`);
  
    nodeUpdate.select('circle')
        .attr('r', 4.5)
        .style('fill', d => color(d.depth))
        .on('click', nodeClicked);
  
    nodeUpdate.select('text')
        .attr('dx', d => d.children || d._children ? -12 : 12)
        .attr('dy', 3)
        .style('text-anchor', d => d.children || d._children ? 'end' : 'start')
        .text(d => d.data.name);
  
    const nodeExit = node.exit().transition()
        .duration(750)
        .attr('transform', d => `translate(${source.y}, ${source.x})`)
        .remove();
  
    nodeExit.select('circle')
        .attr('r', 1e-6);
  
    nodeExit.select('text')
    .style('fill-opacity', 1e-6);
  
    const link = svg.selectAll('.link')
        .data(links, d => d.target.id);
  
    const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', d => {
            const o = {x: source.x0, y: source.y0};
            return diagonal(o, o);
        });
  
    const linkUpdate = linkEnter.merge(link);
  
    linkUpdate.transition()
        .duration(750)
        .attr('d', d => diagonal(d.source, d.target));
  
    link.exit().transition()
        .duration(750)
        .attr('d', d => {
            const o = {x: source.x, y: source.y};
            return diagonal(o, o);
        })
        .remove();
  
    nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    function nodeClicked(event, d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }
  }

  return function (data: MindMapData) {
    root = hierarchy(data);
    root.x0 = height / 2;
    root.y0 = 0;
    update(root);
  }
}