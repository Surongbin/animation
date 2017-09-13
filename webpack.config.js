module.exports = {
	entry:{
		animation:'./src/animation.js'
	},
	output:{
		path:__dirname + '/build',
		filename:'[name].js',//entry的key当name,会输出animation.js
		library:'animation',
		libraryTarget:'umd'
	}
}
