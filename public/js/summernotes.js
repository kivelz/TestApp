  $('#summernotes').summernote({
    height: 450,
    minHeight: 300,             // set minimum height of editor
    maxHeight: 600,             // set maximum height of editor
    focus: true,   
    toolbar: [
      // [groupName, [list of button]]
      ['style', ['none']],
      
    ],
    cleaner:{
      action: 'both', // both|button|paste 'button' only cleans via toolbar button, 'paste' only clean when pasting content, both does both options.
      newline: '<br>', // Summernote's default is to use '<p><br></p>'
      notStyle: 'position:absolute;top:0;', // Position of Notification
      icon: '<i class="note-icon">[Your Button]</i>',
      keepHtml: true, // Remove all Html formats
      keepOnlyTags: ['<p>', '<br>', '<ul>', '<li>', '<b>', '<strong>','<i>'], // If keepHtml is true, remove all tags except these
      keepClasses: false, // Remove Classes
      badTags: ['style', 'script', 'applet', 'embed', 'noframes', 'noscript', 'html'], // Remove full tags with contents
      badAttributes: ['style', 'start'], // Remove attributes from remaining tags
      limitChars: false, // 0/false|# 0/false disables option
      limitDisplay: 'both', // text|html|both
      limitStop: false // true/false
  },
  placeholder: 'Write decription of your shop',
  callbacks: {
      onKeydown: function (e) { 
          var t = e.currentTarget.innerText; 
          if (t.trim().length >= 2500) {
              //delete keys, arrow keys, copy, cut
              if (e.keyCode != 8 && !(e.keyCode >=37 && e.keyCode <=40) && e.keyCode != 46 && !(e.keyCode == 88 && e.ctrlKey) && !(e.keyCode == 67 && e.ctrlKey))
              e.preventDefault(); 
          } 
      },
      onKeyup: function (e) {
          var t = e.currentTarget.innerText;
          $('#maxContentPost').text(2500 - t.trim().length);
      },
      onPaste: function (e) {
          var t = e.currentTarget.innerText;
          var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
          e.preventDefault();
          var maxPaste = bufferText.length;
          if(t.length + bufferText.length > 2500){
              maxPaste = 2500 - t.length;
          }
          if(maxPaste > 0){
              document.execCommand('insertText', false, bufferText.substring(0, maxPaste));
          }
          $('#maxContentPost').text(2500 - t.length);
      }
  }
});
;