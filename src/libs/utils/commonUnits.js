

/**
* 防抖
* @param {*} fn 防抖的函数
* @param {*} delay 延时
*/
let timer = null
export const debounce = (fn, delay) => {
    return function (this) {
        // 清空定时器
        clearTimeout(timer);
        // 重新开一个定时器
        timer = setTimeout(() => {
            // 调用要进行的操作
            fn.apply(this, arguments);//想把fn中的this指向debounce中return的这个函数的this（改变this指向）
            timer = null
        }, delay);
    };
}