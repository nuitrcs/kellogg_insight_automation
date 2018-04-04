tilde.notices = {
	"pre_pick": "Search to discover your job's risk of automation!<br>&nbsp;",
	"option_chosen":"Calculating your automation risk...<br>&nbsp;",
	"finding_similars":"Finding similar jobs...<br>&nbsp;",
	"subheading":"Result: Your job + the ten most similar to it,<br>based on related skills involved."
}

tilde.colors = ["#951F24","#C62026","#DD5524","#EF8F1E","#F2E74A","#A0F582"] //["#951F24","#F2E3E4"]
tilde.risks = [1,.89,.75,.45,.2,0] //[1,0]

tilde.colorScale = d3.scale.linear()
	.domain(tilde.risks)
	.range(tilde.colors)

tilde.barScale = d3.scale.linear()
	.domain([0,1])
	.range([1,tilde.barmax])

tilde.animate.notice = function(stage) {
	d3.select("#tilde_notice")
		.style('opacity',0)
		.html(tilde.notices[stage])
		.transition('show_transition')
		.duration(800)
		.delay(0)
		.style('opacity',1)
}

tilde.animate.showTableHeads = function(){
	d3.selectAll('.tilde-header')
		.transition('show_headers')
			.duration(800)
			.delay(700)
			.style('opacity',1)
}

tilde.animate.drawFill = function(d,callback) {
	var data = d,
		g_id = '#tilde_g_'+d.assignment,
		fill_id = '#tilde_fill_'+d.assignment;
	
	d3.select(fill_id)
		.datum(data)
		.transition('draw_fills')
		.duration(1500)
		.attr('width',function(d,i){
			return tilde.barScale(d.r)
		})
		.attr('fill',function(d,i){
			return tilde.colorScale(d.r)
		})
	
	d3.select(g_id)
		.append('text')
		.datum(data)
		.classed('fill-label',true)
		.style('opacity',0)
		.attr('fill','white')
		.attr("text-anchor", "end")
		.text(function(d,i){
			return Math.round(d.r*100,2) + '%'
		})
		.attr("dy", ".86em")
		.transition('draw_texts')
		.duration(1500)
		.delay(200)
		.style('opacity',1)
		.attr('x',function(d,i){
			var middle = (tilde.width - tilde.margin.left - tilde.margin.right)/2 +tilde.spacing*2;
			var bar_size = tilde.barScale(d.r)
			var bonus = 0
			if (this.getBBox().width*1.1 > tilde.barScale(d.r)) {
				bonus = bonus + this.getBBox().width*1.1
			} else {
				bonus = bonus - this.getBBox().width*0.05
			}
			return middle + bar_size + bonus
		})
		.attr('y',function(d,i){
			var height = this.getBBox().height
			if (d.assignment === tilde.current_slot) {
				return tilde.slots_y(d.assignment) + tilde.slots_y.rangeBand()*1.5 - tilde.barheight/2
			}
			return tilde.slots_y(d.assignment) + tilde.spacing*2
		})
		.attr('fill',function(d,i){
			if (this.getBBox().width*1.1 > tilde.barScale(d.r)) {
				return 'DarkGray'
			} else {
				return 'white'
			}
		})
		.each('end',function(d,i){
			if (callback){
				callback()
			}
		})
}

tilde.animate.brightenBar = function(unit,speed) {
	var bar_id = '#tilde_bar_'+unit;
	d3.select(bar_id)
		.transition('brighten_bar')
		.duration(speed)
		.delay(speed/2)
		.attr('opacity',1)
}

tilde.animate.select = function(input) {
	if (tilde.unlocked) {
		var delay = 1000
		if (input) {
			console.log('Selected group is: ' + input)
			delay = 0
			tilde.current_slot = input
		}
		tilde.animate.growSelection()

		setTimeout(function(){
			tilde.animate.setDescription()

		},delay)
	}
}

