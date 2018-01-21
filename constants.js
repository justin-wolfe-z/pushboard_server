const constants = {
  db:{
    path: 'mongodb://localhost/myapp'
  },
  app:{
  },
  port:4000,
  zaps:{
    email: 'https://hooks.zapier.com/hooks/catch/2003878/ssrlnv/'
  },
  emails:{
  	signup: {
  		title: 'Welcome to Tap',
  		text: 'Thanks for signing up to Tap! Your account information is:'
  	},
  	reset: {
  		title: 'Tap - API Key Reset',
  		text: 'Your API key has been reset. Your account information is: '
		}
  },
  headers: {'Content-Type':'application/json'},
  defaultButtons : [
		{
			id:1,
			icon:"coffee",
			type:"static",
			text:"Button 1 Text",
			hookURL:[]
		},
		{
			id:2,
			icon:"heart",
			type:"static",
			text:"Button 2 Text",
			hookURL:[]
		},
		{
			id:3,
			icon:"stopwatch",
			type:"static",
			text:"Button 3 Text",
			hookURL:[]
		},
		{
			id:4,
			icon:"bento",
			type:"static",
			text:"Button 4 Text",
			hookURL:[]
		},
		{
			id:5,
			icon:"evergreen_tree",
			type:"static",
			text:"Button 5 Text",
			hookURL:[]
		},
		{
			id:6,
			icon:"cat",
			type:"static",
			text:"Button 6 Text",
			hookURL:[]
		},
		{
			id:7,
			icon:"grinning",
			type:"static",
			text:"Button 7 Text",
			hookURL:[]
		},
		{
			id:8,
			icon:"thinking_face",
			type:"static",
			text:"Button 8 Text",
			hookURL:[]
		}			
	]
}

module.exports = constants