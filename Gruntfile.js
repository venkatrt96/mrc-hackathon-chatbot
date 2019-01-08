const webpackConfig = require('./webpack.config.js');

module.exports = (grunt) => {
  const pkg = {
    name: 'chatbot',
    dest: 'dist/',
    static: 'dist/assets/',
    api: `${__dirname}/api/`,
    src: `${__dirname}/src`,
    archiveName: 'frontend',
  };

  const archiveMode = process.env.NODE_PKG_ARCHIVE_MODE || 'tar';

  grunt.initConfig({
    copy: {
      app: {
        files: [
          {
            expand: true,
            src: ['favicon.ico'],
            cwd: pkg.src,
            dest: pkg.static,
            flatten: true,
            filter: 'isFile',
          },
          {
            expand: true,
            src: ['auth/**', 'views/*', 'server.js', 'routes/*', 'helpers/*', 'config/*'],
            cwd: pkg.api,
            dest: `${pkg.dest}`,
          },
          {
            expand: true,
            src: ['package.json', 'env.js'],
            dest: pkg.dest,
          },
        ],
      },
    },
    compress: {
      app: {
        options: {
          mode: archiveMode,
          archive: `pkg/${pkg.name}-${process.env.NODE_ENV}.${archiveMode}`,
        },
        files: [
          {
            src: ['dist/*'], expand: true, flatten: true, dest: pkg.archiveName, filter: 'isFile',
          },
          {
            src: ['dist/routes/*'], expand: true, flatten: true, dest: `${pkg.archiveName}/routes`, filter: 'isFile',
          },
          {
            src: ['dist/auth/*'],
            expand: true,
            flatten: true,
            dest: `${pkg.archiveName}/auth`,
            filter: 'isFile',
          },
          {
            src: ['dist/auth/strategies/*'],
            expand: true,
            flatten: true,
            dest: `${pkg.archiveName}/auth/strategies`,
            filter: 'isFile',
          },
          {
            src: ['dist/helpers/*'],
            expand: true,
            flatten: true,
            dest: `${pkg.archiveName}/helpers`,
            filter: 'isFile',
          },
          {
            src: ['dist/assets/*'], expand: true, dest: `${pkg.archiveName}/assets`, flatten: true, filter: 'isFile',
          },
          {
            src: ['dist/src/*'], expand: true, dest: `${pkg.archiveName}/src`, flatten: true, filter: 'isFile',
          },
          {
            src: ['dist/config/*'], expand: true, flatten: true, dest: `${pkg.archiveName}/config`, filter: 'isFile',
          },
        ],
      },
    },
    clean: {
      app: ['dist/', 'pkg'],
    },
    webpack: {
      options: webpackConfig,
      start: {},
    },
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.registerTask('default', ['clean:app', 'copy:app', 'webpack', 'compress:app']);
};
