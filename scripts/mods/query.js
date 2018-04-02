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
	var data = tilde.current_selection;
	var selection = tilde.query.select('auto_data',data.c)
	selection.selected = true
    var similars = tilde.query.selectAll('auto_data',selection.s)
    similars.push(selection)
    similars.sort(function(a,b){
    	return b.r - a.r
    })
    var assignment = 1,
    	i;
	tilde.choice_slots = {}
    for (i = 0; i < 11; i++) {
    	if (similars[i].selected) {
    		tilde.choice_slots[assignment] = true
    		assignment++
    		tilde.choice_slots[assignment] = true
    		similars[i].assignment = assignment
    		assignment++
    		tilde.choice_slots[assignment] = true
    	} else {
    		similars[i].assignment = assignment
    	}
    	assignment++
    }
    tilde.current_selection = similars
    tilde.animate.endLoop()
}