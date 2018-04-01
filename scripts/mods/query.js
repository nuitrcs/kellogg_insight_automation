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
			console.log(input_array[i])
			console.log(tilde[source][input_array[i]])
			output.push(tilde[source][input_array[i]])
		}
		return output
	} else {
		return tilde[source][input]
	}
}
tilde.query.checkAll = function() {
	var dat = tilde.auto_data,
		keys = Object.keys(dat),
		missing = {},
		sim_missing = [],
		count = 0,
		no_sim = 0,
		j = keys.length,
		i;
	for (i = 0; i < j; i++) {
		console.log(dat[keys[i]])
		if (dat[keys[i]].similars) {
			var sims = dat[keys[i]].similars,
				l = sims.length,
				k;
			for (k = 0; k < l; k++) {
				if (!dat[sims[k]]) {
					if (!missing[sims[k]]) {
						missing[sims[k]] = 1
					}
					count++
				}
			}
		} else {
			sim_missing.push(keys[i])
			no_sim++
		}
		
	}
	console.log(Object.keys(missing))
	console.log(count)
	console.log(sim_missing)
	console.log(no_sim)
}