// set the dimensions and margins of the graph
var margin = { top: 30, right: 20, bottom: 20, left: 30 };
var width = 450 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;
var rectangles;

// append the svg object to the body of the page
var svg = d3
  .select('#my_dataviz')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${margin.left}, 0)`);

// xAxis container
var xAxisSvg = d3
  .select('#x_axis_wrapper')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', 30)
  .append('g')
  .attr('transform', `translate(${margin.left}, 0)`);

// tooltip container
var tooltipContainer = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

// Labels of row and columns
// Todo: get this arrays from data!
var myGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
var myVars = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10'];

var xScale = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01);
xAxisSvg
  .append('g')
  .attr('transform', `translate(0, 30)`)
  .call(d3.axisTop(xScale).tickSize(0))
  .select('.domain')
  .remove();

var yScale = d3
  .scaleBand()
  .range([height, 0])
  .domain(myVars.reverse())
  .padding(0.01);

svg
  .append('g')
  .attr('transform', `translate(0, 0)`)
  .call(d3.axisLeft(yScale).tickSize(0))
  .select('.domain')
  .remove();

// Build color scale
var myColor = d3.scaleLinear().range(['white', '#69b3a2']).domain([1, 100]);

//Read the data
d3.json('./data/data.json').then((data) => {
  rectangles = svg
    .selectAll('.rectangle')
    .data(data, (d) => d.group + ':' + d.variable)
    .enter()
    .append('rect')
    .attr('class', 'rectangle')
    .attr('x', (d) => xScale(d.group))
    .attr('y', (d) => yScale(d.variable))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .style('fill', (d) => myColor(d.value));

  rectangles
    .on('mouseover', (d) => {
      tooltipContainer.transition().duration(50).style('opacity', 1);
      tooltipContainer
        .html(d.label)
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 15 + 'px');
    })
    .on('mouseout', () =>
      tooltipContainer.transition().duration('50').style('opacity', 0)
    );
});

function highlightBlocks(value) {
  rectangles.classed('highlighted-block', false);
  rectangles
    .filter((data) => {
      if (!value) return false;
      return data.label.toUpperCase().includes(value.toUpperCase());
    })
    .classed('highlighted-block', true);
}
