var expect = require('chai').expect;

module.exports = (function() {

  var file;

  return {
    set: function(fileObj) {
      file = fileObj;
    },
    register: function() {
      it('should exist', function() {
        expect(file).to.be.an('object');
      });

      it('should contain custom override style definition', function() {
        // postcss-importでカスタムスタイルが正しく適用されているかの確認
        // インライン化された後は.test-override-classが直接存在しない可能性があるため
        // ミキシン定義が存在するかを確認する
        expect(file.contents.toString()).to.contain('@define-mixin styleguide_custom_styles');
      });
    }
  };

}());
