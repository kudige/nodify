#!/usr/bin/env node
var prefix = '<html>\n<head>\n<title>This is  big test</title>\n</head>\n<body>\n<h1>This is a big test</h1>\n<div class="template">\n'
var suffix = '</div>\n</body>\n</head>\n'

console.log(prefix)
for (var i=0; i<parseInt(process.argv[2]); i++) {
	var var1 = i*2+1
	var var2 = var1+1
	var line = '<div class="outer">\n<span class="var' + var1 +
		'"></span>\n  <div class="inner">\n	<span class="var' + var2 +
		'"></span>\n  </div>\n</div>\n'
	console.log(line)
}
console.log(suffix)