tilde.animate.growSelection = function() {
	tilde.slots
		.transition()
		.duration(800)
		.attr('transform',function(d,i){
			var count = +d3.select(this).attr('data-count')
			if (count <= tilde.current_slot) {
				return 'translate(0,0)'
			} else {
				return 'translate(0,'+tilde.slots_y.rangeBand()*2+')'
			}
		})
	tilde.boxes
		.transition()
		.duration(800)
		.attr('stroke-width',function(d,i){
			var count = +d3.select(this).attr('data-count')
			if (tilde.current_slot === count) {
				return 0
			} else {
				return tilde.spacing
			}
		})
		.attr('height',function(d,i){
			var count = +d3.select(this).attr('data-count')
			if (tilde.current_slot === count) {
				return tilde.slots_y.rangeBand()*3
			} else {
				return tilde.slots_y.rangeBand()
			}
		})

	tilde.bars
		.transition('move_bars')
		.duration(800)
		.attr('y',function(d){
			var count = +d3.select(this).attr('data-count')
			if (count === tilde.current_slot) {
				return tilde.slots_y(count) + tilde.slots_y.rangeBand()*1.5 - tilde.barheight/2
			}
			return tilde.slots_y(count) + tilde.spacing*2
		})
		
	tilde.fills
		.transition('move_fills')
		.duration(800)
		.attr('y',function(d){
			var count = +d3.select(this).attr('data-count')
			if (count === tilde.current_slot) {
				return tilde.slots_y(count) + tilde.slots_y.rangeBand()*1.5 - tilde.barheight/2
			}
			return tilde.slots_y(count) + tilde.spacing*2
		})
	d3.selectAll('.fill-label')
		.transition('move_labels')
		.duration(800)
		.attr('y',function(d,i){
			var height = this.getBBox().height
			if (d.assignment === tilde.current_slot) {
				return tilde.slots_y(d.assignment) + tilde.slots_y.rangeBand()*1.5 - tilde.barheight/2
			}
			return tilde.slots_y(d.assignment) + tilde.spacing*2
		})

	d3.selectAll('.tilde-title')
		.attr('font-weight',function(d,i){
			if (d.assignment === tilde.current_slot) {
				return 'bold'
			}
			return 'normal'
		})
		.text(function(d,i){
			return d.n
		})
		.text(function(d,i){
			var output = d.n
				var me = this
				var resolved = false
			if (d.assignment === tilde.current_slot) {
				if (me.getBBox().width > (tilde.width - tilde.margin.left - tilde.margin.right)*0.9) {
					while (!resolved) {
						output = output.substring(0, output.length - 1)
						d3.select(me).text(function(d,i){
							return output + '...'
						})
						if (me.getBBox().width <= (tilde.width - tilde.margin.left - tilde.margin.right)*0.9) {
							resolved = true
							output = output + '...'
						}
					}
				}
			} else {
				if (me.getBBox().width > (tilde.width - tilde.margin.left - tilde.margin.right)*0.45) {
					while (!resolved) {
						output = output.substring(0, output.length - 1)
						d3.select(me).text(function(d,i){
							return output + '...'
						})
						if (me.getBBox().width <= (tilde.width - tilde.margin.left - tilde.margin.right)*0.45) {
							resolved = true
							output = output + '...'
						}
					}
				}
			}
			return output
		})
		.transition('move_titles')
		.duration(800)
		.attr('x',function(d,i){
			var width = this.getBBox().width
			if (d.assignment === tilde.current_slot) {
				return (tilde.width - tilde.margin.left - tilde.margin.right)/2 + width/2
			}
			return (tilde.width - tilde.margin.left - tilde.margin.right)/2
		})
		.attr('y',function(d,i){
			var height = this.getBBox().height
			if (d.assignment === tilde.current_slot) {
				return tilde.slots_y(d.assignment)
			}
			return tilde.slots_y(d.assignment) + tilde.spacing*2
		})
		.attr('fill',function(d,i){
			if (d.assignment !== tilde.current_slot) {
				return 'gray'
			} else {
				return 'black'
			}
		})

}

tilde.tooltips.title = function(d) {
	tilde.tooltip
		.html("<b>"+d.n+'</b>')
		.style("display", "inline-block")

	var w = tilde.tooltip[0][0].offsetWidth/2,
		h = tilde.tooltip[0][0].offsetHeight*1.1;

	tilde.tooltip
		.style("left", d3.event.pageX - w + "px")
		.style("top", d3.event.pageY - h + "px");
}

tilde.tooltips.showDesc = function(d) {
	var sel = d3.select('#tilde_fill_'+tilde.current_slot),
		description = sel.data().d

	tilde.desc_tooltip
		.html(description)
		.style("display", "inline-block")

	tilde.desc_tooltip
		.style("left", d3.event.pageX - w + "px")
		.style("top", d3.event.pageY - h + "px");
}

tilde.tooltips.closeDesc = function(d) {
	tilde.desc_tooltip
		.style("display", "none");
};

tilde.tooltips.mouseout = function(d) {
	tilde.tooltip
		.style("display", "none");
};

tilde.animate.drawTitle = function(d,callback) {
	var g_id = '#tilde_g_'+d.assignment;
	d3.select(g_id)
		.append('text')
		.datum(d)
		.classed('tilde-title',true)
		.style('opacity',0)
		.attr("text-anchor", "end")
		.attr('font-weight',function(d,i){
			if (d.assignment === tilde.current_slot) {
				return 'bold'
			}
			return 'normal'
		})
		.text(function(d,i){
			return d.n
		})
		.style('font-size','65%')
		.text(function(d,i){
			var output = d.n
				var me = this
				var resolved = false
			if (d.assignment === tilde.current_slot) {
				if (me.getBBox().width > (tilde.width - tilde.margin.left - tilde.margin.right)*0.9) {
					while (!resolved) {
						output = output.substring(0, output.length - 1)
						d3.select(me).text(function(d,i){
							return output + '...'
						})
						if (me.getBBox().width <= (tilde.width - tilde.margin.left - tilde.margin.right)*0.9) {
							resolved = true
							output = output + '...'
						}
					}
				}
			} else {
				if (me.getBBox().width > (tilde.width - tilde.margin.left - tilde.margin.right)*0.45) {
					while (!resolved) {
						output = output.substring(0, output.length - 1)
						d3.select(me).text(function(d,i){
							return output + '...'
						})
						if (me.getBBox().width <= (tilde.width - tilde.margin.left - tilde.margin.right)*0.45) {
							resolved = true
							output = output + '...'
						}
					}
				}
			}
			return output
		})
		.attr("dy", "1.2em")
		.attr('x',function(d,i){
			var width = this.getBBox().width
			if (d.assignment === tilde.current_slot) {
				return (tilde.width - tilde.margin.left - tilde.margin.right)/2 + width/2
			}
			return (tilde.width - tilde.margin.left - tilde.margin.right)/2
		})
		.attr('y',function(d,i){
			var height = this.getBBox().height
			if (d.assignment === tilde.current_slot) {
				return tilde.slots_y(d.assignment)
			}
			return tilde.slots_y(d.assignment) + tilde.spacing*2
		})
		.attr('fill',function(d,i){
			if (d.assignment !== tilde.current_slot) {
				return 'gray'
			} else {
				return 'black'
			}
		})
		.on('mousemove',tilde.tooltips.title)
		.on('mouseout',tilde.tooltips.mouseout)
		.transition('draw_title')
		.duration(500)
		.style('opacity',1)
		.each('end',function(d,i){
			if (callback){
				callback()
			}
		})
}

