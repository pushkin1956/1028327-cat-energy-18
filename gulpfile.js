"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var server = require("browser-sync").create();
var del = require("del"); // модуль для удаления
var rename = require("gulp-rename"); // модуль для переименования
var svgstore = require("gulp-svgstore"); // модель для создания векторного спрайта
var imagemin = require("gulp-imagemin"); // Модуль для оптимизации изображений
var webp = require("gulp-webp"); // Модуль для создания WebP
var posthtml = require("gulp-posthtml"); // Модуль обработки html
var include = require("posthtml-include"); // Модель вставки в html


// Удаление файлов из build
gulp.task("clean", function () {
  return del("build");
});

// Копируем исходные файлы в build
gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/js/**",
      "source/*.ico"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso()) // минифицирует CSS scco
    .pipe(rename("style.min.css")) // переименовываем в min.файл
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css")) // Записываем в директорию
    .pipe(server.stream()); // неизвестная команда
});

// Создаем SVG спрайт
gulp.task("sprite", function () {
  return gulp.src("source/img/sprite-*.svg") // Выбрать определенные svg
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

// Вставка спрайта в html
gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

// Оптимизация изображений - npx gulp images
gulp.task("images", function () {
  return gulp.src("build/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
]))
    .pipe(gulp.dest("build/img"));
});

// Создаем WebP изображения - команда npx gulp webp
gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

// Запускаем билд
gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "sprite",
  "html",
  "images",
  "webp"
));

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/img/sprite-*.svg", gulp.series("sprite", "html", "refresh")); // добавил перезагрузку
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

// Добавил перезагрузку сервера
gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("start", gulp.series("build", "server"));
