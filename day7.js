var text = document.getElementsByTagName('pre')[0].innerText.split('\n');
var gate = [];
var a = 'not found';
var regNOT = /NOT /, regAND = /AND /, regOR  = /OR /;
var regLSH = /LSHIFT /, regRSH = /RSHIFT /;

function changeNotation(operation){
	if(regAND.test(operation))
		operation = operation.replace(regAND, "") + " & ";
	else if(regOR.test(operation))
		operation = operation.replace(regOR, "") + " | ";
	else if(regNOT.test(operation))
		operation = operation.replace(regNOT, "") + " ~ ";
	else if(regLSH.test(operation))
		operation = operation.replace(regLSH, "") + " << ";
	else if(regRSH.test(operation))
		operation = operation.replace(regRSH, "") + " >> ";
	return operation;
}

function reduce(equation){
	var regEx = [[/.* 0 & /, "0"]
	,[/^0 .* & /, "0"]
	,[/.* 0 \| /, "equation.split(' ')[0]"]
	,[/^0 .* \| /, "equation.split(' ')[1]"]
	,[/\d+ ~/, "equation.split(' ')[0]"]];

    if(!(/(^\d+ \d+ .+ $)|(^\d+ ~ $)/).test(equation)){
    	for(var i = 0; i < regEx.length; i++)
	    	if(regEx[i][0].test(equation))
	    		equation = "" + equation.replace(equation, eval(regEx[i][1]));
    }
    else{
    	temp = equation.trim().split(' ');
    	var operator = temp.pop();
    	var operand = temp.pop();
    	temp.push(operator);
    	temp.push(operand);
    	equation = eval("65535 & (" + temp.join(' ') + ")");
    }
	return equation;
}

function replaceAll(keyVal){
	var regex = new RegExp("(^" + keyVal[0][1] + ") | " + keyVal[0][1] + " ");
	for(var i = 0; i < gate.length; i++)
		if(regex.test(gate[i][0])) gate[i][0] = gate[i][0].split(' ')[0] == keyVal[0][1] ?
			gate[i][0].replace(regex, keyVal[0][0] + " ") : gate[i][0].replace(regex, " " + keyVal[0][0] + " ");
	return -1;
}

for(var i = 0; i < text.length - 1; i++){
	gate[i] = text[i].split(' -> ');
	gate[i][0] = changeNotation(gate[i][0]);
}

for(var i = 0; a == 'not found'; i++){
	if(gate.length == 1)
		a = "a = " + reduce(gate[i][0]);
	else if((!isNaN(gate[i][0] = reduce(gate[i][0]))) || (gate[i][0].split(" ").length == 1))
		i = replaceAll(gate.splice(i,1));
}