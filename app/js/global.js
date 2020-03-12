

$(document).ready(function(){
    //模块js初始化
    commonJs.fn.init();

});

var commonJs = $(window).commonJs || {};

commonJs.fn = {
    init : function(){
        var _this = this;
        _this.dropdown();
        // _this.icheck();
        // _this.nicescroll();

    },

    // 下拉菜单
    dropdown : function () {
        $('.dropdown').on('click','.dropdown-menu li a', function(event) {
            var txt = $(this).text();
            $(this).parents('.dropdown-menu').siblings('.dropdown-toggle')[0].childNodes[0].nodeValue = txt + ' ';
        });
    },

    // 侧边条
    nicescroll : function () {
        $(".nicescroll").niceScroll({
            cursorcolor: "#ccc",
            cursorwidth:"3px",
            cursorborder:"none"
        });
    },

    // 复选框
    icheck : function () {
        $('input').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue',
            increaseArea: '20%'
        });
    }

};

var vm_yuqing,vm_nav;
//  头部页面实例
function initHeardVue(){
     vm_yuqing = new Vue({ 
      el: '#app',
      delimiters: ['${','}'],

      data() {
        return {
            year:'',
            month:'',
            day:'',
            hours:'',
            minutes:'',
            seconds:'',
            Week:'',
            showNav:false,
            pageArr:[
                {name:'全网搜索',url:'index.html',active:false,ordenar:false,setting:false,seachInput:false,icon:'1'},
                {name:'属地舆情研判',url:'opinion_warning.html',active:true,ordenar:false,setting:false,seachInput:false,icon:'1'},
                {name:'事件跟踪',url:'index.html',active:false,ordenar:false,setting:false,seachInput:false,icon:'1'},
                {name:'订阅监控',url:'index.html',active:false,ordenar:false,setting:false,seachInput:false,icon:'1'},
                {name:'预警推送',url:'index.html',active:false,ordenar:false,setting:false,seachInput:false,icon:'1'},
            ],
            pageDetail:{},
        };
      },
      created() {
       this.pageDetail=sessionStorage.getItem('yuQingPage')?JSON.parse(sessionStorage.getItem('yuQingPage')):this.pageArr[1]
       this.setActive()
      },
      mounted(){
          let that=this
        setInterval(function(){
            that.getTime()
        },1000);
      },
      methods: {
        getTime(){
            var Week, Weekday;
            var date =  new Date();
            Week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            Weekday = date.getDay();
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.day = date.getDate();
            this.hours = date.getHours();
            this.minutes = date.getMinutes()>9?date.getMinutes():"0"+date.getMinutes();
            this.seconds = date.getSeconds()>9?date.getSeconds():"0"+date.getSeconds();
            this.week=Week[Weekday]
        },
        signOut(){
            console.log('退出登录')
        },
        checkActive(item,index){
            if(item.active) return
            this.pageArr.map(function(itemInfo,indexInfo){
                itemInfo.active=false
            })
            this.pageArr[index].active=true
            this.pageDetail=this.pageArr[index]
            location.href=item.url
            sessionStorage.setItem('yuQingPage',JSON.stringify(item))
        },
        setActive(){
            let that=this;
            this.pageArr.map(function(itemInfo,indexInfo){
                
                if(itemInfo.name!=that.pageDetail.name) itemInfo.active=false
                else itemInfo.active=true
            })
            console.log( this.pageArr)

        }
      }
    });
}

function init(){
    initHeardVue()
}

init()

  
    
    