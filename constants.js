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
  	signup: 'Thanks for signing up to Pushboard! Your account information is:',
  	reset: 'Your API key has been reset. Your account information is: '
  },
  headers: {'Content-Type':'application/json'},
  defaultButtons : [
		{
			id:0,
			icon:"smiley",
			type:"static",
			text:"Button 0 Text",
			hookURL:['https://hooks.zapier.com/hooks/catch/2003878/swt611/','https://hooks.zapier.com/hooks/catch/2003878/swt611/','https://hooks.zapier.com/hooks/catch/2003878/swt611/']
		},
		{
			id:1,
			icon:"baby",
			type:"static",
			text:"Button 1 Text",
			hookURL:[]
		},
		{
			id:2,
			icon:"fish",
			type:"static",
			text:"Button 2 Text",
			hookURL:[]
		},
		{
			id:3,
			icon:"car",
			type:"static",
			text:"Button 3 Text",
			hookURL:[]
		},
		{
			id:4,
			icon:"dog",
			type:"static",
			text:"Button 4 Text",
			hookURL:[]
		},
		{
			id:5,
			icon:"cat",
			type:"static",
			text:"Button 5 Text",
			hookURL:[]
		},
		{
			id:6,
			icon:"clock",
			type:"static",
			text:"Button 6 Text",
			hookURL:[]
		},
		{
			id:7,
			icon:"lunch",
			type:"static",
			text:"Button 7 Text",
			hookURL:[]
		},
		{
			id:8,
			icon:"apple",
			type:"static",
			text:"Button 8 Text",
			hookURL:[]
		}					
	]
}

module.exports = constants