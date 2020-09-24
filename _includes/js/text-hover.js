(function() {
  "use strict";

  var HOVER_CLASS = " CodeMirror-hover";
  var cachedUrls = [];
  var currentUrl = "";
  function showTooltip(e, content) {
    var tt = document.createElement("div");
    tt.className = "CodeMirror-hover-tooltip";
    if (typeof content == "string") {
      content = document.createTextNode(content);
    }
    tt.appendChild(content);
    //document.body.appendChild(tt);
    
    function position(e) {
      if (!tt.parentNode)
        return CodeMirror.off(document, "mousemove", position);
      tt.style.top = Math.max(0, e.clientY - tt.offsetHeight - 5) + "px";
      tt.style.left = (e.clientX + 5) + "px";
    }
    CodeMirror.on(document, "mousemove", position);
    position(e);
    if (tt.style.opacity != null)
      tt.style.opacity = 1;
    return tt;
  }
  function rm(elt) {
    if (elt.parentNode)
      elt.parentNode.removeChild(elt);
  }
  function hideTooltip(tt) {
    if (!tt.parentNode)
      return;
    if (tt.style.opacity == null)
      rm(tt);
    tt.style.opacity = 0;
    setTimeout(function() {
      rm(tt);
    }, 600);
  }

  function showTooltipFor(e, content, node, state, cm) {
    var tooltip = showTooltip(e, content);

    function hide() {
      CodeMirror.off(node, "mouseout", hide);
      node.className = node.className.replace(HOVER_CLASS, "");
      if (tooltip) {
        hideTooltip(tooltip);
        tooltip = null;
      }
      cm.removeKeyMap(state.keyMap);
    }

    function hide2() {
      
      CodeMirror.off(node, "click", hide2);
      var iframeUrl = document.getElementById("helpFrame").src
      if (/*currentUrl.indexOf(node.outerText) != -1 &&*/ iframeUrl != currentUrl){
        document.getElementById("helpFrame").src = currentUrl;
        //document.getElementById("helpFrame").src = currentUrl;
      }
      node.className = node.className.replace(HOVER_CLASS, "");
      if (tooltip) {
        hideTooltip(tooltip);
        tooltip = null;
      }
      cm.removeKeyMap(state.keyMap);
    }

    var poll = setInterval(function() {
      if (tooltip)
        for ( var n = node;; n = n.parentNode) {
          if (n == document.body)
            return;
          if (!n) {
            hide();
            break;
          }
        }
      if (!tooltip)
        return clearInterval(poll);
    }, 400);
    CodeMirror.on(node, "mouseout", hide);
    CodeMirror.on(node, "click", hide2);
    state.keyMap = {Esc: hide};
    cm.addKeyMap(state.keyMap);
  }

  function TextHoverState(cm, options) {
    this.options = options;
    this.timeout = null;
    if (options.delay) {
      this.onMouseOver = function(e) {
        onMouseOverWithDelay(cm, e);
      };
    } else {
      this.onMouseOver = function(e) {
        onMouseOver(cm, e);
      };
    }
    this.keyMap = null;
  }

  function parseOptions(cm, options) {
    if (options instanceof Function)
      return {
        getTextHover : options
      };
    if (!options || options === true)
      options = {};
    if (!options.getTextHover)
      options.getTextHover = cm.getHelper(CodeMirror.Pos(0, 0), "textHover");
    if (!options.getTextHover)
      throw new Error(
          "Required option 'getTextHover' missing (text-hover addon)");
    return options;
  }

  function onMouseOverWithDelay(cm, e) {
    var state = cm.state.textHover, delay = state.options.delay;
    clearTimeout(state.timeout);
    if (e.srcElement) {
    	// hack for IE, because e.srcElement failed when it is used in the tiemout function
    	var newE = {srcElement: e.srcElement, clientX : e.clientX, clientY: e.clientY};
    	e = newE;
    }
    state.timeout = setTimeout(function() {onMouseOver(cm, e);}, delay);
  }

  function onMouseOver(cm, e) {
    var node = e.target || e.srcElement;
    if (node) {
      var state = cm.state.textHover, data = getTokenAndPosAt(cm, e);
      var content = state.options.getTextHover(cm, data, e);
      //ensure popup is not shown for the strings declared in condition below
      if ( content.innerHTML != "token null" && data.token.string != "" && data.token.type != "string" && data.token.type != "attribute" && data.token.type != "rule" && data.token.type != "number" && data.token.string != "true" && data.token.string != "false"){
        document.body.style.cursor = "pointer";
        node.className += HOVER_CLASS;
        var prefix = "";
        var suffix = "";
        if (data.token.string == "case" || data.token.string == "else"){
          currentUrl = "https://doc.arcgis.com/en/cityengine/latest/help/help-conditional-rule.htm";
        }
        else if (data.token.type == "comment" || data.token.type == "multilineComment"){
          currentUrl = "https://doc.arcgis.com/en/cityengine/latest/help/help-rules-comments.htm";
        }
        
        else if (data.token.string == "NIL"){
          currentUrl = "https://doc.arcgis.com/en/cityengine/latest/cga/cga-nil.htm";
        }
        else if (data.token.type == "annotation"){
          currentUrl = "https://doc.arcgis.com/en/cityengine/latest/cga/cga-annotations.htm"
        }
        else if (data.token.type != undefined){

          if(data.token.type.indexOf("_") != -1 || data.token.type.indexOf("op") != -1){
            prefix = "";
          }
          else if (data.token.type.indexOf("keyword") != -1){
            suffix = "-keyword";
          }
          else if (data.token.type.indexOf("attr") != -1){
            suffix = "-attribute";
          }
          else if (data.token.type.indexOf("func") != -1){
            suffix = "-function"; 
          }
          else if (data.token.type.indexOf("celib") != -1){
            prefix = "celib/";
          }
          else{
            prefix = data.token.type + "-";
          }
          var test = data.token.string.split(".");
          if (test.length > 0) data.token.string =  data.token.string.split(".")[0];

          //https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-sentence-case-text
          data.token.string = data.token.string.replace(/([A-Z](?=[A-Z][a-z])|[^A-Z](?=[A-Z])|[a-zA-Z](?=[^a-zA-Z]))/g, '$1-');
          currentUrl = "https://doc.arcgis.com/en/cityengine/latest/cga/cga-" + prefix + data.token.string + suffix + ".htm";
        }
       
        if (typeof content == 'function') 
	        content(showTooltipFor, data, e, node, state, cm);
        else 
          showTooltipFor(e, content, node, state, cm);        
      }
      else{
        document.body.style.cursor = "text";
      }
    }
  }

  function optionHandler(cm, val, old) {
    if (old && old != CodeMirror.Init) {
      CodeMirror.off(cm.getWrapperElement(), "mouseover",
          cm.state.textHover.onMouseOver);
      delete cm.state.textHover;
    }

    if (val) {
      var state = cm.state.textHover = new TextHoverState(cm, parseOptions(cm,
          val));
      CodeMirror.on(cm.getWrapperElement(), "mouseover", state.onMouseOver);
    }
  }

  // When the mouseover fires, the cursor might not actually be over
  // the character itself yet. These pairs of x,y offsets are used to
  // probe a few nearby points when no suitable marked range is found.
  var nearby = [ 0, 0, 0, 5, 0, -5, 5, 0, -5, 0 ];

  function getTokenAndPosAt(cm, e) {
    var node = e.target || e.srcElement, text = node.innerText
        || node.textContent;
    for ( var i = 0; i < nearby.length; i += 2) {
      var pos = cm.coordsChar({
        left : e.clientX + nearby[i],
        top : e.clientY + nearby[i + 1]
      });
      var token = cm.getTokenAt(pos);
      if (token && token.string === text) {
        return {
          token : token,
          pos : pos
        };
      }
    }
  }

  CodeMirror.defineOption("textHover", false, optionHandler); // deprecated

})();