"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Background = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set the dimensions of the SVG
    svg.attr('width', width).attr('height', height).style('background-color', '#2c3e50')
        .style('box-shadow', 'inset 3px 3px 6px #131a21, inset -3px -3px 6px #212e3d');

    // Function to add and animate a circle
    const addCircle = () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const dx = (Math.random() - 0.5) * 2;
      const dy = (Math.random() - 0.5) * 2;
      const circle = svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 2)
          .style('fill', 'white');

      // Function to update position
      const updatePosition = () => {
        circle.attr('cx', parseFloat(circle.attr('cx')) + dx)
            .attr('cy', parseFloat(circle.attr('cy')) + dy);

        // Remove the circle if it goes out of bounds
        if (parseFloat(circle.attr('cx')) > width || parseFloat(circle.attr('cx')) < 0 || parseFloat(circle.attr('cy')) > height || parseFloat(circle.attr('cy')) < 0) {
          circle.remove();
        }
      };

      // Update the position every 60ms
      const intervalId = setInterval(updatePosition, 60);

      // Accelerate on mouseover
      circle.on('mouseover', () => {
        clearInterval(intervalId); // Clear the existing interval
        // Start a new interval with a shorter delay to speed up the animation
        setInterval(updatePosition, 20);
      });
    };

    // Add a new circle every 1000ms
    const addCircleInterval = setInterval(addCircle, 1000);

    // Cleanup
    return () => {
      clearInterval(addCircleInterval);
      svg.selectAll('circle').remove(); // Remove all circles
    };
  }, []);

  return <svg ref={svgRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100%', height: '100%' }} />;
};

export default Background;
