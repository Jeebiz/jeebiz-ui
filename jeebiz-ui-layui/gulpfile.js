
/*!
 Jeebiz Admin CE 构建
*/

// Package config
var pkg = require('./package.json');

// Gulp plugins
var gulp = require('gulp'),
  babel = require('gulp-babel'), //把es6语法解析成es5
  del = require('del'), // 删除文件
  concat = require('gulp-concat'), // 合并
  connect = require('gulp-connect'), // http 服务
  cssmin = require("gulp-clean-css"),
  header = require('gulp-header'),
  gulpif = require('gulp-if'),
  htmlmin = require('gulp-htmlmin'), //压缩html里面的js，css，去除空格
  minify = require('gulp-css-minify'), // css 压缩 gulp-clean-css
  minimist = require('minimist'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'), // 替换
  stripdebug = require('gulp-strip-debug'),  // remove debugging code
  uglify = require('gulp-uglify') // 压缩
  ;

var knownOptions = {
  string: ['dest','pack','env','port'],
  default: {
    dest: './dist',                     // 构建的目标目录
    pack: '../pack/jeebiz-ui-layui.pack/'+ pkg.name +'-v' + pkg.version, // 发行版本目录
    env : process.env.NODE_ENV || 'dev',  // 构建的环境
    port: 8080
  }
};

// 获取参数
var options = minimist(process.argv.slice(2), knownOptions);

// 注释
var note = [
  // '/** <%= pkg.name %>-v<%= pkg.version %> <%= pkg.license %> License */\n <%= js %>'
  ,''
  ,{pkg: pkg, js: ';'}
];

var paths = {
  styles: {
    src: ['./src/**/*.css','src/**/*.less'],
    dest: options.dest
  },
  scripts: {
    src: ['./src/**/*.js','!./src/config.js','!./src/lib/extend/**/*.js'],
    dest: options.dest
  }
};

/* 
 * 1、清理目录任务
 * Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
gulp.task("clean", gulp.series(function(cb){
  return del([options.dest + '/*'], cb);
}));

/*
 * 2、压缩 CSS 任务
 */
gulp.task('mincss', gulp.series(function(){

  var src = noteNew = JSON.parse(JSON.stringify(note));
    noteNew[1].js = '';
  
  return gulp.src(paths.styles.src)   
    .pipe(minify({
      compatibility: 'ie7'
    }))  
    .pipe(header.apply(null, noteNew))
    .pipe(gulp.dest(paths.styles.dest));

}));

/*
 * 3、压缩 JS 任务
 */
gulp.task('minjs', gulp.series(function(){
  return gulp.src(paths.scripts.src)
    .pipe(gulpif(options.env != 'dev', babel()))
    .pipe(gulpif(options.env != 'dev', stripdebug()))
    .pipe(uglify({
      output: {
        ascii_only: true //escape Unicode characters in strings and regexps
      }
    }))
    .pipe(header.apply(null, note))
    .pipe(gulp.dest(paths.scripts.dest));
}));

// 4、复制文件夹
gulp.task('copy', gulp.series(function(cb){

  gulp.src('./src/config.js').pipe(gulp.dest(options.dest));

  gulp.src('./src/lib/extend/**/*').pipe(gulp.dest(options.dest + '/lib/extend'));
  
  gulp.src('./src/style/res/**/*').pipe(gulp.dest(options.dest + '/style/res'));
  
  gulp.src('./src/views/**/*').pipe(gulp.dest(options.dest + '/views'));

  gulp.src('./layui/**').pipe(gulp.dest(options.dest + '/layui'))
  
  return gulp.src('./index.html')
      .pipe(replace(/\<\!-- clear s --\>([\s\S]*?)\<\!-- clear e --\>/, ''))
      .pipe(replace("base: '../src/'", "base: '../'"))
      .pipe(replace('@@version@@', pkg.version))
      .pipe(gulp.dest(options.dest));
  
}));

gulp.task("copy-index", gulp.series(function(cb){
  // 复制并转义宿主页面
  gulp.src('./index.html')
    .pipe(replace(/\<\!-- clear s --\>([\s\S]*?)\<\!-- clear e --\>/, ''))
    .pipe(replace("base: '../src/'", "base: '../'"))
    .pipe(replace('@@version@@', pkg.version))
    .pipe(gulp.dest(options.dest));
}));

gulp.task("reload", gulp.series(function(){
	gulp.src(options.dest + "/**/*.html").pipe(connect.reload());
}));

gulp.task("watch", gulp.series(function(){//监听任务
	gulp.watch("./index.html", gulp.series("copy-index"));
	gulp.watch(options.dest + "/**/*.*", gulp.series('reload')); // 监听dist下所有文件
}));

// gulp build --env dev     保留debug信息
// gulp build --env release 去除debug信息
// 执行多个任务gulp4的用法 gulp.series()串行，gulp.parallel()并行
gulp.task('build', gulp.series('clean', gulp.parallel('minjs','mincss'), 'copy', function(cb){

  console.log(' 编译成功!!! ');

  cb();
  
}));

// gulp run --env dev     监听src目录启动服务
// gulp run --env prod    监听dist目录启动服务
// 执行多个任务gulp4的用法 gulp.series()串行，gulp.parallel()并行
gulp.task('run', gulp.series('clean', gulp.parallel('minjs','mincss'), 'copy', "watch", function(cb){

  connect.server({
		root      : options.env != 'dev' ? options.dest : './src',
		livereload: true,
		port      : options.port
	});

}));

// 发行文件
gulp.task('release', gulp.series(function(){ //命令：gulp build --env release
  
  //复制核心文件
  gulp.src('./dist/**/*').pipe(gulp.dest(options.pack + '/dist'));
  
  gulp.src('./src/**/*').pipe(gulp.dest(options.pack + '/src'));
 
  // 复制并转义宿主页面
  gulp.src('./dev/index.html')
    .pipe(replace(/\<\!-- clear s --\>([\s\S]*?)\<\!-- clear e --\>/, ''))
    .pipe(replace('//local.res.layui.com/layui/src', 'layui'))
    .pipe(replace("base: '../dev-src/'", "base: '../dist/'"))
    .pipe(replace('@@version@@', pkg.version))
    .pipe(gulp.dest('./start'))
    .pipe(gulp.dest(options.pack + '/start'));
  
  // 复制帮助文件
  gulp.src([
    './帮助/*'
  ]).pipe(gulp.dest(releaseDir));
  
  // 复制 gulpfile
  gulp.src(['gulpfile.js','package.json']).pipe(gulp.dest(options.pack));
  
  // 复制 layui
  return gulp.src('./layui/**').pipe(gulp.dest(options.pack + '/layui'))

}));

//命令：gulp
gulp.task('default', gulp.series(function(cb){
  console.log('gulp run --env 环境名称 --port 端口号');
  cb();
}));