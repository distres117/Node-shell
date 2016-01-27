var command = require('./command.js');

// Output a prompt
process.stdout.write('prompt > ');

// The stdin 'data' event fires after a user types in a line
process.stdin.on('data', function(input) {
	input = parseInput(input);
	runCommand(input);
});
	

function runCommand(input){
	var output = command[input.command];
	if (output)
		 output(input);
	else
		process.stdout.write("Invalid entry\nprompt > ");
	
}

function parseInput(raw){
	var input = raw.toString().trim();
	var parsed = input.match(/([^\s+\|]+)/g);
	var command = parsed[0];
	var arg = parsed[1];
	var queuedCmds = parsed.slice(2);
	return new Response(command, arg, queuedCmds);
}

function finalize(output){
	process.stdout.write(output.return);
	process.stdout.write('\nprompt > ');
}


function Response(cmd, arg, queue){
	this.command = cmd;
	this.arg = arg;
	this.cmdQueue = queue;
	this.return;
}

Response.prototype.getNext = function(){
	if (this.cmdQueue.length){
		//Get next command in the queue
		this.arg = null;
		this.command = this.cmdQueue.shift();
		runCommand(this);
	}
	else
		finalize(this);
};
