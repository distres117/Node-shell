var fs = require('fs');
var path = require('path');
var request = require('request');
var chalk = require('chalk');


function readFile(cb,input){
	if (!input.return){
		fs.readFile(input.arg, "utf8", function(err, file){
			if (err)
				throw new Error(err.message);
			cb(file);
		})
	}
	else
		cb(input.return);
}


module.exports = {
	pwd: function(input){
		input.return = process.cwd();
		input.getNext();
	},
	date: function(input){
		input.return = new Date().toString();
		input.getNext();
	},
	ls: function(input){
		var rtn =[];
		fs.readdir('.', function(err, files) {
		  if (err) 
		  	throw err;
		  files.forEach(function(file) {
		    rtn.push(file);
		  });
			input.return = rtn.join(" ");
			input.getNext();
		});
	},
	echo: function(input){
		input.return = input.arg;
		input.getNext();
	},
	cat: function(input){
		readFile(function(data){
			input.return = data;
			input.getNext();
		}, input);
		
	},
	head: function(input){
		readFile(function(data){
			var fileCut = data.split('\n').filter((it,i)=>i < 5);
			input.return = fileCut.join('\n');
			input.getNext();
		}, input);
	},
	tail: function(input){
		readFile(function(data){
			var fileCut = data.split('\n').filter((it,i,ar)=>i > ar.length -6);
			input.return = fileCut.join('\n');
			input.getNext();
		}, input);
	},
	sort: function(input){
		readFile(function(data){
			var fileCut = data.split('\n').sort();
			input.return = fileCut.join("\n");
			input.getNext();
		}, input);
	},
	wc: function(input){
		readFile(function(data){
			var fileLength = data.split('\n').length;
			input.return = fileLength.toString();
			input.getNext();
		}, input);
	},
	uniq: function(input){
		readFile(function(data){
			var arr = [];
			var lines = data.split('\n');
			var lastLine;
			for (var i in lines){
				if (lines[i] != lastLine){
					arr.push(lines[i]);
					lastLine=lines[i];
				}
			}
			input.return = arr.join("\n");
			input.getNext();
		}, input);

	},
	curl: function(input) {
		request("http://www."+ input.arg,function(error, response, body){
			if (!error){
				input.return = body;
				input.getNext();
			}
		})
	},
	find: function (input){
		walk(input.arg, function(results){
			input.return = results.join('\n');
			input.getNext();
		});
	},
	grep: function(input){
		readFile(function(data){
			var lines = data.split('\n').filter(it=> it.indexOf(input.arg) > -1);
			input.return = lines.join('\n').replace(new RegExp(input.arg, "gm"), chalk.bold.green(input.arg));
			input.getNext();
		},input);	
	}
}

function walk(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) 
    	throw new Error(err.message);
    (function next() { 
      if (!list.length) 
      	return done(results);
      var file = dir + '/' + list.shift();
	    if (fs.statSync(file).isDirectory()) {
	      walk(file, function(res) {
	        results = results.concat(res);
	        next();
	      });
	    } else {
	      results.push(file);
	      next();
	    }
    })();
  });
};




