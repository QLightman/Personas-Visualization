var draw_view0 = {
    height: 0,
    height2: 0,
    width: 0,
    div: 0,
    view: 0,
    margin: 0,
    margin2: 0,
    time_text: 0,

    initialize: function() {
        var self = this;
        self.div = "#view0";
        self.margin = { top: 20, right: 20, bottom: 90, left: 50 };
        self.margin2 = { top: 230, right: 20, bottom: 30, left: 50 };
        self.width = $(self.div).width() - self.margin.left - self.margin.right;
        self.height = $(self.div).height() - self.margin.top - self.margin.bottom;
        self.height2 = $(self.div).height() - self.margin2.top - self.margin2.bottom;

        self.view = d3v4.select(self.div).append("svg")
            .attr("width", self.width + self.margin.left + self.margin.right)
            .attr("height", self.height + self.margin.top + self.margin.bottom);
        self.draw();
    },

    draw: function() {

        var self = this;

        var parseTime = d3v4.timeParse("%Y-%m-%d");

        var x = d3v4.scaleTime().range([0, self.width]),
            x2 = d3v4.scaleTime().range([0, self.width]),
            y = d3v4.scaleLinear().range([self.height, 0]),
            y2 = d3v4.scaleLinear().range([self.height2, 0]);

        var xAxis = d3v4.axisBottom(x).tickSize(0),
            xAxis2 = d3v4.axisBottom(x2).tickSize(0),
            yAxis = d3v4.axisLeft(y).tickSize(0);

        var brush = d3v4.brushX()
            .extent([
                [0, 0],
                [self.width, self.height2]
            ])
            .on("brush", brushed);

        var zoom = d3v4.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([
                [0, 0],
                [self.width, self.height]
            ])
            .extent([
                [0, 0],
                [self.width, self.height]
            ])
            .on("zoom", zoomed);



        self.view.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", self.width)
            .attr("height", self.height);

        var focus = self.view.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

        var context = self.view.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + self.margin2.left + "," + self.margin2.top + ")");

        // Data Load from CSV
        d3v4.csv("data/name_year.csv", function(error, data) {
            if (error) throw error;

            data.forEach(function(d) {
                d.sent_time = parseTime(d.sent_time);
            });

            var xMin = d3v4.min(data, function(d) { return d.sent_time; });
            var xMax = d3v4.max(data, function(d) { return d.sent_time; });

            var yMax = Math.max(d3v4.max(data, function(d) { return d.messages_sent_in_day; }));
            x.domain([xMin, xMax]);
            y.domain([0, 8]);
            x2.domain(x.domain());
            y2.domain(y.domain());

            var num_messages = function(dataArray, domainRange) {
                return d3v4.sum(dataArray, function(d) {
                    return d.sent_time >= domainRange.domain()[0] && d.sent_time <= domainRange.domain()[1];
                })
            }

            // append scatter plot to main chart area
            var messages = focus.append("g");
            messages.attr("clip-path", "url(#clip)");
            messages.selectAll("message")
                .data(data)
                .enter().append("circle")
                .attr('class', 'message')
                .attr("r", 5)
                .style("opacity", 0.4)
                .attr("cx", function(d) { return x(d.sent_time); })
                .attr("cy", function(d) { return y(d.messages_sent_in_day); })

            focus.append("g")
                .attr("class", "axis x-axis")
                .attr("transform", "translate(0," + self.height + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);

            // Summary Stats
            focus.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - self.margin.left)
                .attr("x", 0 - (self.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Peoples born in the same month");

            self.time_text = focus.append("text")
                .attr("x", self.width - self.margin.right)
                .attr("dy", "1em")
                .attr("text-anchor", "end")
                .text("Peoples: " + num_messages(data, x));

            self.view.append("text")
                .attr("transform",
                    "translate(" + ((self.width + self.margin.right + self.margin.left) / 2) + " ," +
                    (self.height + self.margin.top + self.margin.bottom) + ")")
                .style("text-anchor", "middle")
                .text("Date");

            self.view.append("rect")
                .attr("class", "zoom")
                .attr("width", self.width)
                .attr("height", self.height)
                .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")")
                .call(zoom);

            // append scatter plot to brush chart area
            var messages = context.append("g");
            messages.attr("clip-path", "url(#clip)");
            messages.selectAll("message")
                .data(data)
                .enter().append("circle")
                .attr('class', 'messageContext')
                .attr("r", 3)
                .style("opacity", .6)
                .attr("cx", function(d) { return x2(d.sent_time); })
                .attr("cy", function(d) { return y2(d.messages_sent_in_day); })

            context.append("g")
                .attr("class", "axis x-axis")
                .attr("transform", "translate(0," + self.height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());

        });

        function brushed() {
            if (d3v4.event.sourceEvent && d3v4.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3v4.event.selection || x2.range();

            x.domain(s.map(x2.invert, x2));
            view0_domain = x.domain();
            draw_view1.test_view0_data();
            self.time_text
                .text("Time duraction: " + view0_domain[0] + "----" + view0_domain[1]);

            focus.selectAll(".message")
                .attr("cx", function(d) { return x(d.sent_time); })
                .attr("cy", function(d) { return y(d.messages_sent_in_day); });
            focus.select(".x-axis").call(xAxis);
            self.view.select(".zoom").call(zoom.transform, d3v4.zoomIdentity
                .scale(self.width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3v4.event.sourceEvent && d3v4.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3v4.event.transform;
            x.domain(t.rescaleX(x2).domain());
            focus.selectAll(".message")
                .attr("cx", function(d) { return x(d.sent_time); })
                .attr("cy", function(d) { return y(d.messages_sent_in_day); });
            focus.select(".x-axis").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }
    }

}