
module.exports = {
	plugins: {
  	'postcss-theme-variables': {
  		vars: {
	        red: 'blue',
	        gray: 'blue',
	        blue: 'blue', 
	     },
	    prefix: '$'
  	},
    'autoprefixer': {
      browsers: ['Android >= 4.0', 'iOS >= 7']
    },
    'postcss-pxtorem': {
      rootValue: 50,
      propList: ['*']
    }
  } 
  
};