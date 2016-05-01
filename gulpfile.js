var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	jasmine = require('gulp-jasmine');

var env = {};
env.src_files = './lib/**/*.js';
env.test_files = './spec/**/*.js';
env.all_scripts = [env.src_files, env.test_files];

gulp.task('lint', function() {
	return gulp.src(env.all_scripts)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('test', function(callback) {
	var exec = require("child_process").exec;
	exec('jasmine', function(err, stdout, stderr) {
		console.log(stdout);
		console.error(stderr);
		callback();
	});

});

gulp.task('watch', [], function() {
	gulp.watch(env.all_scripts, ['lint', 'test']);
});


gulp.task('default', []);
