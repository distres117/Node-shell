var command = require('./command.js');

// Output a prompt
process.stdout.write('prompt > ');

// The stdin 'data' event fires after a user types in a line
process.stdin.on('data', function(data) {
	var input = data.toString().trim();
	//Check to see if input contains an argument
	var parts = input.split(' ');
	input = parts[0];
	var arg = parts[1];
	var output = command[input]
	if (output)
		 output(callback, arg);
	else
		process.stdout.write("Invalid entry\nprompt > ");
	//console.log(output());
	// if (output())
	// 	return output();
	// else
	// 	return "Invalid entry";
	
});

function callback(output){
	process.stdout.write(output);
	process.stdout.write('\nprompt > ');
}