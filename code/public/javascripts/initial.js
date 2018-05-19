var location_list = ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海",
    "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西",
    "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆"
];
var location_number_list = [7, 0, 16, 2, 4, 15, 3, 4, 7, 20, 12,
    8, 9, 5, 30, 10, 10, 6, 2, 3, 0, 4, 5, 2, 2, 1, 6, 4, 0, 1, 3
];
var school_list = ["空军保定学校", "空军第九航空学校", "中南财经政法大学", "复旦大学", "中国人民大学", "华中师范大学",
    "大连理工大学", "日本东北大学", "清华大学", "中央民族学院", "哈尔滨工业大学", "北京大学", "中国社会科学院", "北京第二外国语学院",
    "中央党校", "中国石油大学", "中央民族大学", "辽宁大学", "西安交通大学", "北京师范大学", "中欧国际工商学院", "福建师范大学",
    "西北电讯工程学院", "山东大学", "吉林大学", "国防科学技术大学", "俄罗斯医学科学院", "西北轻工学院", "哈尔滨建筑工程学院",
    "中国科学院", "郑州大学", "陕西师范大学", "解放军陆军指挥学院", "华东工程学院", "北京外国语学院", "国防大学", "西南财经大学",
    "中共中央党校", "香港理工大学", "厦门大学", "空军第五航空学校", "武汉大学", "中国社会科学院研究生院", "西北师范学院",
    "广西师范大学", "国防科技大学", "东北师范大学", "重庆大学", "解放军通信工程学院", "南京大学", "财政部财政科学研究所",
    "中南矿冶学院（现中南大学）", "中北大学", "大连海运学院", "上海第二医科大学", "中国政法大学", "西南政法大学", "军事学院",
    "西北工业大学", "南开大学", "华东师范大学", "西南政法学院", "英国帝国理工学院", "武汉理工大学", "新疆大学", "合肥工业大学",
    "西安电子科技大学", "北京航空航天大学", "俄罗斯伏龙芝军事学院", "奥斯陆大学", "日本东京大学", "兰州大学", "浙江大学",
    "中国科学技术大学", "华中科技大学", "北京航空学院", "航空航天部空间技术研究院", "中国科技大学", "河北师范大学", "二炮指挥学院",
    "北京科技大学", "江苏公安专科学校", "南京师范大学", "北京农业大学", "华东政法学院", "华北水利水电大学", "中山大学"
]
var education_list = ["军人", "硕士", "博士", "其他"];
var education_color = ["red", "yellow", "orange", "steelblue"];
var view0_domain = [];
var month_list = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var month_number_list = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooptip")
    .style("opacity", 0.0);
$(document).ready(function() {
    for (var i = 0; i < location_list.length; i++) {
        $("#location_select").append("<option value='" + (location_list[i]) + "'>" + (location_list[i]) + "</option>")
    }
    for (var i = 0; i < school_list.length; i++) {
        $("#school_select").append("<option value='" + (school_list[i]) + "'>" + (school_list[i]) + "</option>")
    }
    $('#location_select').chosen({
        width: "90%"
    });
    $('#school_select').chosen({
        width: "90%"
    });
    initialize();
});

function initialize() {
    draw_view0.initialize();
    draw_view1.initialize();
    draw_view2.initialize();
    draw_view3.initialize();
    draw_view1_select.initialize();

}


$("#location_select").change(function() {
    draw_view1.get_rectangle_data($("#location_select").val(), $("#school_select").val());
});
$("#school_select").change(function() {
    draw_view1.get_rectangle_data($("#location_select").val(), $("#school_select").val());
})