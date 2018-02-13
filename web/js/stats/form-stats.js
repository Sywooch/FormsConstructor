$(function() {
	
	$('.container').off('pjax:success', '#pjaxStats');
	$('.container').on('pjax:success', '#pjaxStats', function() {
		updatePlot();
	});
	
	updatePlot();
	
	$('.container').on('change', '#statsForm #from, #statsForm #to', function() {
		$('#statsForm').submit();
	});
	
});

function updatePlot() {
	$.plot($("#formStatistics"), [
		{ 
			data: yiiParams.flotSubmissions, 
			label: t('Submissions'), 
			color: "#0f0" 
		},
		{ 
			data: yiiParams.flotViews, 
			label: t('Views'), 
			color: "#ff0" 
		}
	], {
		lines: { show: true, fill: true },
		points: { show: true },
		bars: { show: true, barWidth: 5.5, fill: 0.75 },
		xaxis: { 
			mode: 'time',
			timezone: "browser",
			minTickSize: [1, 'day'],
			maxTickSize: [1, 'day'],
			timeformat: '%d-%m-%Y'
		},
		yaxis: { 
			min: 0,
			tickDecimals: 0
		}
	});
}