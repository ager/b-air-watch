function TreeMap($container, data) {
	this.$container = $container;

	this.createTreeMap = function(data) {
		$container.append(document.createElement('div'));
		var $containerTreeMap = $('div:last', $container).attr('id', 'treemap-' + data.meta.id);
		
		var width = 138;
		var height = 138;

		var treemap = d3.layout.treemap().size([width, height]).sticky(true).value(function(d) {
			if (d.hasOwnProperty('average') && d.average != "---") {
				return d.average * 10;
			}
			return 0;
		});

		var div = d3.select('#treemap-' + data.meta.id);
		
		var node = div.datum(data.data).selectAll(".node").data(treemap.nodes).enter().append("div").attr("class", "node").call(this.getPosition).style("background", function(d) {
			return d.children ? null : ('#' + COLORS[d.name].toString(16));
		}).text(function(d) {
			return d.children ? null : TRANSLATION[d.name];
		});
	}
	
	this.getPosition = function() {
		this.style("left", function(d) {
			return d.x + "px";
		}).style("top", function(d) {
			return d.y + "px";
		}).style("width", function(d) {
			return Math.max(0, d.dx - 1) + "px";
		}).style("height", function(d) {
			return Math.max(0, d.dy - 1) + "px";
		});
	}
	
	this.createTreeMap(data);
}