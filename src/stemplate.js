/**
 @Name: 自定义模板模块
 @Author: xiaowf
 @Date: 2019/06/14
 */
'use strict';

var sTemplate = {};
(function() {
  /*
   * 编译模板，编译模板脚本为一个js函数
   * 参数
   *   fucname: 编译输出函数名
   *   source:  脚本内容
   *   argname: 模板参数名
   */
  function compileTmpl(fucname, source, argname) {
    var lineflag = ' ';
    var inhtmlstr = null;
    var labelend = false;
    var ch;
    var funcbody = 'sTemplate.'+fucname+'=function('+argname+') {\nvar _result="";\n';
    for (var i=0; i<source.length; ++i) {
      ch = source[i];
      switch (ch) {
        case ' ':
        case '\t':
        case '\r':
          funcbody += ch;
          break;
        case '\n':
          if ('code' == lineflag) {
            funcbody += ch;
            lineflag = ' ';
          } else if ('html' == lineflag) {
            funcbody += '";\n';
            if (labelend) {
              lineflag = ' ';
              labelend = false;
            } else {
              funcbody += '_result+="';
            }
          } else {
            funcbody += ch;
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
            funcbody += '_result += "<';
            lineflag = 'html';
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
                  funcbody += '";\n';
                }
                funcbody += '_result+=('+expr+');\n';
                if ('html' == lineflag) {
                  funcbody += '_result+="';
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
          funcbody += ch;
          if (' ' == lineflag) {
            lineflag = 'code';
          }
      }
    }
    funcbody += '\nreturn _result;\n};'
    eval(funcbody);
  }

  /*
   * 渲染模板到指定节点
   * 参数
   *   tmpid: 模板id
   *   data:  渲染数据
   *   node:  节点id
   */
  sTemplate.renderTmplTo = function(tmpid, data, node) {
    var tmplresult = this.renderTmpl(tmpid, data);
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
   * 渲染模板，返回渲染内容
   * 参数
   *   tmpid: 模板id
   *   data:  渲染数据
   */
  sTemplate.renderTmpl = function(tmpid, data) {
    var domnode = document.getElementById(tmpid);
    var fucname = 'template_'+tmpid;

    if (sTemplate[fucname]) {
      return sTemplate[fucname](data);
    } else {
      var argname = domnode.getAttribute('argname') || '_arg'; //默认参数名为_arg
      var source = domnode.innerHTML;
      compileTmpl(fucname, source, argname);
      return sTemplate[fucname](data);
    }
  }

})();
