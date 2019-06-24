## sTemplate

#### 介绍
Simple-Template(sTemplate)，支持原生js脚本和HTML代码混排的简单/高效JS模板引擎

1. 简单编写。支持原生js脚本和HTML混排，几乎不需要学习额外的模板语法，便于阅读和维护<br/>
2. 高效性能。和其他大多数模板引擎不同，sTemplate没有采用正则解析，而是以有穷状态机的方式直接解析/编译模板，性能上有足够的保证。<br/>
经本人不全面的测试用例验证，性能高出art-template大约25%以上(在不同机器和浏览器上结果可能不同，仅参考)

#### 设计初衷
之前使用过的js模板引擎，对其中的js脚本都进行了额外的语法定义，例如<br/>
art-template的循环<br/>
```
	{{each children item idx}}
	...
	{{/each}}
```
layui-template实现一个if处理
```
	{{#  if(d.list.length === 0){ }}
	...  
	{{#  } }} 
```
等等
当逻辑比较复杂的时候，这些额外的js模板语法会导致可读性比较差。
就想，为什么不能直接使用原生的js脚本呢？
经过努力并实现，也就是大家现在看到的sTemplate(Simple-Template)

本组件将不会追求功能的全面性，只突出简单应用和高效结果
如有问题和建议请联系QQ：87421296

#### 使用说明

1. 引入js文件
`<script src="stemplate.js"></script>`

2. 编写模板
自定义属性`argname`定义了模板参数的名字，下例中是`d`，如果不定义`argname`，默认的模板参数变量名是`_arg`
模板参数的类型可以是任意有效的js类型，不限于对象和数组
html中嵌入js表达式，请用一对{{ }}括起来，表达式的语法也是js原生的，可直接引用模板外部定义的用户函数和js全局/对象函数<br/>

```
<script type="text/html" id='xtest' argname='d'>
  d = d || [];
  for (var i in d.children) {
    var item1 = d.children[i];
    <h2 class="title">{{ item1.menuname }}</h2>
    <div class="item">
      for (var j in item1.children) {
        var item2 = item1.children[j];
        <dl>
          <dt>{{ item2.menuname }}</dt>
          <dd>
            <ul>
              for (var k in item2.children) {
                var item3 = item2.children[k];
                <li>{{item3.menuname}}</li>
              }
            </ul>
          </dd>
        </dl>
      }
    </div>
  }
</script>
```

3. 渲染模板
传统的写法是
```
var domnode = document.getElementById('node');
domnode.innerHTML = sTemplate.renderTmpl('xtest', data);
```
或者用下面一句代替，用data执行模板xtest，将输出结果替换到DOM节点node中

	sTemplate.renderTmplTo('xtest', data, 'node');

#### 额外的功能与说明
支持模板的递归和相互调用
例
```
	<script type="text/html" id='rtest'>
		<ul>
	    for (var k in _arg) {
		    <li>
	        <h5>{{ k }}</h5>
	        if ('object' == typeof _arg[k]) {
		        {{ sTemplate.template_rtest(_arg[k]) }}
	        } else {
		        <span>{{ _arg[k] }}</span>
	        }
		    </li>
	    }
		</ul>
	</script>
```
模板rtest是一个递归模板，用于将一个js对象输出为ul/li结构
其中sTemplate.template_rtest表示引用自身，sTemplate.template_的前缀是固定的，后面是要引用的模板id
同理，可以引用另一个模板，只需要替换模板id部分

#### **简单模式带来的限制**
直接支持js和HTML的混编带来方便的同时，代价就是书写有一些限制
1. 要将HTML和js逻辑在不同的行书写，不要写成一行，否则将导致执行错误
`<div> if (...)` 和 `if (...) { <div></div> }` 这样的一行写法都是不支持的
2. html标签中间的多行文本内容，需要写成字符串常量表达式的形式
如
```
	<textarea>
	111
	222
	333	
	</textarea>
```
要写成
```
	<textarea>
	{{ "111\r\n" }}
	{{ "222\r\n" }}
	{{ "333\r\n" }}
	</textarea>
```
如果html标签内的文本不存在换行，则`<textarea>123</textarea>`是直接支持的<br/>
类似的，{{ }}表达式也不支持多行书写<br/>
简单的代价...(^-^)
