'use strict';

module.exports = function(grunt) {

  var path        = require('path'),
      easyimage   = require('easyimage');


  return grunt.registerMultiTask('fmm-boussole', 'Fort McMoney compass indicator.', function() {

    var done        = this.async();
    var options     = this.options({ output: null, retina: false });


    // utility methods
    var getImageSize = function( filepath, callback ){
          easyimage.info( filepath, function( error, stdout, stderror ){
            callback( stdout );
          });
        },
        resizeImage = function( filepath, dest, width, height, callback ){

          var o = { src: filepath, dst: dest },
              dest_dir = path.dirname(dest);

          if( width > 0 ) o.width = width;
          if( height > 0 ) o.height = height;

          // create output directory if not exists
          if( !grunt.file.isDir( dest_dir ) ) grunt.file.mkdir( dest_dir );

          easyimage.resize( o, function( error, image, stderr ){
            if( error ) grunt.fail.warn( filepath + ' : ' + error  + ' :: ' + stderr );
            callback( dest );
          });
        },
        copyImage = function( filepath, dest, callback ){
          grunt.file.copy( filepath, dest );
          callback( dest );
        };

    // process each files
    grunt.util.async.forEach(this.data.src, function( file, next ){

      grunt.log.writeln('Create compass indicator:', options.output + file.src);

      var spritesheet = file.src,
          src         = path.dirname(spritesheet),
          extension   = path.extname(spritesheet),
          filename    = options.output + path.dirname(spritesheet) + '/' + path.basename(spritesheet, extension) + ( options.retina === true ? '@2x' : '' ) + extension,
          copyAtlas   = function(){ grunt.file.copy( file.atlas, options.output + file.atlas, next ); };

      if( options.retina === true ) copyImage( spritesheet, filename, copyAtlas );
      else getImageSize( spritesheet, function( info ){ resizeImage( spritesheet, filename, info.width * 0.5, info.height * 0.5, copyAtlas ); });

    }, done);




  });
};