/*
 * EcjtuNet browser.js
 *@author       Venshy at EcjtuNet
 *@last-time    2014-7-26
 */

function DOMContentLoad() {
    var url = window.location.href;
    var browser = function () {
            var w = window,ver = w.opera ? (opera.version().replace(/\d$/, "") - 0)
                : parseFloat((/(?:IE |fox\/|ome\/|ion\/)(\d+\.\d)/.
                    exec(navigator.userAgent) || [,0])[1]);
                return {
                    //测试是否为ie或内核为trident，是则取得其版本号
                    ie: !!w.VBArray && Math.max(document.documentMode||0, ver),//内核trident
                    //测试是否为firefox，是则取得其版本号
                    firefox: !!w.netscape && ver,//内核Gecko
                    //测试是否为opera，是则取得其版本号
                    opera:  !!w.opera && ver,//内核 Presto 9.5为Kestrel 10为Carakan
                    //测试是否为chrome，是则取得其版本号
                    chrome: !! w.chrome &&  ver ,//内核V8
                    //测试是否为safari，是则取得其版本号
                    safari: /apple/i.test(navigator.vendor) && ver,// 内核 WebCore
                    
                    isIphone: /iPhone/i.test( navigator.userAgent ),
                    isIpad: /iPad/i.test( navigator.userAgent ),
                    isAndroid: /android/i.test( navigator.userAgent ),
                }
        }
    var is = browser();
    if ( !is['isIphone'] && !is['isAndroid'] ) {
        return;
    } else {
        if ( url.charAt( url.length - 1 ) === '/' ) {
            window.location.href = url + 'm';
        } else {
            window.location.href = url + '/m';
        }
        if(window.event) {
            window.event.returnValue = false; 
        }
    }
}
HTMLElement.prototype.addEventListener.apply(window.document, ['DOMContentLoaded', DOMContentLoad, false]);