tilde.notices = {
	"pre_pick": "Search to discover your job's risk of automation!<br>&nbsp;",
	"option_chosen":"Calculating your automation risk...",
	"finding_similars":"Finding similar jobs...",
	"subheading":"Result: Your job + the ten most similar to it,<br>based on related skills involved."
}

tilde.colors = ["#C1272D","#ED1C24","#F15A24","#F7931E","#FCEE21","#AFFF92"]
tilde.risks = [1,.89,.75,.45,.2,0]
tilde.colorScale = d3.scale.linear()
	.domain(tilde.risks)
	.range(tilde.colors)

tilde.barScale = d3.scale.linear()
	.domain([0,1])
	.range([1,tilde.barmax])

tilde.animate.notice = function(stage) {
	d3.select("#tilde_notice")
		.transition()
		.duration(100)
		.delay(100)
		.style('opacity',0)
		.each('end',function(d,i){
			d3.select(this)
				.html(tilde.notices[stage])
				.transition()
				.duration(800)
				.style('opacity',1)
		})
}

tilde.animate.drawFill = function(d,callback) {
	var data = d,
		g_id = '#tilde_g_'+d.assignment,
		bar_id = '#tilde_bar_'+d.assignment,
		fill_id = '#tilde_fill_'+d.assignment;
	d3.select(fill_id)
		.datum(data)
		.transition()
		.duration(1500)
		.attr('width',function(d,i){
			return tilde.barScale(d.r)
		})
		.attr('fill',function(d,i){
			return tilde.colorScale(d.r)
		})
		.attr('y',function(d,i){
			var me = this
			data.y = d3.select(me).attr('y')
			return data.y
		})
	d3.select(g_id)
		.append('text')
		.datum(data)
		.classed('fill-label',true)
		.style('opacity',0)
		.attr('fill','white')
		.attr("dy", ".35em")
		.attr("text-anchor", "end")
		.text(function(d,i){
			return d.r*100 + '%'
		})
		.transition()
		.duration(1500)
		.delay(200)
		.style('opacity',1)
		.attr('x',function(d,i){
			var middle = (tilde.width - tilde.margin.left - tilde.margin.right)/2 +tilde.spacing*2;
			var bar_size = tilde.barScale(d.r)
			var bonus = 0
			if (this.getBBox().width > tilde.barScale(d.r)) {
				bonus = bonus + this.getBBox().width*1.1
			} else {
				bonus = 0
			}
			return middle + bar_size + bonus
		})
		.attr('y',function(d,i){
			return +data.y + tilde.barheight/2
		})
		.attr('fill',function(d,i){
			if (this.getBBox().width > tilde.barScale(d.r)) {
				return 'grey'
			} else {
				return 'white'
			}
		})
		

}

tilde.animate.drawSelection = function() {
	console.log(tilde.current_selection)
	d3.selectAll('.tilde-selected')
		.classed('tilde-selected',false)
	d3.selectAll('.fill-label')
		.remove()
	var data = tilde.current_selection,
		i;
	for (i = 0; i < 11; i++) {
		if (data[i].selected) {
			tilde.animate.drawFill(data[i])
		}
	}
}

tilde.animate.explainSelection = function() {

}

tilde.animate.drawSimilars = function() {

}