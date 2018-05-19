var draw_view2 = {
    height: 0,
    width: 0,
    div: 0,
    view: 0,
    groups: 0,
    interpolate: 0,
    linear: 0,

    initialize: function() {
        var self = this;
        self.div = "#view2";
        self.width = $(self.div).width();
        self.height = $(self.div).height();

        var scale_ratio = self.width / 161 > self.height / 118 ? self.height / 118 : self.width / 161;
        scale_ratio = scale_ratio * 151;
        self.linear = d3.scale.linear()
            .domain([0, 30])
            .range([0, 1]);
        self.view = d3.select(self.div).append("svg")
            .attr("id", "view2")
            .attr("width", self.width)
            .attr("height", self.height);


        self.interpolate = d3.interpolate("#F0FFFF", "#00E5EE");

        self.groups = self.view.append("g");
        var projection = d3.geo.mercator()
            .center([107, 31])
            .scale(scale_ratio)
            .translate([self.width * 0.5, self.height * 0.68]);
        var path = d3.geo.path()
            .projection(projection);
        d3.json("data/china.json", function(error, root) {
                if (error) alert("error");
                self.groups.selectAll("path")
                    .data(root.features)
                    .enter()
                    .append("path")
                    .attr("class", "country")
                    .style("fill", function(d, i) {
                        d.properties.id = self.interpolate(self.linear((location_number_list[_.indexOf(location_list, d.properties.name)])));
                        return d.properties.id;
                    })
                    .attr("d", path)
                    .on("mouseover", function(d, i) {
                        console.log(d.properties.name)
                        d3.select(this).style("fill", "#C1FFC1")

                        tooltip.html("地区:" + d.properties.name)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY + 20) + "px")
                            .style("opacity", 1);
                    })
                    .on("mouseout", function(d, i) {
                        d3.select(this).style("fill", d.properties.id);

                        tooltip.style("opacity", 0.0);
                    })
            })
            // self.draw_rectangle();
    },
    draw_rectangle: function() {
        var self = this;
        self.view.append("g").selectAll("rect")
            .data(_.range(31))
            .enter()
            .append("rect")
            .attr("x", self.width * 0.9)
            .attr("y", function(d, i) {
                return self.height * 0.9 - self.height / 40 * (i + 1)
            })
            .attr("height", self.height / 40)
            .attr("width", self.width * 0.03)
            .attr("fill", function(d) {
                return self.interpolate(self.linear(d));
            })
    },
    highlight_location: function(name, flag) {
        var self = this;
        self.groups.selectAll("path").style("fill", function(d, i) {
            if (d.properties.name == name) {
                if (flag == 1) return "steelblue";
            }
            return d.properties.id;
        })
    }
}