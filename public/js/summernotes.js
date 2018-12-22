$('#summernotes').summernote({
  height: 450,
  minHeight: 300,             // set minimum height of editor
  maxHeight: 600,             // set maximum height of editor
  focus: true,   
  toolbar: [
    // [groupName, [list of button]]
    ['style', ['bold', 'italic', 'underline']],
    
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
}
});

