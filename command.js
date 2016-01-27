var fs = require('fs');
var request = require('request');
// var myCommand = function(data){
// 	var input = data.toString().trim();
// 	var output;
// 	if (input==="pwd"){
// 		output = process.cwd();
// 	};
// 	if (input==="date"){
// 		output = new Date().toString();
// 	};
// 	process.stdout.write(output || "Invalid entry");	
//   ;
// }
function readFile(cb, filename){ 
	fs.readFile(filename, "utf8", function(err, file){
		if (err)
			throw new Error(err.message);
		cb(file);
	})
}




module.exports = {
	pwd: function(cb){
		cb(process.cwd());
	},
	date: function(cb){
		cb(new Date().toString());
	},
	ls: function(callback){
		var rtn =[];
		fs.readdir('.', function(err, files) {
		  if (err) throw err;
		  files.forEach(function(file) {
		    rtn.push(file);
		  });
			callback(rtn.join(" "));
		});
	},
	echo: function(cb, arg){
		cb(arg);
	},
	cat: function(cb, arg){
		readFile(cb, arg);
	},
	head: function(cb, arg){
		readFile(function(file){
			var fileCut = file.split('\n').filter(function(item, index){
				if (index < 5)
					return item;
			});
			cb(fileCut.join('\n'));
		}, arg);
	},
	tail: function(cb, arg){
		readFile(function(file){
			var fileCut = file.split('\n').filter(function(item, index, arr){
				if (index > arr.length-6)
					return item;
			});
			cb(fileCut.join('\n'));
		}, arg);

	},
	sort: function(cb, arg){
		readFile(function(file){
			var fileCut = file.split('\n').sort();
			cb(fileCut.join("\n"));
		}, arg);
	},
	wc: function(cb, arg){
		readFile(function(file){
			var fileLength = file.split('\n').length;
			cb(fileLength.toString());
		}, arg);
	},
	uniq: function(cb, arg){
		readFile(function(file){
			var arr = [];
			var lines = file.split('\n');
			var lastLine;
			for (var i in lines){
				if (lines[i] != lastLine){
					arr.push(lines[i]);
					lastLine=lines[i];
				}
			}
			cb(arr.join("\n"));
		}, arg);
	},
	curl: function(cb, arg) {
		request("http://www."+arg,function(error, response, body){
			if (!error){
				cb(body);
			}
		})
	}
}




