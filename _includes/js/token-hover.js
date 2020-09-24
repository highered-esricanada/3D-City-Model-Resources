CodeMirror.registerHelper("textHover", "javascript", function(cm, data, node) {
  var html = 'token null';
  if (data) {
    var token = data.token;
    html = 'Click to view help';
    
    html += '</br>end: ' + token.end;
    html += '</br>start: ' + token.start;
    html += '</br>string: ' + token.string;
    html += '</br>type: ' + token.type;
  
  }
  
  var result = document.createElement('div');
  result.innerHTML = html;
  return result;
});