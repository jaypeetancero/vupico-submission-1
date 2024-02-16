import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CommentsOriginChart = ({ comments }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (comments && d3Container.current) {
      const width = 350, height = 350, margin = 0;

      const radius = Math.min(width, height) / 2 - margin;

      d3.select(d3Container.current).selectAll("*").remove();

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      // Compute the count of comments per domain
      const countPerDomain = comments.reduce((acc, {email}) => {
        const domain = email.split('@')[1];
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      }, {});

      // Set the color scale
      const color = d3.scaleOrdinal()
        .domain(Object.keys(countPerDomain))
        .range(d3.schemeCategory10);

      // Compute the position of each group on the pie
      const pie = d3.pie().value(d => d[1]);
      const data_ready = pie(Object.entries(countPerDomain));

      // Build the pie chart
      svg
        .selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(radius)
        )
        .attr('fill', d => color(d.data[0]))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7);

      // Optional: Add labels to the pie chart
      svg
        .selectAll('text')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => `${d.data[0]} (${d.data[1]})`)
        .attr('transform', d => {
          let [x, y] = d3.arc().innerRadius(0).outerRadius(radius).centroid(d);
          return `translate(${x}, ${y})`;
        })
        .style('text-anchor', 'middle')
        .style('font-size', 14);
    }
  }, [comments]); // Redraw chart if comments change

  return (
    <div className="d3-component" ref={d3Container} />
  );
};

export default CommentsOriginChart;
