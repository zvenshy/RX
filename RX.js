/*
 * Rixin JavaScript Library
 * Copyright 2014 Venshy
 * Date: 2014-5-12
 */
function  RX () {
    var args     = RX.fn.toArray(arguments)
    ,   callback = args.pop()
    //自构造函数参数处理
    ,   modules  = (args[0] && typeof args[0] === 'string') ? args : args[0]
    ,   i ;
    //省略new
    if( !( this instanceof RX ) ) {
        return new RX ( modules, callback );
    }
    //没有模块参数或是 * 全选
    if (!modules || modules === '*') {
        modules = [];
        for ( i in RX.modules) {
            if ( RX.modules.hasOwnProperty(i) ) {
                modules.push( i );
            }
        }
    }
    //可选模块加载
    for ( i = 0; i < modules.length; i++) {
        RX.modules[ modules[i] ] (this);
    }
    
    callback(this);
}
//命名空间
RX.namespace = function (nameStr) {
    var nodes = nameStr.split('.')
    ,   root  = RX
    ,   i ;

    if (nodes[0] === 'RX') {
        nodes = nodes.slice(1);
    }

    for ( i = 0; i < nodes.length; i++ ) {
        if ( typeof root[ nodes[i] ] === 'undefined') {
            root[ nodes[i] ] = {};
            root = root[ nodes[i] ];
        }
    }
    return root;
};
RX.fn = RX.prototype = {
    //类数组对象数组化
    toArray : function (obj, start, end) {
        return ( !window.isArray ) ?
            Array.prototype.slice.call(obj, start || 0, end || obj.length) :
            function () {
                var i = start || 0
                ,   l = end || obj.length
                ,   ret = [];
                for ( ; i < l; i++) {
                    ret.push( obj[i] );
                }
                return ret;
            }
    }
}
RX.modules = {};
RX.modules.core = function (rx) {
    var opt  = Object.prototype.toString
    ,   arr  = []
    ,   indexOf = arr.indexOf
    //isArray 字面意思
    ,   isArray = Array.isArray || function ( obj ) {
        return opt.toString.call(obj) === '[object Array]';
    }
    ,   inArray = function (array, elem, i) {
        if ( array ) {
            if( indexOf ){
                return Array.prototype.indexOf.call( array, elem, i );
            } else {
                var len = array.length;
                i = i ? (i < 0 ? i = Math.max( 0, len + i) : i ) : 0; 
                for (; i < len; i++) {
                    if (array[i] === elem) {
                        return i;
                    }
                }
            }
            return -1;
        }
        return;
    }
    //数组或对象遍历
    ,   each = function (obj, callback, args) {
        var isArr = isArray( obj )
        ,   i = 0
        ,   l
        ,   value;
        if ( args ) {
            if ( isArr ) {
                l = obj.length;
                for ( ; i < obj.length; i++ ) {
                    value = callback.apply( obj[i], args );
                    if (value === false) {
                        break;
                    }
                }
            } else {
                for ( i in obj ) {
                    value = callback.apply( obj[i], args);
                    if (value === false) {
                        break;
                    }
                }
            }
        } else {
            if ( isArr ) {
                l = obj.length;
                for ( ; i < obj.length; i++ ) {
                    value = callback.call( obj[i], i, obj[i] );
                    if (value === false) {
                        break;
                    }
                }
            } else {
                for ( i in obj ) {
                    value = callback.call( obj[i], i, obj[i] );
                    if (value === false) {
                        break;
                    }
                }
            }
        }
    }

    rx.isArray = isArray;
    rx.inArray = inArray;
    rx.each    = each;
};

RX.modules.css = function (rx) {
    var compStyle = function (elem, name) {
        //获取计算样式 Warning:readOnly
        //elem: single element
        if(typeof elem.currentStyle !== 'undefined') {
            return elem.currentStyle[ name ];
        } else { 
            return document.defaultView.getComputedStyle(elem, null)[ name ];
        }
    };
    rx.compStyle = compStyle;
};


RX.modules.animate = function (rx) {
    //所需模块载入
    var css = RX.modules.css(rx)
    ,   compStyle = rx.compStyle;
    
    var animate = function (obj, props, duration, easing) {
        //内部参数初始化
        var fps          = 30
        ,   everytime    = 1000 / 30
        ,   duration     = duration || 2000
        ,   easings = {
            linear : function ( pre ) {
                return pre;
            },
            swing  : function ( pre ) {
                return 0.5 - Math.cos ( pre*Math.PI ) / 2;
            },
            easeInOutBounce : function ( pre ) {
                if ( pre < (1 / 2.75) ) {
                    return 7.5625 * pre * pre;
                } else if ( pre < (2 / 2.75) ) {
                    return 7.5625 * ( pre -= (1.5 / 2.75) ) * pre + .75;
                } else if ( pre < (2.5 / 2.75) ) {
                    return 7.5625 * ( pre -= (2.25 / 2.75) ) * pre + .9375;
                } else {
                    return 7.5625 * ( pre -= (2.625 / 2.75) ) * pre + .984375;
                }
            },
            sine: function ( pre ) {
                    return 1 - Math.cos( pre * Math.PI / 2 );
            },
            circ: function ( pre ) {
                    return 1 - Math.sqrt( 1 - pre * pre );
            },
            elastic: function( pre ) {
                    return pre === 0 || pre === 1 ? pre :
                            -Math.pow( 2, 8 * (pre - 1) ) * Math.sin( ( (pre - 1) * 80 - 7.5 ) * Math.PI / 15 );
            },
            back: function( pre ) {
                    return pre * pre * ( 3 * pre - 2 );
            },
            easeInBounce: function ( pre ) {
                    var pow2,
                            bounce = 4;

                    while ( pre < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
                    return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - pre, 2 );
            }

        };
        //参数载入
        var scroll = obj
        ,   changeSty = []
        ,   begin     = {}
        ,   change    = {}
        ,   end       = {}
        ,   i;
        for ( i in props) {
            changeSty.push(i);
            begin[i]     = parseFloat( compStyle(obj, i) );
            change[i]    = parseFloat( props[i] ) - begin[i];
            end[i]       = begin[i] + change[i];
        }
        //默认缓动方式
        if (!easings[easing]) {
            easing = 'swing';
        }

        var begintime = new Date;
        var ani = setInterval (function () {
            var pre = (new Date - begintime) / duration
            ,   l   = changeSty.length
            ,   i = 0;
            if (pre >= 1) {
                scroll.style[changeSty] = end + 'px';
                clearInterval(ani);
                return;
            }
            for (;i < l; i++) {
                scroll.style[ changeSty[i] ] = begin[ changeSty[i] ] +
                    easings[easing](pre)*change[ changeSty[i] ] + 'px';
            }
        }, everytime);  
    }

    rx.animate = animate;
};
