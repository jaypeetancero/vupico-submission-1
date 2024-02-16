import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CommentsLengthChart = ({ comments }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (comments && d3Container.current) {
      // Clear the SVG to prevent duplication
      d3.select(d3Container.current).selectAll("*").remove();

      const data = [
        { name: 'Longest', value: Math.max(...comments.map(c => c.body.length)) },
        { name: 'Shortest', value: Math.min(...comments.map(c => c.body.length)) },
        { name: 'Average', value: comments.reduce((acc, c) => acc + c.body.length, 0) / comments.length },
      ];

      const margin = { top: 20, right: 60, bottom: 30, left: 80 },
            width = 360 - margin.left - margin.right,
            height = 180 - margin.top - margin.bottom;

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(d => d.name))
        .padding(.1);

      const x = d3.scaleLinear()
        .domain([0, Math.max(...data.map(d => d.value))])
        .range([0, width]);
      svg.append('g')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', 0) // Bars start at the beginning of the x-axis
        .attr('y', (d, i) => y(d.name))
        .attr('width', d => x(d.value))
        .attr('height', y.bandwidth())
        .attr('fill', '#69b3a2');
               
      svg.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("x", d => x(d.value) + 30)
        .attr("y", (d, i) => y(d.name) + y.bandwidth() / 2)
        .attr("dy", "0.35em") // Vertically center align text
        .text(d => d.value.toFixed(2));

      svg.append('g')
         .call(d3.axisLeft(y));
    }
  }, [comments]);

  return (
    <div className="d3-component" ref={d3Container} />
  );
};

export default CommentsLengthChart;
