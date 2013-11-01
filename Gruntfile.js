module.exports = function (grunt) {

  //Project config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: {
      compact: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.author %> | <%= pkg.license %> */\n',
      full: '/*!\n' +
          ' * <%= pkg.name %> v<%= pkg.version %>\n' +
          ' * Author: <%= pkg.author %>\n' +
          ' * Released under the <%= pkg.license %> license\n' +
          ' */'
    },
    clean: {
      build: [
        'dist',
        'imgcolr.html5.min.js'
      ]
    },
    concat: {
      dist: {
        options: {
          banner: '<%= banner.full %>\n(function (window, $, undefined) {',
          footer: '})(window, jQuery);',
          process: function (src, filepath) {
            if ((/define\(.*?\{/).test(src)) {
              src = src.replace(/define\(.*?\{/, '');
              src = src.replace(/\}\);\s*?$/,'');
            }
            return src;
          }
        },
        src: [
            'src/shortcut.js',
            'src/color.js',
            'src/appendFlash.js',
            'src/outer.js',
            'src/plugin.js',
            'src/amd-support.js'
        ],
        dest: 'dist/<%= pkg.name %>.js',
        nonull: true
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: [
        'dist/<%= pkg.name %>.js',
        'imgcolr.html5.js'
      ]
    },
    uglify: {
      options: {
        banner: '<%= banner.compact %>'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      html5: {
        files: {
          'imgcolr.html5.min.js': 'imgcolr.html5.js'
        }
      }
    },
    qunit: {
      options: {
        urls: ['./test/qunit/index.html']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Default task(s).
  grunt.registerTask('build', ['clean', 'concat', 'jshint', 'uglify']);
  grunt.registerTask('test', ['build', 'qunit']);
  grunt.registerTask('default', ['build']);

};