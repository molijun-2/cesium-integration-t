module.exports = {
	plugins: {
		"postcss-pxtorem": {
			// 能够把所有元素的px单位转成Rem
			// rootValue: 转换px的基准值。
			// 例如一个元素宽是75px，则换成rem之后就是2rem。
			// rootValue: 37.5,
			rootValue: 192,  // 设计稿宽度的1/ 10
			propList: ['*'], // 除 border 外所有px 转 rem
			selectorBlackList: [".el-"] // 过滤掉.el-开头的class，不进行rem转换
		}
	}
};

