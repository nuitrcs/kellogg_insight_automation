tilde.query = {}
tilde.unlocked = true

tilde.query.select = function(source,input) {
	tilde[source][input].c = input
	return tilde[source][input]
}
tilde.query.selectAll = function(source,input_array) {
	if (input_array.constructor === Array) {
		var output = [],
			j = input_array.length,
			i;
		for (i = 0; i < j; i++) {
			tilde[source][input_array[i]].c = input_array[i]
			output.push(tilde[source][input_array[i]])
		}
		return output
	} else {
		tilde[source][input].c = input
		return tilde[source][input]
	}
}
tilde.query.prepareData = function() {
	var data = tilde.current_selection;
	var severed_array = []
	var severed = {}
	var selection = tilde.query.select('auto_data',data.c)
	severed.selected = true
	severed.r = selection.r
	severed.n = selection.n
	severed.d = selection.d
	severed.s = selection.s
	severed.c = selection.c
	severed.assignment = undefined

    var similars = tilde.query.selectAll('auto_data',severed.s)
    similars.forEach(function(d){
    	var obj = {}
    	obj.selected = false
    	obj.r = d.r
		obj.n = d.n
		obj.d = d.d
		obj.s = d.s
		obj.c = d.c
		obj.assignment = undefined
		severed_array.push(obj)
    })

    severed_array.push(severed)
    severed_array.sort(function(a,b){
    	return b.r - a.r
    })
    var assignment = 1,
    	i;
    for (i = 0; i < 11; i++) {
    	if (severed_array[i].selected) {
    		tilde.choice_slot = assignment
    		severed_array[i].assignment = assignment
    	} else {
    		severed_array[i].assignment = assignment
    	}
    	assignment++
    }
    tilde.current_selection = severed_array
    tilde.animate.endLoop()
}