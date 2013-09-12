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
      build: ['dist']
    },
    concat: {
      dist: {
        options: {
          banner: '<%= banner.full %>\n;(function (window, $, undefined) {',
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
            'src/plugin.js'
        ],
        dest: 'dist/<%= pkg.name %>.js',
        nonull: true
      }
    },
    uglify: {
      options: {
        banner: '<%= banner.compact %>'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'concat', 'uglify']);


};