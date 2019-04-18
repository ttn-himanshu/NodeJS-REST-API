const http = require('http');
const port = 8000;
const hostname = '127.0.0.1';
const fs = require('fs');
const url = require('url');
const student  = require('./public/student');

function renderhtml(path, res) {
	fs.readFile(path, null, function(error, data){
		if(error){
			res.writeHead(400);
			res.write("file not found");
		} else {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
		}

		res.end();
	});
}

function getUserData(res){
	res.setHeader("Content-Type", 'application/json');
	res.end(JSON.stringify({"firstname":"abc"}));
}

function getStudents(pathObj, res) {
	let queryString = pathObj.query;
	console.log(":student", pathObj);
	if(queryString.userId){
		res.setHeader("Content-Type", 'application/json');
		res.end(JSON.stringify({"firstname":"abc"}));
	} else {
		res.setHeader("Content-Type", 'application/json');
		res.end(JSON.stringify(student));
	}
	
}

function getStudentByid(req, res){
	var body = '';
	req.on('data', function(data) {
		body +=data;

		if(body.length>1e6) {
			req.connection.destroy();
		}
	});

	req.on('end', function(data) {
		var postData = JSON.parse(body);
		console.log(postData);
	});

}



var server = http.createServer(function(req,res){
	let pathObj = url.parse(req.url, true);
	

	switch(pathObj.pathname){
		case '/':
		  renderhtml("./public/index.html", res);
		  break;
	 	case '/about':
		  renderhtml("./public/about.html", res);
		  break;
	   	case '/login':
		  renderhtml("./public/login.html", res);
		  break;
	  	case '/user':
		  getUserData(res);
		  break;
		case '/student':
		  if(req.method === 'GET') {
		  	getStudents(pathObj, res);
		  } else if(req.method ==='POST'){
		  	getStudentByid(req, res);
		  }
		  break;

	}
});

server.listen(port,hostname,() =>{
	console.log(`Server running at http://${hostname}:$port/`);
});