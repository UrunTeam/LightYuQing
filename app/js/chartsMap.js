function line(id,Obj) {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById(id));
  var option = {
    tooltip: {},
    legend: {
     
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    },
    yAxis: {},
    series: [{
      name: '微信',
      type: 'line',
      data: [5, 20, 36, 10, 10, 20]
    },
    {
      name: 'APP',
      type: 'line',
      data: [5, 20, 36, 20, 10, 20]
    },
    {
      name: '新闻',
      type: 'line',
      data: [5, 20, 36, 20, 10, 20]
    },
    {
      name: '微博',
      type: 'line',
      data: [5, 20, 36, 20, 10, 20]
    }
  ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}