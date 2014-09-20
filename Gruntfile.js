module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // set base folder to skins, fails if several skins-folders
  // ToDo: refactor and move it in specific task
  grunt.file.setBase('./skins');

  // Project configuration.
  grunt.initConfig({
    buildtheme: '',
    banner: '/*!\n' +
            ' * bootswatch v3.2.0\n' +
            ' * Homepage: http://bootswatch.com\n' +
            ' * Copyright 2012-<%= grunt.template.today("yyyy") %> Thomas Park\n' +
            ' * Licensed under MIT\n' +
            ' * Based on Bootstrap\n' +
            '*/\n',
    update: {
    },
    clean: {
      build: {
        src: ['./*/build.less']
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      dist: {
        src: [],
        dest: ''
      }
    },
    less: {
      dist: {
        options: {
          compress: false
        },
        files: {}
      }
    },
    watch: {
      files: ['./*/variables.less', './*/bootswatch.less'],
      tasks: 'build',
      options: {
        livereload: true,
        nospawn: true
      }
    }
  });

  grunt.registerTask('build', 'build a regular theme', function(theme, compress) {
    theme = theme == undefined ? grunt.config('buildtheme') : theme;
    compress = compress == undefined ? true : compress;

     // cancel the build (without failing) if this directory is not a valid theme
    if (!grunt.file.exists(theme, 'variables.less') || !grunt.file.exists(theme, 'bootswatch.less')) {
      return;
    }

    var concatSrc = 'build.less';;
    var concatDest = theme + '/build.less';
    var lessDest = theme + '/bootstrap.css';
    var lessSrc = [theme + '/' + 'build.less'];
    var files = {};
    files[lessDest] = lessSrc;
    grunt.config('concat.dist', {src: concatSrc, dest: concatDest});
    grunt.config('less.dist.files', files);
    grunt.config('less.dist.options.compress', false);

    grunt.task.run(['concat', 'less:dist', 'clean:build']);
    // ToDo: update info.js
  });

  grunt.registerTask('update', 'Update all themes', function() {
    var path = require('path');
    var themes = grunt.file.expand('./*/');
    // iterate each theme and run build task
    for (var i = 0; i < themes.length; i++) {
      grunt.task.run('build:' + path.basename(themes[i]));
    }
  });

  grunt.registerTask('default', 'watch');
  grunt.event.on('watch', function(action, filepath) {
    var path = require('path');
    var theme = path.dirname(filepath);
    grunt.config('buildtheme', theme);
  });
};
