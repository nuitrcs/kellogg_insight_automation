tilde.query = {}

tilde.query.select = function(source,input) {
	return tilde[source][input]
}
tilde.query.selectAll = function(source,input_array) {
	if (input_array.constructor === Array) {
		var output = [],
			j = input_array.length,
			i;
		for (i = 0; i < j; i++) {
			output.push(tilde[source][input_array[i]])
		}
		return output
	} else {
		return tilde[source][input]
	}
}
tilde.query.prepareData = function() {
	
}