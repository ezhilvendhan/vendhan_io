(function () {
  Polymer({
    is: 'hor-bar-chart',

    properties: {
      data: {
        type: Array,
        value() {
          return [];
        },
        observer: 'draw'
      },
      width: {
        type: Number,
        value: 550
      },
      height: {
        type: Number,
        value: 140
      },
      margin: {
        type: Object,
        value() {
          return {top: 20, right: 20, bottom: 30, left: 100};
        }
      }
    },

    ready() {
      this.scopeSubtree(this.$.graphic, true);
      this.draw();
    },

    draw() {
      let data = this.data;
      if(!data || !data.length || !this.width || !this.height) {return;}
      d3.select(this.$.graphic).select("svg").remove();
      var margin = this.margin || {top: 20, right: 0, bottom: 30, left: 40},
          width = this.width - margin.left - margin.right,
          height = this.height - margin.top - margin.bottom;

      var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

      var x = d3.scaleLinear()
            .range([0, width]);
            
      var svg = d3.select(this.$.graphic).append("svg")
        .attr("viewBox", 
          `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

      data.forEach(function(d) {
        d.value = +d.value;
      });

      x.domain([0, d3.max(data, function(d){ return d.value; })])
      y.domain(data.map(function(d) { return d.name; }));
      
      svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("width", function(d) {return x(d.value); } )
        .attr("y", function(d) { return y(d.name); })
        .attr("height", y.bandwidth());

      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      svg.append("g")
        .call(d3.axisLeft(y));
    }

  });
})()