tilde.animate.setViewedTitle = function() {
	var g_id = '#tilde_g_'+tilde.current_slot;
	
}

tilde.animate.setDescription = function(d,callback) {
	var g_id = '#tilde_g_'+d.assignment;
	d3.select(g_id)
		.append('text')
		.datum(d)
		.classed('tilde-title',true)
		.style('opacity',0)
		.attr("text-anchor", "end")
		.attr('font-weight',function(d,i){
			if (d.assignment === tilde.current_slot) {
				return 'bold'
			}
			return 'normal'
		})
		.text(function(d,i){
			return d.n
		})
		.style('font-size','65%')
		.text(function(d,i){
			var output = d.n
				var me = this
				var resolved = false
			if (d.assignment === tilde.current_slot) {
				if (me.getBBox().width > (tilde.width - tilde.margin.left - tilde.margin.right)*0.9) {
					while (!resolved) {
						output = output.substring(0, output.length - 1)
						d3.select(me).text(function(d,i){
							return output + '...'
						})
						if (me.getBBox().width <= (tilde.width - tilde.margin.left - tilde.margin.right)*0.9) {
							resolved = true
							output = output + '...'
						}
					}
				}
			} else {
				if (me.getBBox().width > (tilde.width - tilde.margin.left - tilde.margin.right)*0.45) {
					while (!resolved) {
						output = output.substring(0, output.length - 1)
						d3.select(me).text(function(d,i){
							return output + '...'
						})
						if (me.getBBox().width <= (tilde.width - tilde.margin.left - tilde.margin.right)*0.45) {
							resolved = true
							output = output + '...'
						}
					}
				}
			}
			return output
		})
		.attr("dy", "1.2em")
		.attr('x',function(d,i){
			var width = this.getBBox().width
			if (d.assignment === tilde.current_slot) {
				return (tilde.width - tilde.margin.left - tilde.margin.right)/2 + width/2
			}
			return (tilde.width - tilde.margin.left - tilde.margin.right)/2
		})
		.attr('y',function(d,i){
			var height = this.getBBox().height
			if (d.assignment === tilde.current_slot) {
				return tilde.slots_y(d.assignment)
			}
			return tilde.slots_y(d.assignment) + tilde.spacing*2
		})
		.attr('fill',function(d,i){
			if (d.assignment !== tilde.current_slot) {
				return 'gray'
			} else {
				return 'black'
			}
		})
		.on('mousemove',tilde.tooltips.title)
		.on('mouseout',tilde.tooltips.mouseout)
		.transition('draw_title')
		.duration(500)
		.style('opacity',1)
		.each('end',function(d,i){
			if (callback){
				callback()
			}
		})
}

tilde.animate.drawSelection = function() {
	d3.selectAll('.tilde-selected')
		.classed('tilde-selected',false)

	tilde.current_slot = tilde.choice_slot
	
	var data = tilde.current_selection,
		i;
	for (i = 0; i < 11; i++) {
		if (data[i].selected) {
			tilde.animate.drawTitle(data[i],tilde.animate.select)
			tilde.animate.drawFill(data[i])
			break
		}
	}

	setTimeout(function(){
		tilde.animate.notice('finding_similars')
	},5000)
	
	function drawStaging(data,unit) {
		setTimeout(function(){
			if (!data.selected){
				tilde.animate.brightenBar(unit+1,1200)
				tilde.animate.drawTitle(data)
				tilde.animate.drawFill(data)
			}
			if (unit === 10) {
				setTimeout(function(){
					if (unit === 10) {
						tilde.animate.notice('subheading')
						tilde.animate.showTableHeads()
						tilde.unlocked = true
					}
				},2000)
			}
		},6000+unit*150)
	}
	for (i = 0; i < 11; i++) {
		drawStaging(data[i],i)
	}
	
}

tilde.animate.explainSelection = function() {

}

tilde.animate.drawSimilars = function() {

}