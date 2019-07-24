requirejs.config({
  baseUrl: '.',
  paths: {
    'stemplate': '../src/stemplate',
    'text': './third/text-2.0.16',
    'tpl': './userequirejs.tpl'
  }
});
requirejs(['text!tpl', 'stemplate'],function(tpl,stemplate){
  sTemplate.renderSourceTo('rtest', tpl, {
    name:'这是一个递归/子模板测试',
    array:[
      {
        test:'字符串',
        child: {
          time:new Date().toLocaleString(),
          child:'子项的子项。。。'
        }
      },
      2,3,4,
      {
        id: 123,
        name:'aaa'
      },6
    ]
  }, 'content');
});
