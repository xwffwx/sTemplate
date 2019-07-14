## sTemplate

#### 介绍
Simple-Template(sTemplate)，支持原生js脚本和HTML代码混排的简单/高效JS模板引擎

1. 简单编写。支持原生js脚本和HTML混排，几乎不需要学习额外的模板语法，便于阅读和维护
2. 高性能。性能高出art-template约1倍以上，和doT相当，例子见demo子目录。

#### 设计初衷
作者之前使用的所有js模板引擎，都不支持js脚本的直接书写，或多或少都定义有自己的js模板语法。

例如art-template的循环
```
	{{each children item idx}}
	...
	{{/each}}
```
或doT中的if
```
	{{ if(d.list.length === 0){ }}
	...
	{{ } }}
```
等等

这导致了学习使用的成本，而且当逻辑比较复杂的时候，这些额外的js模板语法会降低代码可读性，增加出错几率。

sTemplate的目标就是让js脚本不加修饰地和HTML代码编排。在sTemplate中，只定义了一种语法，就是js表达式{{ }}，用于在HTML中嵌入变量。下面是一个完整的sTemplate模板，它将数组转变为表格行，如果没有数据，则显示nothing
```
<script type="text/html" id='resultTmpl'>
	<tbody>
		if (st && st.length) {
			for (var k in st) {
				<tr>
					<td>{{ st[k].name }}</td>
					<td>{{ st[k].age }}ms</td>
				</tr>
			}
		} else {
			<tr><td>nothing</td></tr>
		}
	</tbody>
</script>
```

#### 使用说明

1. 引入js文件
`<script src="stemplate.js"></script>`

2. 编写模板
模板参数的类型可以是任意有效的js类型，不限于对象和数组，参数名固定为st。
HTML中嵌入js表达式，请用一对{{ }}括起来，表达式的语法也是js原生的。模板js脚本/表达式的上下文为全局上下文，可直接引用模板外定义的js全局函数。
模板id唯一标识一个模板，如果重复，后定义的模板将替换之前的。用模板id能实现模板的相互调用和递归调用。每个模板都编译为一个名为sTemplate.template_<模板ID>的js函数，可在其它模板中调用，或递归调用。
一个递归模板例子，模板id为rtest，用于将一个json对象分层输出为ul/li结构
```
	<script type="text/html" id='rtest'>
		<ul>
	    for (var k in st) {
		    <li>
	        <h5>{{ k }}</h5>
	        if ('object' == typeof st[k]) {
		        {{ sTemplate.template_rtest(st[k]) }}
	        } else {
		        <span>{{ st[k] }}</span>
	        }
		    </li>
	    }
		</ul>
	</script>
```

3. 渲染模板
2种写法，data是模板参数
	1. 通常模板的写法：拿到渲染结果然后转变为HTML
```
var domnode = document.getElementById('node');
domnode.innerHTML = sTemplate.renderTmpl('xtest', data);
```
	2. 或用下面一句话代替，将渲染结果输出到DOM节点node中
```
	sTemplate.renderTmplTo('xtest', data, 'node');
```

#### **一些限制**
直接支持js和HTML的混编带来方便的同时，代价就是书写上有一些限制
1. 不要将HTML和js脚本混合在一行内。
`<div> if (...)` 和 `if (...) { <div></div> }` 这样一行完成的紧凑写法都是不支持的。同时这也是不好的代码风格。但HTML标签可以写成多行形式，如下
```
<a href="javascript:;"
onclick="console.log('{{ item3.menuid }}')">{{ item3.menuname}}</a>
```
2. HTML标签中间的多行文本内容，需要写成字符串常量表达式的形式
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
如果HTML标签内文本不存在换行，单行文本情况，如`<textarea>123</textarea>`是直接支持的<br/>
类似的，{{ }}表达式也不支持多行书写

#### 联系方式
QQ：87421296 MAIL：xwffwx@yeah.net
