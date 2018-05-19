var draw_view3 = {
    data: 0,
    height: 0,
    width: 0,
    div: 0,
    view: 0,
    graph_line_class: 0,
    yScale: 0,
    xScale: 0,
    stroke_color: 0,
    name_list: 0,
    record_list: 0,
    graph_text_class: 0,
    initialize: function() {
        var self = this;
        self.div = "#view3";
        self.width = $(self.div).width();
        self.height = $(self.div).height();
        self.view = d3.select(self.div).append("svg")
            .attr("width", self.width)
            .attr("height", self.height);
        self.stroke_color = "steelblue";

        self.name_list = [];
        self.record_list = [];
        self.graph_line_class = [];
        self.draw();
    },


    draw: function(data) {
        var self = this;
        self.yScale = d3.scale.linear()
            .domain([0, 10])
            .range([0, self.height * 0.7]);
        var yAxis = d3.svg.axis()
            .scale(self.yScale)
            .orient("left")
            .ticks(0);

        self.yScale.range([self.height * 0.7, 0]);

        self.xScale = d3.scale.linear()
            .domain([1965, 2018])
            .range([0, self.width * 0.8]);
        var xAxis = d3.svg.axis()
            .scale(self.xScale)
            .ticks(10)

        var gxAxis = self.view.append("g")
            .attr("transform", 'translate(' + (self.width * 0.1) + ',' + (self.height * 0.8) + ')')
            .attr("class", "axis");

        var gyAxis = self.view.append("g")
            .attr("transform", 'translate(' + (self.width * 0.1) + ',' + (self.height * 0.1) + ')')
            .attr("class", "axis");
        gxAxis.call(xAxis);
        gyAxis.call(yAxis);
        self.yScale.range([0, self.height * 0.7]);
        d3.csv("data/all_data.csv", function(error, data) {
            console.log(data[0].履历);
            console.log(data);
        })
    },
    get_record: function(name) {
        var self = this;
        self.name_list.push(name);
        self.record_list = new Array(self.name_list.length);

        console.log(self.name_list);
        d3.csv("data/all_data.csv", function(error, data) {
            for (var i = 0; i < data.length; i++) {
                if (_.contains(self.name_list, data[i].姓名))
                    self.record_list[_.indexOf(self.name_list, data[i].姓名)] = data[i].履历;
            }
            for (var i = 0; i < self.record_list.length; i++) {
                self.record_list[i] = self.record_list[i].toString().split('\n');
            }
            self.draw_line();
            self.draw_text();

        })

    },
    draw_text: function() {
        var self = this;
        self.remove_text();
        self.graph_text_class = self.view.append("g")
            .attr("id", "view3_text")
            .selectAll("text")
            .data(self.name_list)
            .enter().append("text")
            .attr("x", function(d, i) {
                return self.width * 0.07;
            })
            .attr("y", function(d, i) {
                return self.height * 0.8 - self.height * 0.7 / (self.name_list.length + 1) * (i + 1);

            })
            .text(function(d) {
                return d
            })
    },
    draw_line: function() {
        var self = this;
        self.remove_line();
        self.graph_line_class = new Array(self.name_list.length);
        for (var index = 0; index < self.name_list.length; index++) {
            self.graph_line_class[index] = self.view.append("g")
                .attr("id", "view3_line" + index)
                .attr("stroke-width", 3)
                .attr("stroke", self.stroke_color)
                .selectAll("line")
                .data(self.generate_line_data(index))
                .enter().append("line")
                .attr("x1", function(d, i) {
                    return d.x1;
                })
                .attr("x2", function(d, i) {
                    return d.x2;
                })
                .attr("y1", function(d, i) {
                    return d.y1;
                })
                .attr("y2", function(d, i) {
                    return d.y2;
                })
        }
        for (var index = 0; index < self.name_list.length; index++) {
            self.graph_line_class[index].attr("opacity", function(d, i) {
                    return (i % 2 == 1) ? 1 : 0.5;
                })
                .on("mouseover", function(d, i) {
                    for (var index = 0; index < location_list.length; index++) {
                        if (d.content.search(location_list[index]) != -1)
                            draw_view2.highlight_location(location_list[index], 1);
                    }
                    d3.select(this).attr("stroke-width", 4)
                        .attr("stroke", "red");
                    tooltip.html(d.content)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px")
                        .style("opacity", 1);
                })
                .on("mouseout", function(d, i) {
                    d3.select(this).attr("stroke-width", 3)
                        .attr("stroke", self.stroke_color)
                    tooltip.style("opacity", 0.0);
                })
        }

    },
    generate_line_data: function(index) {
        var self = this;
        console.log(self.record_list);

        function LINE() {}
        LINE.prototype.id = 0;
        LINE.prototype.x1 = 0;
        LINE.prototype.x2 = 0;
        LINE.prototype.y1 = 0;
        LINE.prototype.y2 = 0;
        LINE.prototype.content = 0;

        var line_class = new Array(),
            tmp;
        for (var i = 0; i < self.record_list[index].length; i++) {
            tmp = self.record_list[index][i];
            tmp = tmp.toString().split('—');
            console.log("------------");
            console.log(parseInt(tmp[0]));
            console.log(parseInt(tmp[1]));
            console.log("------------");
            if (isNaN(parseInt(tmp[1]))) tmp[1] = 2018;

            line_class[i] = new LINE();
            line_class[i].id = index;
            line_class[i].content = self.record_list[index][i];
            line_class[i].x1 = self.width * 0.1 + self.xScale(Math.abs(parseInt(tmp[0])));
            line_class[i].x2 = self.width * 0.1 + self.xScale(Math.abs(parseInt(tmp[1])));
            line_class[i].y1 = self.height * 0.8 - self.height * 0.7 / (self.record_list.length + 1) * (index + 1);
            line_class[i].y2 = self.height * 0.8 - self.height * 0.7 / (self.record_list.length + 1) * (index + 1);
        }
        return line_class;
    },
    remove_line: function() {
        var self = this;
        for (var i = 0; i < self.name_list.length; i++)
            self.view.select("#view3_line" + i).remove();
    },
    remove_text: function() {
        var self = this;
        self.view.select("#view3_text").remove();
    }

}