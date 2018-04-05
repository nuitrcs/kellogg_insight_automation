tilde.windowwidth = $(window).width()*0.97;
tilde.windowheight = tilde.windowwidth*1.2;
tilde.margin = {top: tilde.windowwidth*0.01, right: tilde.windowwidth*0.02, bottom: tilde.windowwidth*0.01, left: tilde.windowwidth*0.02};
tilde.width = tilde.windowwidth - tilde.margin.left - tilde.margin.right;
tilde.height = tilde.windowheight - tilde.margin.top - tilde.margin.bottom;
tilde.spacing = tilde.windowwidth*0.008;
tilde.animate = {};
tilde.tooltips = {};
tilde.tooltip = d3.select("body").append("div").attr("class", "tooltip");
tilde.desc_tooltip = d3.select("body").append("div").attr("class", "description_tooltip").style('opacity',0);
tilde.lastloop = 0;

tilde.buildFrame = function() {
	var data = [];
	var domain = []

	for (var i = 1; i <= 11; i++) {
		var obj = {'count':i}
		data.push(obj);
		domain.push(i);
	}

	tilde.slots_y = d3.scale.ordinal().rangeBands([0,tilde.height*0.84])
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
		var targetWidth = container.width(),
			targetHeight = Math.round(targetWidth / aspect);
		chart.attr("width", targetWidth);
		chart.attr("height", targetHeight);
		if (+tilde.desc_tooltip.style('opacity')) {
			console.log(tilde.desc_tooltip.style('opacity'))
			tilde.tooltips.showDesc(targetHeight)
		}
	}).trigger("resize");	

	tilde.g = tilde.job_svg.append('g')
		.attr("transform", "translate(" + tilde.margin.left + "," + tilde.margin.top + ")");

	tilde.slots = tilde.g.selectAll('.tilde-slots')
		.data(data)
		.enter()
		.append('g')
		.attr('id',function(d){
			d3.select(this).attr('data-count',d.count)
			return 'tilde_g_'+d3.select(this).attr('data-count')
		})
		.classed('tilde-slots',true)
		
	tilde.boxes = tilde.slots.append('rect')
		.attr('id',function(d){
			d3.select(this).attr('data-count',d.count)
			return 'tilde_box_'+d3.select(this).attr('data-count')
		})
		.classed('tilde-box',true)
		.attr('x',0)
		.attr('y',function(d){
			return tilde.slots_y(+d3.select(this).attr('data-count'))
		})
		.attr('fill','#E6E6E6')
		.attr('stroke','white')
		.attr('stroke-width',tilde.spacing)
		.attr('width',tilde.width - tilde.margin.left - tilde.margin.right)
		.attr('height',tilde.slots_y.rangeBand())
		
	tilde.bars = tilde.slots.append('rect')
		.attr('id',function(d){
			d3.select(this).attr('data-count',d.count)
			return 'tilde_bar_'+d3.select(this).attr('data-count')
		})
		.classed('tilde-bar',true)
		.attr('x',function(d){
			d.barx = 0
			d.start = 1
			return d.barx
		})
		.attr('y',function(d){
			return tilde.slots_y(+d3.select(this).attr('data-count'))
		})
		.attr('fill','white')
		.attr('stroke','white')
		.attr('stroke-width',0)
		.attr('opacity',1)
		.attr('width',tilde.spacing)
		.attr('height',tilde.slots_y.rangeBand())

	tilde.fills = tilde.slots.append('rect')
		.attr('id',function(d){
			d3.select(this).attr('data-count',d.count)
			return 'tilde_fill_'+d3.select(this).attr('data-count')
		})
		.classed('tilde-fill',true)
		.attr('x',function(d){
			return d.barx
		})
		.attr('y',function(d){
			return tilde.slots_y(+d3.select(this).attr('data-count'))
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
	if (!tilde.choice_slot+1) {
		d3.select(selection)
			.transition('move_bars')
			.duration(2200)
			.delay(function(d,i){
				if (!d.started) {
					d.started = 1
					var count = +d3.select(this).attr('data-count') -1
					return (count)*200
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
				var now = Date.now()
				if (!tilde.choice_slot+1) {
					if (now > tilde.lastloop) {
						tilde.lastloop = now
						tilde.animate.preLoop(me)
					} else {
						tilde.animate.restartLoop()
					}
				}
				
			})
	}
}

tilde.animate.endLoop = function(selection) {
	tilde.animate.notice('option_chosen')
	d3.selectAll("*").transition().delay(0)
	d3.selectAll("*").transition('move_bars').delay(0)
	d3.timer.flush();
	d3.selectAll('.fill-label')
		.remove()
	d3.selectAll('.tilde-title')
		.remove()
	d3.selectAll('.tilde-header')
		.style('opacity',0)
	d3.selectAll('.tilde-bar')
		.attr('opacity',0.4)
	d3.selectAll('.tilde-search-text')
		.remove()
	tilde.tooltips.closeDesc()
	tilde.slots
		.transition()
		.duration(800)
		.attr('transform',function(d,i){
			var count = +d3.select(this).attr('data-count')
			if (count <= tilde.choice_slot) {
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
			if (tilde.choice_slot === count) {
				return 0
			} else {
				return tilde.spacing
			}
		})
		.attr('height',function(d,i){
			var count = +d3.select(this).attr('data-count')
			if (tilde.choice_slot === count) {
				return tilde.slots_y.rangeBand()*3
			} else {
				return tilde.slots_y.rangeBand()
			}
		})
		
	tilde.bars
		.transition('move_bars')
		.duration(0)
	tilde.bars
		.transition('move_bars')
		.duration(0)
	tilde.checked = 0
	tilde.bars
		.each(function(d,i){
			d3.select(this)
				.transition()
				.duration(0)
				.delay(0)
			d3.select(this)
				.transition('move_bars')
				.duration(0)
				.delay(0)
			d3.select(this)
				.transition('move_bars')
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
					var count = +d3.select(this).attr('data-count')
					if (count === tilde.choice_slot) {
						return tilde.slots_y(count) + tilde.slots_y.rangeBand()*1.5 - tilde.barheight/2
					}
					return tilde.slots_y(count) + tilde.spacing*2
				})
				.attr('height',function(d){
					return tilde.barheight
				})
				.attr('width',function(d){
					return tilde.barmax
				})
				.attr('opacity',function(d,i){
					var count = +d3.select(this).attr('data-count')
					if (tilde.choice_slot === count) {
						return 1
					} else {
						return 0.4
					}
				})
				.call(endall,function(d,i){
					tilde.checked++
					tilde.ensureClosure()
				})
		})
		
	tilde.fills
		.transition('move_fills')
		.duration(0)
		.delay(0)
		.attr('height',function(d){
			return tilde.barheight
		})
		.attr('x',function(d){
			return (tilde.width - tilde.margin.left - tilde.margin.right)/2 +tilde.spacing*2
		})
		.attr('y',function(d){
			var count = +d3.select(this).attr('data-count')
			if (count === tilde.choice_slot) {
				return tilde.slots_y(count) + tilde.slots_y.rangeBand()*1.5 - tilde.barheight/2
			}
			return tilde.slots_y(count) + tilde.spacing*2
		})
		.attr('width',0)
		.attr('fill','white')
}

tilde.animate.restartLoop = function() {
	d3.selectAll("*").transition().delay(0)
	d3.selectAll("*").transition('move_bars').delay(0)
	tilde.bars
		.attr('x',function(d){
			d.barx = 0
			d.start = 1
			d.started = 0
			return d.barx
		})
		.each(function(d,i){
			var me = this;
			tilde.animate.preLoop(me)
		})
}

tilde.ensureClosure = function() {
	if (tilde.checked === 11) {
		tilde.animate.drawSelection()
	}
}
tilde.buildFrame()
tilde.animate.prePick()