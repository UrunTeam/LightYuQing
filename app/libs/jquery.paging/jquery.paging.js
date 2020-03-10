/*
 * author: maoyingcai
 * Date: 2018-11-28
 * Time: 16:49:55
 * Contact: 619631130@qq.com
 */
(function (root, factory) {
  //amd
  if (typeof define === 'function' && define.amd) {
    define(['$'], factory);
  } else if (typeof exports === 'object') { //umd
    module.exports = factory();
  } else {
    root.Query = factory(window.Zepto || window.jQuery || $);
  }
})(this, function ($) {
  var Query = {
    getQuery: function (name, type, win) {
      var reg = new RegExp("(^|&|#)" + name + "=([^&]*)(&|$|#)", "i");
      win = win || window;
      var Url = win.location.href;
      var u, g, StrBack = '';
      if (type == "#") {
        u = Url.split("#");
      } else {
        u = Url.split("?");
      }
      if (u.length == 1) {
        g = '';
      } else {
        g = u[1];
      }
      if (g != '') {
        gg = g.split(/&|#/);
        var MaxI = gg.length;
        str = arguments[0] + "=";
        for (i = 0; i < MaxI; i++) {
          if (gg[i].indexOf(str) == 0) {
            StrBack = gg[i].replace(str, "");
            break;
          }
        }
      }
      return decodeURI(StrBack);
    },
    getForm: function (form) {
      var result = {},
        tempObj = {};
      $(form).find('*[name]').each(function (i, v) {
        var nameSpace,
          name = $(v).attr('name'),
          val = $.trim($(v).val()),
          tempArr = [];
        if (name == '' || $(v).hasClass('getvalued')) {
          return;
        }

        if ($(v).data('type') == "money") {
          val = val.replace(/\,/gi, '');
        }

        //处理radio add by yhx  2014-06-18
        if ($(v).attr("type") == "radio") {
          var tempradioVal = null;
          $("input[name='" + name + "']:radio").each(function () {
            if ($(this).is(":checked"))
              tempradioVal = $.trim($(this).val());
          });
          if (tempradioVal) {
            val = tempradioVal;
          } else {
            val = "";
          }
        }

        if ($(v).attr("type") == "checkbox") {
          var tempradioVal = [];
          $("input[name='" + name + "']:checkbox").each(function () {
            if ($(this).is(":checked"))
              tempradioVal.push($.trim($(this).val()));
          });
          if (tempradioVal.length) {
            val = tempradioVal.join(',');
          } else {
            val = "";
          }
        }

        if ($(v).attr('listvalue')) {
          if (!result[$(v).attr('listvalue')]) {
            result[$(v).attr('listvalue')] = [];
            $("input[listvalue='" + $(v).attr('listvalue') + "']").each(function () {
              if ($(this).val() != "") {
                var name = $(this).attr('name');
                var obj = {};
                if ($(this).data('type') == "json") {
                  obj[name] = JSON.parse($(this).val());
                } else {
                  obj[name] = $.trim($(this).val());
                }
                if ($(this).attr("paramquest")) {
                  var o = JSON.parse($(this).attr("paramquest"));
                  obj = $.extend(obj, o);
                }
                result[$(v).attr('listvalue')].push(obj);
                $(this).addClass('getvalued');
              }
            });
          }
        }

        if ($(v).attr('arrayvalue')) {
          if (!result[$(v).attr('arrayvalue')]) {
            result[$(v).attr('arrayvalue')] = [];
            $("input[arrayvalue='" + $(v).attr('arrayvalue') + "']").each(function () {
              if ($(this).val() != "") {
                var obj = {};
                if ($(this).data('type') == "json") {
                  obj = JSON.parse($(this).val());
                } else {
                  obj = $.trim($(this).val());
                }
                if ($(this).attr("paramquest")) {
                  var o = JSON.parse($(this).attr("paramquest"));
                  obj = $.extend(obj, o);
                }
                result[$(v).attr('arrayvalue')].push(obj);
              }
            });
          }
        }
        if (name == '' || $(v).hasClass('getvalued')) {
          return;
        }
        //构建参数
        if (name.match(/\./)) {
          tempArr = name.split('.');
          nameSpace = tempArr[0];
          if (tempArr.length == 3) {
            tempObj[tempArr[1]] = tempObj[tempArr[1]] || {};
            tempObj[tempArr[1]][tempArr[2]] = val;
          } else {
            if ($(v).data('type') == "json") {
              tempObj[tempArr[1]] = JSON.parse(val);
              if ($(v).attr("paramquest")) {
                var o = JSON.parse($(v).attr("paramquest"));
                tempObj[tempArr[1]] = $.extend(tempObj[tempArr[1]], o);
              }
            } else {
              tempObj[tempArr[1]] = val;
            }
          }
          if (!result[nameSpace]) {
            result[nameSpace] = tempObj;
          } else {
            result[nameSpace] = $.extend({}, result[nameSpace], tempObj);
          }
        } else {
          result[name] = val;
        }

      });
      var obj = {};
      for (var o in result) {
        var v = result[o];
        if (typeof v == "object") {
          obj[o] = JSON.stringify(v);
        } else {
          obj[o] = result[o]
        }
      }
      $('.getvalued').removeClass('getvalued');
      return obj;
    },
    setHash: function (obj) {
      var str = '';
      obj = $.extend(this.getHash(), obj)
      var arr = [];
      for (var v in obj) {
        if (obj[v] != '') {
          arr.push(v + '=' + encodeURIComponent(obj[v]));
        }
      }
      str += arr.join('&');
      location.hash = str;
      return this;
    },
    getHash: function (name) {
      if (typeof name === "string") {
        return this.getQuery(name, "#");
      } else {
        var obj = {};
        var hash = location.hash;
        if (hash.length > 0) {
          hash = hash.substr(1);
          var hashArr = hash.split('&');
          for (var i = 0, l = hashArr.length; i < l; i++) {
            var a = hashArr[i].split('=');
            if (a.length > 0) {
              obj[a[0]] = decodeURI(a[1]) || '';
            }
          }
        }
        return obj;
      }
    }
  };
  return Query;
});


(function (root, factory) {
  //amd
  if (typeof define === 'function' && define.amd) {
    define(['$', 'query'], factory);
  } else if (typeof exports === 'object') { //umd
    module.exports = factory();
  } else {
    root.Paging = factory(window.Zepto || window.jQuery || $, Query);
  }
})(this, function ($, Query) {
  $.fn.Paging = function (settings) {
    var arr = [];
    $(this).each(function () {
      var options = $.extend({
        target: $(this)
      }, settings);
      var lz = new Paging();
      lz.init(options);
      arr.push(lz);
    });
    return arr;
  };

  function Paging() {
    var rnd = Math.random().toString().replace('.', '');
    this.id = 'Paging_' + rnd;
  }
  Paging.prototype = {
    init: function (settings) {
      this.settings = $.extend({
        dom: { // 根据参数显示需要的dom
          pageno: true, // 页码：1、2、3、4、5
          pagesize: true, // 每页显示多少条
          datacount: true, // 数据总数
          pagecount: true, // 页码总数
          pagebtn: true, // 上一页，下一页按钮
          pagefirst: false, // 首页按钮
          pagelast: false, // 尾页按钮
          fastgo: true, // 快速跳转
        },
        callback: null,
        theme: "", // 默认的主题名称
        pagesize: 10, // 必传参数
        current: 1,// 必传参数
        prevTpl: "上一页", // 上一页按钮的文本 << &laquo;
        nextTpl: "下一页", // 下一页按钮的文本 >> &raquo;
        firstTpl: "首页",
        lastTpl: "尾页",
        ellipseTpl: "...",
        hash: false,
        pageSizeList: [10, 20, 30, 40, 50]
      }, settings);
      this.target = $(this.settings.target);
      // this.pagerStyle1();
      this.page_box = $('<div class="pager-cnt ' + this.settings.theme + '" onselectstart="return false;"></div>');
      this.container = $('<div id="' + this.id + '" class="ui-paging-container"></div>');
      this.page_box.html(this.container);
      this.target.append(this.page_box);
      this.render(this.settings);
      this.format();
      this.bindEvent();
    },

    render: function (ops) {
      this.count = ops.count || this.settings.count;
      this.pagesize = ops.pagesize || this.settings.pagesize;
      this.current = ops.current || this.settings.current;
      this.pagecount = Math.ceil(this.count / this.pagesize);
      this.format();
    },
    bindEvent: function () {
      var _this = this;
      this.container.on('click', 'li.js-page-action,li.ui-pager', function (e) {
        if ($(this).hasClass('ui-pager-disabled') || $(this).hasClass('focus')) {
          return false;
        }
        if ($(this).hasClass('js-page-action')) {
          if ($(this).hasClass('js-page-first')) {
            _this.current = 1;
          }
          if ($(this).hasClass('js-page-prev')) {
            _this.current = Math.max(1, _this.current - 1);
          }
          if ($(this).hasClass('js-page-next')) {
            _this.current = Math.min(_this.pagecount, _this.current + 1);
          }
          if ($(this).hasClass('js-page-last')) {
            _this.current = _this.pagecount;
          }
        } else if ($(this).data('page')) {
          _this.current = parseInt($(this).data('page'));
        }
        _this.go();
      });
      /*
      $(window).on('hashchange',function(){
      	var page=  parseInt(Query.getHash('page'));
      	if(_this.current !=page){
      		_this.go(page||1);
      	}
      })
       */
    },
    go: function (p) {
      var _this = this;
      this.current = p || this.current;
      this.current = Math.max(1, _this.current);
      this.current = Math.min(this.current, _this.pagecount);
      this.format();
      if (this.settings.hash) {
        Query.setHash({
          page: this.current
        });
      }
      this.settings.callback && this.settings.callback(this.current, this.pagesize, this.pagecount);
    },
    changePagesize: function (ps) {
      this.render({
        pagesize: ps
      });
    },

    renderDataCount: function () {
      var str = "";
      if (this.settings.dom.datacount != false) {
        str = '<li class="ui-pagging-lis data-count">共' + this.settings.count + '条</li>';
      }
      return str;
    },

    renderPageCount: function () {
      var str = "";
      if (this.settings.dom.pagecount != false) {
        str = '<li class="ui-pagging-lis page-count">第' + this.current + '/' + this.pagecount + '页</li>';
      }
      return str;
    },

    renderPageFirst: function () {
      var str = "";
      if (this.settings.dom.pagefirst && this.settings.dom.pagefirst != undefined) {
        str = '<li class="ui-pagging-lis js-page-first js-page-action ui-pager" >' + this.settings.firstTpl + '</li>';
      }
      return str;
    },

    renderPageLast: function () {
      var str = "";
      if (this.settings.dom.pagelast && this.settings.dom.pagelast != undefined) {
        str = '<li class="ui-pagging-lis js-page-last js-page-action ui-pager">' + this.settings.lastTpl + '</li>';
      }
      return str;
    },

    renderPageBtnPrev: function () {
      var str = "";
      var btn_str = this.settings.prevTpl;
      if (this.settings.dom.pageno == false) {
        btn_str = "上一页";
      }
      if (this.settings.dom.pagebtn != false) {
        str = '<li class="ui-pagging-lis js-page-prev js-page-action ui-pager">' + btn_str + '</li>';
      }
      return str;
    },

    renderPageBtnNext: function () {
      var str = "";
      var btn_str = this.settings.nextTpl;
      if (this.settings.dom.pageno == false) {
        btn_str = "下一页";
      }
      if (this.settings.dom.pagebtn != false) {
        str = '<li class="ui-pagging-lis js-page-next js-page-action ui-pager">' + btn_str + '</li>';
      }
      return str;
    },

    renderPageNumber: function () {
      var html = "";
      if (this.settings.dom.pageno != false) {
        if (this.pagecount > 6) {
          html += '<li data-page="1" class="ui-pager">1</li>';
          if (this.current <= 4) {
            html += '<li data-page="2" class="ui-pager">2</li>';
            html += '<li data-page="3" class="ui-pager">3</li>';
            html += '<li data-page="4" class="ui-pager">4</li>';
            html += '<li data-page="5" class="ui-pager">5</li>';
            html += '<li class="ui-pagging-lis ui-paging-ellipse">' + this.settings.ellipseTpl + '</li>';
          } else if (this.current > 4 && this.current <= this.pagecount - 3) {
            html += '<li class="ui-pagging-lis ui-paging-ellipse">' + this.settings.ellipseTpl + '</li>';
            html += '<li data-page="' + (this.current - 1) + '" class="ui-pager">' + (this.current - 1) + '</li>';
            html += '<li data-page="' + this.current + '" class="ui-pager">' + this.current + '</li>';
            html += '<li data-page="' + (this.current + 1) + '" class="ui-pager">' + (this.current + 1) + '</li>';
            html += '<li data-page="' + (this.current + 2) + '" class="ui-pager">' + (this.current + 2) + '</li>';
            html += '<li class="ui-pagging-lis ui-paging-ellipse">' + this.settings.ellipseTpl + '</li>';
          } else {
            html += '<li class="ui-pagging-lis ui-paging-ellipse">' + this.settings.ellipseTpl + '</li>';
            for (var i = this.pagecount - 2; i < this.pagecount; i++) {
              html += '<li data-page="' + i + '" class="ui-pager">' + i + '</li>'
            }
            html += '<li data-page="' + this.pagecount + '" class="ui-pager">' + this.pagecount + '</li>';
          }
          // html += '<li data-page="' + this.pagecount + '" class="ui-pager">' + this.pagecount + '</li>';
        } else {
          for (var i = 1; i <= this.pagecount; i++) {
            html += '<li data-page="' + i + '" class="ui-pager">' + i + '</li>'
          }
        }
      }
      return html;
    },

    renderDom: function () {
      var str = "";

      str = '\
<ul>\
' + this.renderDataCount() + '\
' + this.renderPageCount() + '\
' + this.renderPageFirst() + '\
' + this.renderPageBtnPrev() + '\
' + this.renderPageNumber() + '\
' + this.renderPageBtnNext() + '\
' + this.renderPageLast() + '\
</ul>';

      this.container.html(str);

      if (this.settings.dom.pagesize || this.settings.dom.pagesize == undefined) {
        this.bindToolbar();
      }
      if (this.settings.dom.fastgo || this.settings.dom.fastgo == undefined) {
        this.bindFastGo();
      }
    },

    format: function () {
      this.renderDom();
      if (this.current == 1) {
        $('.js-page-prev', this.container).addClass('ui-pager-disabled');
        $('.js-page-first', this.container).addClass('ui-pager-disabled');
      }
      if (this.current == this.pagecount) {
        $('.js-page-next', this.container).addClass('ui-pager-disabled');
        $('.js-page-last', this.container).addClass('ui-pager-disabled');
      }
      this.container.find('li[data-page="' + this.current + '"]').addClass('focus').siblings().removeClass('focus');
    },
    bindToolbar: function () {
      var _this = this;
      var html = $('<li class="ui-pagging-lis ui-paging-toolbar"><div class="ui-select-pagesize dropdown"><button class="u-btn dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">10 </button><ul class="dropdown-menu"></ul></div></li>');
      var sel = $('.ui-select-pagesize .dropdown-menu', html);
      var drop = $('.ui-select-pagesize .u-btn',html);
      var str = '';
      for (var i = 0, l = this.settings.pageSizeList.length; i < l; i++) {
        str += '<li><a href="javascript:;" data-val="' + this.settings.pageSizeList[i] + '">' + this.settings.pageSizeList[i] + '条</a></li>';
      }
      sel.html(str);
      drop.attr('data-val',this.pagesize);
      drop.html(this.pagesize+'条<span class="caret"></span>');
      sel.on('click','li a',function(){
      	_this.changePagesize($(this).attr('data-val'));
      	_this.go(1);
      })
//    sel.val(this.pagesize);
//    sel.on("change", function () {
//      _this.changePagesize($(this).val());
//      _this.go(1);
//    });
      
      
      html.appendTo(this.container.children('ul'));
    },
    bindFastGo: function () {
      var _this = this;
      var html = $('<li class="ui-pagging-lis ui-paging-toolbar"><span>快速翻页</span><input type="text" class="inp-gofast"/><div class="btn-dogo">确认</div></li>');
      $('input.inp-gofast', html).val(this.current);
      $('input.inp-gofast', html).click(function () {
        //$(this).select(); //点击输入框选中文本
      }).keydown(function (ev) {
        if (ev.keyCode == 13) {
          var current = parseInt($(this).val()) || 1;
          _this.go(current);
        }
      });
      $('.btn-dogo', html).click(function () {
        var current = parseInt($(this).prev().val()) || 1;
        _this.go(current);
      });
      html.appendTo(this.container.children('ul'));
    },

    pagerStyle1: function () {
      /* *********************\
              新分页样式\
      ********************* */
      var style_str = '\
<style>\
.ui-paging-container {\
    color: #666;\
    font-size: 14px;\
    -moz-user-select: none;\
}\
.ui-paging-container ul {\
    overflow: hidden;\
    text-align: center;\
}\
.ui-paging-container ul,\
.ui-paging-container li {\
    list-style: none;\
}\
.ui-paging-container li {\
    display: inline-block;\
    vertical-align: middle;\
    padding: 3px 6px;\
    margin-left: 5px;\
    color: #666;\
}\
.ui-paging-container li.ui-pager {\
    cursor: pointer;\
    border: 1px solid #396F9B;\
    border-radius: 3px;\
    font-size: 12px;\
    color: #444;\
}\
.ui-paging-container li.ui-pager:hover,\
.ui-paging-container li.focus {\
    background: #396F9B;\
    border: 1px solid #396F9B;\
    border-radius: 3px;\
    color: #FFFFFF;\
}\
.ui-paging-container li.ui-paging-ellipse {\
    border: none;\
}\
.ui-paging-container li.ui-paging-toolbar {\
    padding: 0;\
    margin-left: 10px;\
}\
.ui-paging-container li.ui-paging-toolbar select option {\
    font-size: 12px;\
    color: #444;\
}\
.ui-paging-container li.ui-paging-toolbar select {\
    border: 1px solid #396F9B;\
    border-radius: 4px;\
    font-size: 12px;\
    color: #396F9B;\
    display: inline-block;\
    vertical-align: middle;\
    padding: 4px 2px;\
}\
.ui-paging-container li.ui-paging-toolbar span {\
    display: inline-block;\
    vertical-align: middle;\
}\
.ui-paging-container li.ui-paging-toolbar input.inp-gofast {\
    padding: 0 4px;\
    border: 1px solid #ddd;\
    text-align: center;\
    width: 60px;\
    border-radius: 2px;\
    margin: 0 0 0 5px;\
    display: inline-block;\
    vertical-align: middle;\
}\
.ui-paging-container .btn-dogo {\
    display: inline-block;\
    vertical-align: middle;\
    margin-left: 5px;\
    border: 1px solid #ddd;\
    padding: 4px 12px;\
    border-radius: 2px;\
    background: #fff;\
    cursor: pointer;\
    color: #666;\
}\
.ui-paging-container li.ui-pager-disabled,\
.ui-paging-container li.ui-pager-disabled:hover {\
    background-color: #f5f5f5;\
    cursor: default;\
    border: none;\
    color: #999;\
}\
</style>';
      this.target.append(style_str);
    },
  }
  return Paging;
});