var gulp = require("gulp"),
	webserver = require("gulp-webserver"),
	notify = require("gulp-notify"),
	babelify = require("babelify"),
	sourcemaps = require("gulp-sourcemaps"),
	browserify = require("browserify"),
	watchify = require("watchify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	gutil = require("gulp-util"),
	stringify = require("stringify");

gulp.task("js", function() {
	return gulp.src("src/js/**/*.js")
		.pipe(gulp.dest("bin/js/"));
});

gulp.task("js", function() { return buildJS(); });

function handleError(error) {
	notify.onError({
		title: "Build Error!",
		message: "<%= error.message %>"
	})(error);

	this.emit("end");
}

function buildJS(watch) {
	var browserifyInstance = browserify({
			entries: ["src/js/main.js"],
			debug: true,
			cache: {},
		    packageCache: {},
		    fullPaths: watch
		}).transform("stringify", {
	        appliesTo: { includeExtensions: [".vert", ".frag", ".glsl"] }
	    }).transform("babelify", {
			presets: ["es2015"]
		});

	var b = watch ? watchify(browserifyInstance) : browserifyInstance;

 	var build = function() {
		return b.bundle()
			.on("error", handleError)
			.pipe(source("main.js"))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sourcemaps.write("."))
			.pipe(gulp.dest("bin/js/"));
	}

	if (watch) {
		b.on("update", function() {
			gutil.log("Rebundling...");
			build();
		});
		b.on("log", function(e) {
			gutil.log("Bundling Successful: " + gutil.colors.gray(e));
		});
	}

	return build();
}

gulp.task("html", function() {
	return gulp.src("src/html/**/*.html")
		.pipe(gulp.dest("bin/"));
});

gulp.task("images", function() {
	return gulp.src("images/**/*")
		.pipe(gulp.dest("bin/images/"));
});

gulp.task("watch", ["html"], function() {
	gulp.watch("src/html/**/*.html", ["html"]);
	gulp.watch("images/**/*", ["images"]);
	buildJS(true);

	gulp.src("bin")
		.pipe(webserver({
			livereload: true,
			open: true
		}));
});

gulp.task("default", ["js", "html", "images"]);
