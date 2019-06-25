/**
 @Name: 自定义模板模块
 @Author: xiaowf
 @Date: 2019/06/14
 */
var sTemplate = {
  ver: 1.0
  , argname: 'st'
  , build:{}
};
(function() {
  'use strict';
  /*
   * 编译模板，返回模板函数
   * 参数
   *   source:  模板内容
   * 返回值
   *   模板函数
   */
  sTemplate.compile = function(source) {
    var lineflag = ' ';
    var inhtmlstr = null;
    var labelend = false;

    var ch;
    var prespace = '';
    var funcbody = 'var _result="";\n';
    for (var i=0; i<source.length; ++i) {
      ch = source[i];
      switch (ch) {
        case ' ':
        case '\t':
        case '\r':
          if (' ' == lineflag) {
            prespace += ch;
          } else {
            funcbody += ch;
          }
          break;
        case '\n':
          prespace = '';
          if ('code' == lineflag) {
            funcbody += ch;
            lineflag = ' ';
          } else if ('html' == lineflag) {
            if (labelend) {
              funcbody += '";\n';
              lineflag = ' ';
              labelend = false;
            }
          }
          break;
        case '>':
          funcbody += ch;
          if ('html' == lineflag && !inhtmlstr) {
            labelend = true;
          }
          break;
        case '<':
          if (' ' == lineflag) {
            if ('";\n' == funcbody.substring(funcbody.length-3)) {
              funcbody = funcbody.substring(0, funcbody.length-3)+/*prespace+*/'<';
            } else {
              funcbody += '_result += "'+/*prespace+*/'<';
            }
            lineflag = 'html';
            prespace = '';
            labelend = false;
          } else {
            funcbody += ch;
          }
          break;
        case "'":
        case '"':
          if ('html' == lineflag) {
            funcbody += '\\'+ch;
            if (!inhtmlstr) {
              inhtmlstr = ch;
            } else if (inhtmlstr == ch) {
              inhtmlstr = null;
            }
          } else {
            funcbody += ch;
          }
          break;
        case '\\':
          if ('html' == lineflag) {
            funcbody += '\\\\';
            if (i+1<source.length) {
              if ('"' == source[i+1] || "'" == source[i+1]) {
                funcbody += "\\"+source[i+1];
              } else {
                funcbody += source[i+1];
              }
              i++;
            }
          } else {
            funcbody += ch;
          }
          break;
        case '{':
          if ('{' == source[i+1]) {
            var j = i+2;
            var expr = '';
            for (var j=i+2; j<source.length; ++j) {
              if (source[j] == '}' && source[j+1] == '}') {
                if ('html' == lineflag) {
                  funcbody += '"+('+expr+')+"';
                } else {
                  funcbody += '_result+=('+expr+');\n';
                }
                i = j+1;
                break;
              } else {
                expr += source[j];
              }
            }
          } else {
            funcbody += ch;
          }
          break;
        default:
          funcbody += prespace+ch;
          prespace = '';
          if (' ' == lineflag) {
            lineflag = 'code';
          }
      }
    }
    funcbody += '\nreturn _result;';
    return new Function(sTemplate.argname || "st", funcbody);
  }

  /*
   * 编译模板，返回模板函数
   * 和compile的区别，会在build对象中生成函数引用
   * 参数
   *   tmpid: 模板id
   * 返回值
   *   模板函数
   */
  sTemplate.compileTmpl = function(tmpid) {
    var domnode = document.getElementById(tmpid);
    var source = domnode.innerHTML;
    return sTemplate.build['template_'+tmpid] = sTemplate.compile(source);
  }

  /*
   * 渲染模板到指定节点，会利用上次的编译结果
   * 参数
   *   tmpid: 模板id
   *   data:  渲染数据
   *   node:  节点id，可以是jquery对象
   * 返回值 无
   */
  sTemplate.renderTmplTo = function(tmpid, data, node) {
    var tmplresult = sTemplate.renderTmpl(tmpid, data);
    if ('string' === typeof tmplresult) {
      if ('string' === typeof node) {
        var domnode = document.getElementById(node);
        domnode.innerHTML = tmplresult;
      } else if (node && node.length && node.html) {
        node.html(tmplresult);
      }
    }
  }

  /*
   * 渲染模板，返回渲染内容，会利用上次的编译结果
   * 参数
   *   tmpid: 模板id
   *   data:  渲染数据
   * 返回值
   *   模板渲染结果
   */
  sTemplate.renderTmpl = function(tmpid, data) {
    var fucname = 'template_'+tmpid;
    if (sTemplate.build[fucname]) {
      return sTemplate.build[fucname](data);
    } else {
      return sTemplate.compileTmpl(tmpid)(data);
    }
  }

})();
