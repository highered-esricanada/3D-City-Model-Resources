    function create(htmlStr) {
      var frag = document.createDocumentFragment();
      var temp = document.createElement('form');
      temp.innerHTML = htmlStr;
      while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
      }
      return frag;
    }

	function initEditor(){
		var fragment = create('<textarea id="code" name="code"></textarea>');
		document.body.insertBefore(fragment, document.body.childNodes[0]);
    
  

		this.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
			lineNumbers: true,
			scrollbarStyle: "simple",
			theme: "eiffel",
      textHover: true,
			value:CodeMirror.defineSimpleMode("simplemode", {
        // The start state contains the rules that are intially used
        start: [
          
          {regex: /(?=[^#]*)(#.*)/, token: "comment"},
          {regex: /\/\/.*/, token: "comment"},
          // A next property will cause the mode to move to a different state
          {regex: /\/\*/, token: "multilineComment", next: "multilineComment"},
          // The regex matches the token, the token property contains the type
          {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
          // Rules are matched in the order in which they appear
          {regex: /(^|\W|\s+)(comp\.(sel|index|total))(\W|\s|$)/, token: [null, "attr",null]},
          {regex: /(^|\W|\s+)(i|comp|extrude|envelope|color|taper|roofGable|roofHip|roofPyramid|roofShed|innerRectangle|split|splitArea|offset|setback|shape(L|U|O)|scatter|cleanupGeometry|convexify|deleteHoles|(reverse|set|soften)Normals|mirror|reduceGeometry|trim|texture|setupProjection|(project|translate|scale|normalize|tile|rotate|delete)UV|t|translate|s|r|rotate|center|alignScopeTo(Axes|Geometry)|(rotate|mirror)Scope|setPivot|set|report|print|primitive(Quad|Disk|Cube|Sphere|Cylinder|Cone))(\()/, token: [null, "op",null]},
          {regex: /(^|\W|\s+)(initialShape\.(name|startRule|origin\.[po][xyz])|material\.((colormap|bumpmap|dirtmap|specularmap|opacitymap|normalmap)(\.([st][uv]|rw))?|name|shader|color\.([rgb]|rgb)|ambient\.[rgb]|specular\.[rgb]|opacity|reflectivity|shininess|bumpValue)|pivot\.(p|o)(x|y|z)|scope\.([trs][xyz]|elevation)|seedian|split\.(index|total)|trim\.(horizontal|vertical))(\W|\s|$)/, token: [null, "attr",null]},
          {regex: /(^|\W|\s+)(assetsSort(Ratio|Size)|abs|acos|asin|atan|atan2|ceil|cos|exp|floor|isinf|isnan|ln|log10|pow|rint|sin|sqrt|tan|p|rand|isNull|count|find|len|substring|geometry\.(dv|du|angle|area|isClosedSurface|height|isConcave|isInstanced|isOriented|isPlanar|isRectangular|nEdges|nFaces|nHoles|volume|instanceID|nVertices|[vu](Min|Max))|file(Exists|Search)|asset(Info|SortRatio|SortSize|NamingInfo)|image(Info|sSortRatio)|inside|overlaps|touches|convert|getGeoCoord|getTreeKey|print|minimumDistance|contextCompare|contextCount)(\s*\()/, token: [null, "func",null]},
          {regex: /(^|\W|\s+)(find(First|Last)|get(Prefix|Range|Suffix)|replace|list(Add|Clean|Count|First|Index|Item|Last|Random|Range|Remove|RemoveAll|RetainAll|Size|Terminate)|asset(ApproxRatio|ApproxSize|BestRatio|BestSize|FitSize)|file(Basename|Directory|Extension|Name|Random)|image(ApproxRatio|BestRatio)|color(HexTo(B|G|H|O|R|S|V)|HSVToHex|HSVOToHex|Ramp)|colorHSV(OToHex|ToHex)|clamp|min|max)(\s*\()/, token: [null, "celib",null]},
          {regex: /(^|\s+)(bool)(\s*)/,token: [null,"funcPurple", null]},
          {regex: /(^|\s+)(float|sel|str)(\s*\()/, token:[null, "funcPurple", null]},
          {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number"},
          {regex: /(\s*attr)(\s*)(\w*)(\s*=\s*)/, token: ["keyword", null, "attribute", null], sol:true},	
          {regex: /(\s+|^)(case|true|false|NIL|else|version|style|import)(\W|\s+|$)/,token: [null,"keyword", null]},
          {regex: /(\s*attr)(\s*)(\w*\s*)(=)/, token: ["keyword", null, "attribute", null], sol:true},	
          {regex: /(\s*const)(\s*)(\w*\s*)(=)/, token: ["keyword", null, null, null], sol:true},
          {regex: /(@\w+)(?=\(?[^\(]*\)?)/, token: "annotation"},
          {regex: /(^|\w+)(\s*)(-->)/, token: ["rule", null, null]},
          {regex: /(\s*\w+)(?=\s*\([^\(]*\)?)/, token: "rule"},
          {regex: /(\s*\w+)(\s*=)/, token: ["rule", null], sol:true},
          {regex: /\s*\w+\s*\.?\s*$/, token: "rule", sol: true},
          //{regex: /(\w+)(\()/, token: [ "rule", null]},
          
       
       ],
        // The multi-line comment state.
        multilineComment: [
          {regex: /.*?\*\//, token: "multilineComment", next: "start"},
          {regex: /.*/, token: "multilineComment"}
        ],
        // The meta property contains global information about the mode. It
        // can contain properties like lineComment, which are supported by
        // all modes, and also directives like dontIndentStates, which are
        // specific to simple modes.
        meta: {
          dontIndentStates: ["comment"],
          lineComment: "//"
        }
        }),
        mode: "simplemode"
		});
		editor.setSize("50%",window.innerHeight - 12);
  }
