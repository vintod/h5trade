/**
 * 公共常量类
 */
define(function (require, exports, module) {
    //自定义字典对象
    function Dictionary() {
        this.data = new Array();

        this.put = function (key, value) {
            this.data[key] = value;
        };

        this.get = function (key) {
            return this.data[key];
        };

        this.remove = function (key) {
            this.data[key] = null;
        };

        this.isEmpty = function () {
            return this.data.length == 0;
        };

        this.size = function () {
            return this.data.length;
        };
    }

    //使用 例子
//	var d = new Dictionary();
//	d.put("CN", "China");
//	d.put("US", "America");
//	document.write(d.get("CN"));
    function getBankName(key) {
        var d = new Dictionary();
        d.put("0002", "中行转帐");
        d.put("1001", "工行存管");
        d.put("1002", "中行存管");
        d.put("1003", "建行存管");
        d.put("1004", "农行存管");
        d.put("1006", "招行存管");
        d.put("1007", "兴业存管");
        d.put("1008", "平安存管");
        d.put("1009", "广发存管");
        d.put("1010", "上海存管");
        d.put("1011", "中信存管");
        d.put("1012", "交行存管");
        d.put("1013", "北京存管");
        d.put("1014", "华夏存管");
        d.put("1015", "平安存管旧");
        d.put("1016", "民生存管");
        d.put("1017", "浦发存管");
        d.put("1018", "光大存管");
        return d.get(key);
    }

    /* 暴露接口 */
    module.exports = {
        Dictionary: Dictionary,
        getBankName: getBankName

    };
});