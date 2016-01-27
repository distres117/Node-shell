var fs = require('fs');
var request = require('request');


function readFile(cb, filename){ 
	fs.readFile(filename, "utf8", function(err, file){
		if (err)
			throw new Error(err.message);
		cb(file);
	})
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
		if (input.arg)
			readFile(_cat, input.arg);
		else
			_cat(input.return);
		function _cat(data){
			input.return = data;
			input.getNext();
		}
	},
	head: function(input){
		if (input.arg)
			readFile(_head, input.arg);
		else
			_head(input.return);
		
		function _head(data){
			var fileCut = data.split('\n').filter((it,i)=>i < 5);
			input.return = fileCut.join('\n');
			input.getNext();
		}
	},
	tail: function(input){
		if (input.arg)
			readFile(_tail, input.arg)
		else
			_tail(input.return);
		function _tail(data){
			var fileCut = data.split('\n').filter((it,i,ar)=>i > ar.length -6);
			input.return = fileCut.join('\n');
			input.getNext();
		}

	},
	sort: function(input){
		if (input.arg)
			readFile(_sort, input.arg);
		else
			_sort(input.return);
		function _sort(data){
			var fileCut = data.split('\n').sort();
			input.return = fileCut.join("\n");
			input.getNext();
		}
	},
	wc: function(input){
		if (input.arg)
			readFile(_wc, input.arg)
		else
			_wc(input.return);
		function _wc(data){
			var fileLength = data.split('\n').length;
			input.return = fileLength.toString();
			input.getNext();
		}
	},
	uniq: function(input){
		if (input.arg)
			readFile(_uniq, input.arg);
		else
			_uniq(input.return);
		function _uniq(data){
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
		}
	},
	curl: function(input) {
		request("http://www."+ input.arg,function(error, response, body){
			if (!error){
				input.return = body;
				input.getNext();
			}
		})
	}
}




