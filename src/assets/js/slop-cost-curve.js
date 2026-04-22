(function () {
  var container = document.getElementById('slop-cost-curve');
  if (!container) return;

  var accent = '#D2691E';
  var muted = '#B0A898';
  var textMid = '#5C5C5C';
  var borderCol = '#E8E4DF';

  var margin = { top: 30, right: 180, bottom: 50, left: 60 };
  var fullW = 600;
  var fullH = 320;
  var w = fullW - margin.left - margin.right;
  var h = fullH - margin.top - margin.bottom;

  var svg = d3.select(container)
    .append('svg')
    .attr('viewBox', '0 0 ' + fullW + ' ' + fullH)
    .style('width', '100%')
    .style('font-family', "'Roboto Slab', Georgia, serif");

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var n = 50;
  var data = d3.range(n).map(function (i) {
    var t = i / (n - 1);
    return {
      t: t,
      platform: Math.pow(t, 2.8),
      proto: 0.2 * t
    };
  });

  var x = d3.scaleLinear().domain([0, 1]).range([0, w]);
  var y = d3.scaleLinear().domain([0, 1]).range([h, 0]);

  var xAxis = d3.axisBottom(x).ticks(0).tickSize(0);
  var yAxis = d3.axisLeft(y).ticks(0).tickSize(0);

  g.append('g')
    .attr('transform', 'translate(0,' + h + ')')
    .call(xAxis)
    .call(function (a) { a.select('.domain').attr('stroke', textMid).attr('stroke-width', 1.2); });

  g.append('g')
    .call(yAxis)
    .call(function (a) { a.select('.domain').attr('stroke', textMid).attr('stroke-width', 1.2); });

  g.append('text')
    .attr('x', w / 2).attr('y', h + 36)
    .attr('text-anchor', 'middle')
    .attr('font-size', 11).attr('fill', textMid)
    .text('accumulated decisions');

  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('font-size', 11).attr('fill', textMid)
    .attr('transform', 'translate(-36,' + (h / 2) + ') rotate(-90)')
    .text('cost of slop');

  var platformLine = d3.line()
    .x(function (d) { return x(d.t); })
    .y(function (d) { return y(d.platform); })
    .curve(d3.curveCatmullRom.alpha(0.5));

  var protoLine = d3.line()
    .x(function (d) { return x(d.t); })
    .y(function (d) { return y(d.proto); })
    .curve(d3.curveCatmullRom.alpha(0.5));

  var platformPath = g.append('path')
    .datum(data)
    .attr('d', platformLine)
    .attr('fill', 'none')
    .attr('stroke', accent)
    .attr('stroke-width', 2.5);

  var protoPath = g.append('path')
    .datum(data)
    .attr('d', protoLine)
    .attr('fill', 'none')
    .attr('stroke', muted)
    .attr('stroke-width', 2.5);

  var totalLen1 = platformPath.node().getTotalLength();
  platformPath
    .attr('stroke-dasharray', totalLen1)
    .attr('stroke-dashoffset', totalLen1)
    .transition().duration(1200).ease(d3.easeCubicOut)
    .attr('stroke-dashoffset', 0);

  var totalLen2 = protoPath.node().getTotalLength();
  protoPath
    .attr('stroke-dasharray', totalLen2)
    .attr('stroke-dashoffset', totalLen2)
    .transition().duration(1200).ease(d3.easeCubicOut)
    .attr('stroke-dashoffset', 0);

  var labelX = w + 12;
  var lastD = data[data.length - 1];

  var platformLabel = g.append('g')
    .attr('transform', 'translate(' + labelX + ',' + y(lastD.platform) + ')')
    .style('opacity', 0);
  platformLabel.append('text')
    .attr('font-size', 11).attr('fill', accent).attr('font-weight', 700)
    .text('platform / scalable');
  platformLabel.append('text')
    .attr('y', 16)
    .attr('font-size', 10).attr('fill', accent).attr('font-style', 'italic')
    .text('compounds fast');
  platformLabel.transition().delay(800).duration(400).style('opacity', 1);

  var protoLabel = g.append('g')
    .attr('transform', 'translate(' + labelX + ',' + y(lastD.proto) + ')')
    .style('opacity', 0);
  protoLabel.append('text')
    .attr('font-size', 11).attr('fill', textMid).attr('font-weight', 700)
    .text('prototyping / analytical');
  protoLabel.append('text')
    .attr('y', 16)
    .attr('font-size', 10).attr('fill', textMid).attr('font-style', 'italic')
    .text('refactoring is cheap');
  protoLabel.transition().delay(800).duration(400).style('opacity', 1);

  var hoverLine = g.append('line')
    .attr('y1', 0).attr('y2', h)
    .attr('stroke', borderCol).attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,3')
    .style('opacity', 0);

  var dotPlatform = g.append('circle')
    .attr('r', 4).attr('fill', accent).style('opacity', 0);
  var dotProto = g.append('circle')
    .attr('r', 4).attr('fill', muted).style('opacity', 0);

  var tooltip = d3.select(container)
    .append('div').attr('class', 'tooltip');

  var slopLevels = [
    { threshold: 0.0, label: 'spotless' },
    { threshold: 0.1, label: 'slop-curious' },
    { threshold: 0.2, label: 'slop-tolerant' },
    { threshold: 0.3, label: 'sloptimistic' },
    { threshold: 0.4, label: 'sloportunistic' },
    { threshold: 0.5, label: 'sloperational' },
    { threshold: 0.6, label: 'slop-locked' },
    { threshold: 0.7, label: 'sloptimised' },
    { threshold: 0.8, label: 'slopocalyptic' },
    { threshold: 0.9, label: 'unslopvageable' }
  ];

  function getSlopLevel(t) {
    for (var i = slopLevels.length - 1; i >= 0; i--) {
      if (t >= slopLevels[i].threshold) return slopLevels[i].label;
    }
    return slopLevels[0].label;
  }

  var bisect = d3.bisector(function (d) { return d.t; }).left;

  var overlay = g.append('rect')
    .attr('width', w).attr('height', h)
    .attr('fill', 'none')
    .attr('pointer-events', 'all');

  overlay.on('mousemove', function (event) {
    var pos = d3.pointer(event, this);
    var t = x.invert(pos[0]);
    var i = bisect(data, t, 1);
    var d0 = data[i - 1];
    var d1 = data[Math.min(i, data.length - 1)];
    var d = (t - d0.t > d1.t - t) ? d1 : d0;

    var px = x(d.t);
    hoverLine.attr('x1', px).attr('x2', px).style('opacity', 1);
    dotPlatform.attr('cx', px).attr('cy', y(d.platform)).style('opacity', 1);
    dotProto.attr('cx', px).attr('cy', y(d.proto)).style('opacity', 1);

    var level = getSlopLevel(d.t);

    tooltip
      .html('<strong>' + level + '</strong>')
      .style('opacity', 1)
      .style('left', (px + margin.left + 12) + 'px')
      .style('top', (y(d.platform) + margin.top - 12) + 'px');
  });

  overlay.on('mouseleave', function () {
    hoverLine.style('opacity', 0);
    dotPlatform.style('opacity', 0);
    dotProto.style('opacity', 0);
    tooltip.style('opacity', 0);
  });
})();
