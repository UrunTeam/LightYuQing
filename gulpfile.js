/*-----------gulp API-------------*/
//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
//gulp.dest(path[, options]) 处理完后文件生成路径
//gulp.watch(glob [, opts], tasks) 或
//gulp.watch(glob [, opts, cb])  监视文件

/*-----------Browsersync API--------------*/
//监控资源，实时刷新浏览器
// http://www.browsersync.cn/docs/api/

var gulp = require('gulp');
var browserSync = require('browser-sync').create();//.create 创建Browsersync实例
var gulpLoadPlugins = require('gulp-load-plugins');//统一加载前缀为 gulp- 的插件（如gulp-less，gulp-autoprefixer）
var c$ = gulpLoadPlugins(); //使用时（'gulp-less'对应'c$.less', 'gulp-clean-css'对应'c$.cleanCss'）
var reload = browserSync.reload;
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var runSequence = require('run-sequence');//串行执行task
var fs = require('fs');
var path = require('path');
var tplDir = './app/templates';  // 模版目录

// ----------------静态页面开发流程----------------begin
//默认任务
gulp.task('default',['server']);

//静态服务器
gulp.task('server', function() {
    runSequence('build', 'watch', function(){
        // .init 启动服务器
        browserSync.init({
            server: {
                baseDir: "./dist"
            },
            port: 8765,
            startPath: "./html/index.html",
            open: "external"
        },function(){
            gulp.watch(['dist/**','!dist/css/*.map','!dist/css/*.min.css']).on('change', reload);
        });
    });
});

// 监视源文件变化,自动编译less,自动复制html和js
gulp.task('watch', () => {
    gulp.watch(['./app/html/*.html','./app/html/*.json','./app/templates/**'], ['buildhtml']);
    gulp.watch('./app/less/**', ['buildcss']);
    gulp.watch('./app/js/*.js', ['checkjs']);
    gulp.watch('./app/images/**', ['images']);
});

//整体构建
gulp.task('build', ['buildcss', 'checkjs', 'buildhtml', 'images', 'copy']);

//编译html文件到dist
gulp.task('buildhtml', function() {
  gulp.src('./app/html/*.html')
    .pipe(c$.changed('./app/html/**', {extension:'.html'}))
    .pipe(c$.data(function (file) {
        var filePath = file.path;
        var file_json = path.join(path.dirname(filePath), path.basename(filePath, '.html') + '.json');
        //console.log(1, JSON.parse(fs.readFileSync(tplDir + '/global.json')));
        if(fs.existsSync(file_json)){
            //合并全局json 和 自身的json
            return Object.assign(JSON.parse(fs.readFileSync(tplDir + '/global.json')), {
                local: JSON.parse(fs.readFileSync( file_json ))
            });
        }
        return JSON.parse(fs.readFileSync(tplDir + '/global.json'));
    }))
    .pipe(c$.ejs().on('error', function(err) {
        console.log("Ejs Error!", err.message);
            this.end();
    }))
    .pipe(gulp.dest('./dist/html'));
});

//js语法检查
gulp.task('checkjs', function() {
    gulp.src('./app/js/*.js')
        .pipe(c$.changed('./dist/js', {extension:'.js'}))//仅监听有变化的js
        .pipe(c$.jshint())
        .pipe(c$.jshint.reporter('default'))
        .pipe(gulp.dest('./dist/js'));
});

//构建css,串行执行less和cleancss
gulp.task('buildcss', function(callback) {
    runSequence('less', 'cleancss', callback);
});

//less任务
gulp.task('less', function () {
    return gulp.src('./app/less/*.less') //该任务针对的文件
        .pipe(c$.sourcemaps.init())
        .pipe(c$.less()) //该任务调用的模块
        .on('error', function(err) {
            console.log("Less Error!", err.message);
            this.end();
        })
        .pipe(c$.autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true
            remove: false //是否去掉不必要的前缀 默认：true
        }))
        .pipe(c$.sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css')); //将会在dist/css下生成main.css
});

//压缩css
gulp.task('cleancss', function() {
    return gulp.src(['./dist/css/*.css','!./dist/css/*.min.css'])//只选出dist/css中不含有.min.css的文件
        .pipe(c$.cleanCss())
        .pipe(c$.rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'));
});

// 图片优化
gulp.task('images', function(){
  return gulp.src('./app/images/**')
    // .pipe(c$.imagemin({
    //   progressive: true,
    //   interlaced: true
    // }))
    .pipe(gulp.dest('./dist/images'));
});

// 拷贝前端资源
gulp.task('copy', function(){
    gulp.src([
      './app/libs/bootstrap/dist/js/bootstrap.min.js',
      '!./app/libs/bootstrap/dist/js/npm.js'
    ])
    .pipe(gulp.dest('./dist/libs/bootstrap/dist'));

    gulp.src([
      './app/libs/jquery/jquery.js',
      './app/libs/jquery/jquery.min.js',
      './app/libs/jquery/jquery.min.map'
    ])
    .pipe(gulp.dest('./dist/libs/jquery'));

    gulp.src([
      './app/libs/echarts/**'
    ])
    .pipe(gulp.dest('./dist/libs/echarts'));

    gulp.src([
      './app/fonts/**'
    ])
    .pipe(gulp.dest('./dist/fonts'));

    // gulp.src([
    //   './app/libs/countUp/dist/countUp.min.js'
    // ])
    // .pipe(gulp.dest('./dist/libs/countUp/dist'));

    gulp.src([
      './app/libs/nicescroll/**'
    ])
    .pipe(gulp.dest('./dist/libs/nicescroll'));

    gulp.src([

      './app/libs/icheck/icheck.min.js'
    ])
    .pipe(gulp.dest('./dist/libs/icheck'));

    gulp.src([
      './app/libs/icheck/skins/**'
    ])
    .pipe(gulp.dest('./dist/libs/icheck/skins'));

    //  gulp.src([
    //   './app/libs/datetimepicker/**'
    // ])
    // .pipe(gulp.dest('./dist/libs/datetimepicker'));
    
    // gulp.src([
    //   './app/libs/jquery.paging/**'
    // ])
    // .pipe(gulp.dest('./dist/libs/jquery.paging'));



});
// ----------------静态页面开发流程----------------end

