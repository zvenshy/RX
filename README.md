Rixin JavaScript Library<br/>
Copyright 2014 Venshy

Clone到本地，在页面中载入即可使用。
格式：
RX([module1, module2, ...,]function ($) {});

回调函数前为模块ID，可选参数。如：<br/>
RX('animate', 'core', function ($) {}); //载入animate, core模块<br/>
RX(['animate', 'core'], function ($) {})//数组形式亦可<br/>
不添modules参数默认为 ‘*’， 即全选。<br/>
回调函数的参数任意填写。为RX构造函数的实例。<br/>

现有模块 core,css,anamite<br/>
具体使用看代码。<br/>
其中anamite(object, {props} [,duration, easing])<br/>
props以JSON格式传入，目前只对最后一个有作用。。<br/>
