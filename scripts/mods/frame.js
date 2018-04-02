tilde.windowwidth = $(window).width()*0.97;
tilde.windowheight = tilde.windowwidth*1.2;
tilde.margin = {top: tilde.windowwidth*0.01, right: tilde.windowwidth*0.02, bottom: tilde.windowwidth*0.01, left: tilde.windowwidth*0.02};
tilde.width = tilde.windowwidth - tilde.margin.left - tilde.margin.right;
tilde.height = tilde.windowheight - tilde.margin.top - tilde.margin.bottom;
tilde.spacing = tilde.windowwidth*0.008;
tilde.animate = {};

tilde.buildFrame = function() {
	var data = [];
	var domain = []

	for (var i = 1; i <= 13; i++) {
		var obj = {'count':i}
		data.push(obj);
		domain.push(i);
	}

	tilde.slots_y = d3.scale.ordinal().rangeBands([0,tilde.height])
		.domain(domain);

	tilde.job_svg = d3.select('#job_svg')
		.append('svg')
		.attr('width',tilde.width)
		.attr('height',tilde.height)
		.attr("viewBox", function(){
			return "0 0 "+tilde.width+" "+tilde.height
		})
		.attr("preserveAspectRatio","xMinYMid")
		.attr("id","job_chart");

	var chart = $("#job_chart"),
		aspect = chart.width() / chart.height(),
		container = chart.parent();

	$(window).on("resize", function() {
		var targetWidth = container.width();
		chart.attr("width", targetWidth);
		chart.attr("height", Math.round(targetWidth / aspect));
	}).trigger("resize");	

	tilde.g = tilde.job_svg.append('g')
		.attr("transform", "translate(" + tilde.margin.left + "," + tilde.margin.top + ")");

	tilde.slots = tilde.g.selectAll('.tilde-slots')
		.data(data)
		.enter()
		.append('g')
		.attr('id',function(d){
			return 'tilde_g_'+d.count
		})
		.classed('tilde-slots',true)
		
	tilde.boxes = tilde.slots.append('rect')
		.attr('id',function(d){
			return 'tilde_box_'+d.count
		})
		.classed('tilde-box',true)
		.attr('x',0)
		.attr('y',function(d){
			return tilde.slots_y(d.count)
		})
		.attr('fill','#E6E6E6')
		.attr('stroke','white')
		.attr('stroke-width',tilde.spacing)
		.attr('width',tilde.width - tilde.margin.left - tilde.margin.right)
		.attr('height',tilde.slots_y.rangeBand())
		
	tilde.bars = tilde.slots.append('rect')
		.attr('id',function(d){
			return 'tilde_bar_'+d.count
		})
		.classed('tilde-bar',true)
		.attr('x',function(d){
			d.barx = 0
			d.start = 1
			return d.barx
		})
		.attr('y',function(d){
			return tilde.slots_y(d.count)
		})
		.attr('fill','white')
		.attr('stroke','white')
		.attr('stroke-width',0)
		.attr('opacity',1)
		.attr('width',tilde.spacing)
		.attr('height',tilde.slots_y.rangeBand())

	tilde.fills = tilde.slots.append('rect')
		.attr('id',function(d){
			return 'tilde_fill_'+d.count
		})
		.classed('tilde-fill',true)
		.attr('x',function(d){
			return d.barx
		})
		.attr('y',function(d){
			return tilde.slots_y(d.count)
		})
		.attr('fill','white')
		.attr('stroke','white')
		.attr('stroke-width',0)
		.attr('width',0)
		.attr('height',tilde.slots_y.rangeBand())

	tilde.barmax = (tilde.width - tilde.margin.left - tilde.margin.right)/2 -tilde.spacing*4
	tilde.barheight = tilde.slots_y.rangeBand() - tilde.spacing*4
}

tilde.animate.prePick = function() {
	tilde.bars
		.each(function(d,i){
			var me = this;
			tilde.animate.preLoop(me)
		})
}

tilde.animate.preLoop = function(selection) {
	d3.select(selection)
		.transition()
		.duration(2300)
		.delay(function(d,i){
			if (!d.started) {
				d.started = 1
				return (d.count-1)*200
			}
			return 0
		})
		.attr('x',function(d){
			if (d.start) {
				d.barx = tilde.width - tilde.margin.left - tilde.margin.right
				d.start = 0
			} else {
				d.barx = 0
				d.start = 1
			}
			
			return d.barx
		})
		.each('end',function(d,i){
			var me = this;
			tilde.animate.preLoop(me)
		})
}

tilde.animate.endLoop = function(selection) {
	tilde.animate.notice('option_chosen')
	tilde.boxes
		.transition()
		.duration(800)
		.attr('stroke-width',function(d,i){
			if (tilde.choice_slots[i+1]) {
				return 0
			} else {
				return tilde.spacing
			}
		})
	tilde.fills
		.transition()
		.duration(0)
		.attr('x',function(d){
			d.barx = (tilde.width - tilde.margin.left - tilde.margin.right)/2 +tilde.spacing*2
			d.start = 0
			return d.barx
		})
		.attr('y',function(d){
			return tilde.slots_y(d.count) + tilde.spacing*2
		})
		.attr('width',0)
		.attr('fill','white')
		.attr('height',function(d){
			return tilde.barheight
		})
	tilde.bars
		.transition()
		.duration(0)
	tilde.bars
		.transition()
		.duration(0)
	tilde.bars
		.transition()
		.duration(800)
		.delay(function(d,i){
			return 0
		})
		.attr('x',function(d){
			d.barx = (tilde.width - tilde.margin.left - tilde.margin.right)/2 +tilde.spacing*2
			d.start = 0
			return d.barx
		})
		.attr('y',function(d){
			return tilde.slots_y(d.count) + tilde.spacing*2
		})
		.attr('height',function(d){
			return tilde.barheight
		})
		.attr('width',function(d){
			return tilde.barmax
		})
		.attr('opacity',function(d,i){
			if (tilde.choice_slots[i+1]) {
				if (tilde.choice_slots[i] && tilde.choice_slots[i+2]) {
					return 1
				} else {
					return 0
				}
			} else {
				return 0.4
			}
		})
		.call(endall,tilde.animate.ensureClosure)
}

tilde.animate.ensureClosure = function() {
	tilde.bars
		.transition()
		.duration(0)
	tilde.bars
		.transition()
		.duration(0)
	tilde.bars
		.transition()
		.duration(0)
		.delay(function(d,i){
			return 0
		})
		.attr('x',function(d){
			d.barx = (tilde.width - tilde.margin.left - tilde.margin.right)/2 +tilde.spacing*2
			d.start = 0
			return d.barx
		})
		.attr('y',function(d){
			return tilde.slots_y(d.count) + tilde.spacing*2
		})
		.attr('height',function(d){
			return tilde.barheight
		})
		.attr('width',function(d){
			return tilde.barmax
		})
		.attr('opacity',function(d,i){
			if (tilde.choice_slots[i+1]) {
				if (tilde.choice_slots[i] && tilde.choice_slots[i+2]) {
					return 1
				} else {
					return 0
				}
			} else {
				return 0.4
			}
		})
		.call(endall,tilde.animate.drawSelection)
}

tilde.buildFrame()
tilde.animate.prePick()