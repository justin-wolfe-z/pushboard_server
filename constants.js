const constants = {
  db:{
    path: 'mongodb://localhost/myapp'
  },
  app:{
  },
  port:4000,
  zaps:{
    signup: 'https://hooks.zapier.com/hooks/catch/2003878/ssrlnv/',
    delete: '', 
    reset: ''  
  },
  headers: {'Content-Type':'application/json'},
  defaultButtons : [
		{
			id:0,
			icon:"smiley",
			type:"static",
			text:"",
			hookURL:['https://requestb.in/1ccgflb1','https://requestb.in/15djspa1?inspect','https://requestb.in/1ew3uw31']
		},
		{
			id:1,
			icon:"baby",
			type:"static",
			text:"",
			hookURL:[]
		},
		{
			id:2,
			icon:"fish",
			type:"static",
			text:"",
			hookURL:[]
		},
		{
			id:3,
			icon:"car",
			type:"static",
			text:"",
			hookURL:[]
		},
		{
			id:4,
			icon:"dog",
			type:"static",
			text:"",
			hookURL:[]
		},
		{
			id:5,
			icon:"cat",
			type:"static",
			text:"",
			hookURL:[]
		},
		{
			id:6,
			icon:"clock",
			type:"static",
			text:"",
			hookURL:[]
		},
		{
			id:7,
			icon:"lunch",
			type:"static",
			text:"",
			hookURL:[]
		},
		{
			id:8,
			icon:"apple",
			type:"static",
			text:"",
			hookURL:[]
		}					
	]
}

module.exports = constants