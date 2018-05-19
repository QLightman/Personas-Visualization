var draw_view1_select = {
    height: 0,
    width: 0,
    div: 0,
    view: 0,
    initialize: function() {
        var self = this;
        self.div = "#view1_select";
        self.width = $(self.div).width();
        self.height = $(self.div).height();
        self.view = d3.select(self.div).append("svg")
            .attr("width", self.width)
            .attr("height", self.height);
        self.draw();
    },

    draw: function(list) {
        var self = this;
        var raito = 6;
        var rect_width = self.width / raito;
        var rect_height = self.height / 5;
        var sign_rect = self.view.append("g")
            .selectAll("rect")
            .data(education_color)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return self.width * 0.1 + i * rect_width;
            })
            .attr("y", function(d, i) {
                return self.height * 0.1;
            })
            .attr("width", rect_width * 0.8)
            .attr("height", rect_height * 0.8)
            .attr("opacity", 0.4)
            .attr("fill", function(d) {
                return d;
            })
            .attr("rx", 10)
            .attr("ry", 10)

        var sign_text = self.view.append("g")
            .attr("class", "texts")
            .selectAll("text")
            .data(education_list)
            .enter()
            .append("text")
            .attr("x", function(d, i) {
                return self.width * 0.17 + i * rect_width;
            })
            .attr("y", function(d, i) {
                return self.height * 0.35;
            })
            .text(function(d) {
                return d;
            })
    }
}