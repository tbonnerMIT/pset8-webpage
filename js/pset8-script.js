// initial variables
const width = 800; // true width for data is 650
const height = 600;
const margin_left = 300;
const margin_right = 30;
const margin_top = 30;
const margin_bottom = 30;
const gap = 250;// for left-hand y-axis text; i adjust axes location and xscale by this amount to proper fit on screen

// set up svg
const svg = d3.select("#bar-chart").append("svg").attr("viewBox", [margin_left, margin_right, width + margin_top, height + margin_bottom]);


function plotData(dataset){
    const xValues = dataset.map(d => parseInt(d.total_count));
    const xScale = d3.scaleLinear().domain([0, d3.max(xValues)]).range([0, width - gap]);
    const xAxis = d3.axisTop(xScale).ticks(6);
    const yValues = dataset.map(d => d.Name)
    const yScale = d3.scaleBand().domain(yValues).range([height, 0]).paddingInner(0.15);
    const yAxis = d3.axisLeft(yScale);

    svg.selectAll("rect").data(dataset).enter()
        .append("rect")
        .attr("height", yScale.bandwidth())
        .attr("width", (d) => xScale(parseInt(d.total_count)))
        .attr("x", (d) => margin_left + gap)
        .attr("y", (d, i) => 2*margin_top + yScale(d.Name))
        .attr("fill", "green")
        .on("mouseover", function(event, d) { 
            d3.select("#tooltip").classed("hidden", false);
            d3.select("#tooltip").style("left", event.pageX+10 + 'px').style("top", event.pageY+10 + 'px');
            d3.select("#tooltip").text("Total 311 Requests: " +d.total_count);
        })
        .on("mouseout", (event) => d3.select("#tooltip").classed("hidden", true));

    svg.append("g").attr("class", "x-axis").attr("transform", "translate(550, 60)").call(xAxis);
    svg.append("g").attr("class", "y-axis").attr("transform", "translate(550, 60)").call(yAxis);

};

// load external data
d3.csv('../data/boston_311.csv').then(function(data) {
    // sorting in place
    dataset = data.sort((a, b) => (parseInt(a.total_count) > parseInt(b.total_count)) ? 1: -1);
    console.log(data);
    plotData(data);
});



