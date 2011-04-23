#!/usr/bin/env node

/*
 * runpure.js - Takes an input HTML file and applies template substitution.
 * Useful for profiling the performance of different template implementations
 */
var Pure3 = require('./pure3'),
    Pure2 = require('./pure'),
    jsdom = require('jsdom'),
    FS = require('fs')

/* Change this to true if you want to see the final result of the template test on the screen.
 * Keep it false for profiling
 */
var ShowOutput = false

/* Initialize the data and directive such that class names var1, var2 ... varN are 
   mapped to corresponding fields in the data */
function initdata(n) {
	var data = {}
	var directive = {}

	for (var i=0; i<n; i++) {
		var varname = 'var' + (i+1)
		data[varname] = 'Some big string ' + i
		directive['.' + varname] = varname
	}
	return {data: data, directive: directive}
}

/* Substitute data into the template using Pure version 2 */
function runpure2(window, data, directive) {
	Pure2.setWindow(window)
	var template =  window.pure('div.template')
	var rfn = window.pure(template).compile(directive)
	var output = rfn(data)
	if (ShowOutput)
		console.log(output)
}

/* Substitute data into the template using Pure version 3 */
function runpure3(window, data, directive) {
	Pure3.setWindow(window)
	var template =  window.pure('div.template')[0].cloneNode(true) //!templates are not copied by default anymore
	var rfn = window.pure(template).compile(directive) //!the compiled function returns a DOM node, not a string anymore
	
	var output = rfn(data)
	if (ShowOutput)
		console.log(output.innerHTML)
}

/* A simple template substituter using jQuery for benchmarking */
function rundom(window, data, directive) {
	for (var className in directive) {
		var fieldName = directive[className]
		var element = window.document.querySelector(className)
		if (element) {
			element.innerHTML = data[fieldName]
		}
	}
	if (ShowOutput)
		console.log(window.document.innerHTML)
}

/* Utility function to create a window for a given HTML data */
function html2WindowRaw(html) {
	var features = {}
	features.FetchExternalResources = false
	features.ProcessExternalResources = false
	features.QuerySelector = true
	return jsdom.jsdom(html, 0, {features: features}).createWindow()
}

function main(argv) {
	if (argv.length < 5) {
		process.stderr.write("Usage: <runpure.js> <input.html> <count> <v2|v3|dom>\n")
		return
	}
	var path = argv[2]
	var html = FS.readFileSync(path)
	var testCount = parseInt(argv[3])
	var testType = argv[4] 
	var window = html2WindowRaw(html)

	// Initialize test data & directive
	var testset = initdata(testCount)

	if (testType === 'v3') {
		console.log("Profiling template using Pure V3")
		runpure3(window, testset.data, testset.directive)
	} else if (testType == 'v2') {
		console.log("Profiling template using Pure V2")
		runpure2(window, testset.data, testset.directive)
	} else if (testType == 'dom') {
		console.log("Profiling template using DOM")
		rundom(window, testset.data, testset.directive)
	} else {
		process.stderr.write('Unknown template type: ' + testType + '\n')
	}
}

main(process.argv)