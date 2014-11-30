var path = require('path');
var fs = require('fs');

var getFiles = function () {
	var dir = process.cwd();
	var symbols = [
		'AAPL',
		'AMZN',
		'CSCO',
		'DELL',
		'EMC',
		'F',
		'GE',
		'GOOG',
		'HP',
		'IBM',
		'MSFT',
		'ORCL',
		'RHT',
		'YHOO'
	];
	var files = symbols.map(function (s) {
		return path.join(dir, s + '.csv')
	});

	return files;
};

function processFile(symbol, data) {
	var lines = data.split('\n');
	var data = [];
	for (var i = 1, len = lines.length; i < len; i++) {
		var columns = lines[i].split(',');
		if (columns.length === 6) {
			data.push( {
				symbol: symbol,
				date: new Date(Date.parse(columns[0])).toJSON(),
				open: columns[1],
				high: columns[2],
				low: columns[3],
				close: columns[4],
				volume: columns[5]
			});
		}
	}

	return data;
}

function processFiles(fileNames) {
	var records = fileNames.map(function (fileName) {
		var symbol = path.basename(fileName, '.csv');
		var contents = fs.readFileSync(fileName, 'utf8');

		return processFile(symbol, contents);
	});

	return records;
};

function loadData() {
	var files = getFiles();
	return processFiles(files);
};

exports.loadData = loadData;
