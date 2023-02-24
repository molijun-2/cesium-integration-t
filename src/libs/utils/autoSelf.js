// 是一个立即执行函数
(function flexible(window, document) {
    let docEl = document.documentElement //返回文档的根元素
    let dpr = window.devicePixelRatio || 1 //返回当前显示设备的物理像素分辨率与CSS 像素分辨率之比

    // 调整body标签的fontSize，fontSize = (12 * dpr) + 'px'
    // 设置默认字体大小，默认的字体大小继承自body
    function setBodyFontSize() {
        if (document.body) {
            document.body.style.fontSize = (12 * dpr) + 'px'
        } else {
            document.addEventListener('DOMContentLoaded', setBodyFontSize)
        }
    }
    // set 1rem = viewWidth / 10
    // 设置root元素的fontSize = 其clientWidth / 10 + ‘px’
    function setRemUnit() {
        let rem = docEl.clientWidth / 10 //元素内部的宽度，以px为单位
        let screenHiehgt = window.screen.height
        if (screenHiehgt - docEl.clientHeight < 4) {//这个情况是为什么
            rem = 24 + rem
        }
        docEl.style.fontSize = rem + 'px'
    }


    setBodyFontSize()
    setRemUnit()
    // 当我们页面尺寸大小发生变化的时候，要重新设置下rem 的大小
    window.addEventListener('resize', setRemUnit)
    // 当一条会话历史记录被执行的时候将会触发页面显示 (pageshow) 事件
    window.addEventListener('pageshow', function (e) {
        // e.persisted 返回的是true 就是说如果这个页面是从缓存取过来的页面，也需要从新计算一下rem 的大小
        if (e.persisted) {
            setRemUnit()
        }
    })

    // 移动端的适配如何做
    // (1): 所有的css单位, rem    (vscode可以自动把px转成rem, pxtorem插件设置基准值37.5) - 1rem等于37.5px
    //  原理: rem要根据html的font-size换算
    //  目标: 网页宽度变小, html的font-size也要变小, ...网页变大, html的font-size变大.
    // (2): flexible.js (专门负责当网页宽度改变, 会修改html的font-size)

}(window, document))