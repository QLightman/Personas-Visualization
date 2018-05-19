var draw_view1 = {
    height: 0,
    width: 0,
    div: 0,
    view: 0,
    initialize: function() {
        var self = this;
        self.div = "#view1";
        self.width = $(self.div).width();
        self.height = $(self.div).height();
        self.view = d3.select(self.div).append("svg")
            .attr("width", self.width)
            .attr("height", self.height);
    },
    get_rectangle_data: function(list1, list2) {
        var self = this;
        list1 = (list1 == null) ? location_list : list1;
        list2 = (list2 == null) ? school_list : list2;

        function people_property() {};
        people_property.prototype.degree = "a";
        people_property.prototype.name = "a";
        people_property.prototype.location = "a";

        d3.csv("data/data.csv", function(error, data) {
            d3.csv("data/year.csv", function(error, year) {
                console.log(view0_domain);

                var rectangle_list = [],
                    tmp;

                for (var i = 0; i < data.length; i++) {
                    if (_.contains(list1, data[i].出生地) && _.contains(list2, data[i].毕业院校)) {
                        if (view0_domain.length == 0 || (year[i].year >= view0_domain[0] && year[i].year <= view0_domain[1])) {
                            tmp = new people_property();
                            tmp.name = data[i].姓名;
                            tmp.degree = data[i].专业背景;
                            tmp.location = data[i].出生地;
                            rectangle_list.push(tmp);
                        }
                    }
                }
                self.draw_people(rectangle_list);

            })

        })
    },
    draw_people: function(list) {
        var self = this;
        var raito = 6;
        self.remove();
        var rect_width = self.width / raito;
        var rect_height = self.height / 5;

        var people_rect = self.view.append("g")
            .selectAll("rect")
            .data(list)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return rect_width * (i % raito);
            })
            .attr("y", function(d, i) {
                return self.height * 0.1 + rect_height * (Math.floor(i / raito));
            })
            .attr("width", rect_width * 0.8)
            .attr("height", rect_height * 0.8)
            .attr("opacity", 0.4)
            .attr("fill", function(d) {
                return education_color[_.indexOf(education_list, d.degree)];
            })
            .attr("rx", 10)
            .attr("ry", 10)
            .on("click", function(d) {
                console.log(d)
                draw_view3.get_record(d.name);
            })
            .on("mouseover", function(d) {
                draw_view2.highlight_location(d.location, 1);
                d3.select(this).attr("opacity", 0.8)
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1);
            })
            .on("mouseout", function(d) {
                draw_view2.highlight_location(d.location, 0);
                d3.select(this).attr("opacity", 0.4)
                    .attr("stroke-width", 0);
            })
        var people_text = self.view.append("g")
            .attr("class", "texts")
            .selectAll("text")
            .data(list)
            .enter()
            .append("text")
            .attr("x", function(d, i) {
                return rect_width * (i % raito) + rect_width * 0.4;
            })
            .attr("y", function(d, i) {
                return self.height * 0.1 + rect_height * (Math.floor(i / raito)) + rect_height * 0.4;
            })
            .text(function(d) {
                return d.name;
            })
    },
    test_view0_data() {
        var self = this;
        for (var i = 0; i < 2; i++) {
            view0_domain[i] = view0_domain[i].toString().split(' ');
            view0_domain[i] = view0_domain[i][3] + "-" + month_number_list[_.indexOf(month_list, view0_domain[i][1])] + "-01";
        }
        console.log(view0_domain);
        self.get_rectangle_data($("#location_select").val(), $("#school_select").val());
    },


    remove() {
        var self = this;
        self.view.selectAll("*").remove();
    }
}