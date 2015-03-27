/*global ut */

/// Class: WebGLRenderer
/// Renders the <Viewport> with WebGL.
/// Given decent GPU drivers and browser support, this is the fastest renderer.
///
/// *Note:* This is an internal class used by <Viewport>
ut.WebGLRenderer = function(view) {
	"use strict";
	this.view = view;
	this.canvas = document.createElement("canvas");
	// Try to fetch the context
	if (!this.canvas.getContext) throw("Canvas not supported");
	this.gl = this.canvas.getContext("experimental-webgl");
	if (!this.gl) throw("WebGL not supported");
	var gl = this.gl;
	view.elem.appendChild(this.canvas);

	this.charMap = {};
	this.charArray = [];
	this.defaultColors = { r: 1.0, g: 1.0, b: 1.0, br: 0.0, bg: 0.0, bb: 0.0 };

	this.attribs = {
		position:  { buffer: null, data: null, itemSize: 2, location: null, hint: gl.STATIC_DRAW },
		texCoord:  { buffer: null, data: null, itemSize: 2, location: null, hint: gl.STATIC_DRAW },
		color:     { buffer: null, data: null, itemSize: 3, location: null, hint: gl.DYNAMIC_DRAW },
		bgColor:   { buffer: null, data: null, itemSize: 3, location: null, hint: gl.DYNAMIC_DRAW },
		charIndex: { buffer: null, data: null, itemSize: 1, location: null, hint: gl.DYNAMIC_DRAW }
	};

	function insertQuad(arr, i, x, y, w, h) {
		var x1 = x, y1 = y, x2 = x + w, y2 = y + h;
		arr[  i] = x1; arr[++i] = y1;
		arr[++i] = x2; arr[++i] = y1;
		arr[++i] = x1; arr[++i] = y2;
		arr[++i] = x1; arr[++i] = y2;
		arr[++i] = x2; arr[++i] = y1;
		arr[++i] = x2; arr[++i] = y2;
	}

	this.initBuffers = function() {
		var a, attrib, attribs = this.attribs;
		var w = this.view.w, h = this.view.h;
		// Allocate data arrays
		for (a in this.attribs) {
			attrib = attribs[a];
			attrib.data = new Float32Array(attrib.itemSize * 6 * w * h);
		}
		// Generate static data
		for (var j = 0; j < h; ++j) {
			for (var i = 0; i < w; ++i) {
				// Position & texCoords
				var k = attribs.position.itemSize * 6 * (j * w + i);
				insertQuad(attribs.position.data, k, i * this.tw, j * this.th, this.tw, this.th);
				insertQuad(attribs.texCoord.data, k, 0.0, 0.0, 1.0, 1.0);
			}
		}
		// Upload
		for (a in this.attribs) {
			attrib = attribs[a];
			if (attrib.buffer) gl.deleteBuffer(attrib.buffer);
			attrib.buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, attrib.data, attrib.hint);
			gl.enableVertexAttribArray(attrib.location);
			gl.vertexAttribPointer(attrib.location, attrib.itemSize, gl.FLOAT, false, 0, 0);
		}
	};

	// Create an offscreen canvas for rendering text to texture
	if (!this.offscreen)
		this.offscreen = document.createElement("canvas");
	this.offscreen.style.position = "absolute";
	this.offscreen.style.top = "0px";
	this.offscreen.style.left = "0px";
	this.ctx = this.offscreen.getContext("2d");
	if (!this.ctx) throw "Failed to acquire offscreen canvas drawing context";
	// WebGL drawing canvas
	this.updateStyle();
	this.canvas.width = (view.squarify ? this.th : this.tw) * view.w;
	this.canvas.height = this.th * view.h;
	this.offscreen.width = 0;
	this.offscreen.height = 0;
	// Doing this again since setting canvas w/h resets the state
	this.updateStyle();

	gl.viewport(0, 0, this.canvas.width, this.canvas.height);

	// Setup GLSL
	function compileShader(type, source) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		var ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (!ok) {
			var msg = "Error compiling shader: " + gl.getShaderInfoLog(shader);
			gl.deleteShader(shader);
			throw msg;
		}
		return shader;
	}
	var vertexShader = compileShader(gl.VERTEX_SHADER, ut.WebGLRenderer.VERTEX_SHADER);
	var fragmentShader = compileShader(gl.FRAGMENT_SHADER, ut.WebGLRenderer.FRAGMENT_SHADER);
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);
	var ok = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!ok) {
		var msg = "Error linking program: " + gl.getProgramInfoLog(program);
		gl.deleteProgram(program);
		throw msg;
	}
	gl.useProgram(program);

	// Get attribute locations
	this.attribs.position.location  = gl.getAttribLocation(program, "position");
	this.attribs.texCoord.location  = gl.getAttribLocation(program, "texCoord");
	this.attribs.color.location     = gl.getAttribLocation(program, "color");
	this.attribs.bgColor.location   = gl.getAttribLocation(program, "bgColor");
	this.attribs.charIndex.location = gl.getAttribLocation(program, "charIndex");

	// Setup buffers and uniforms
	this.initBuffers();
	var resolutionLocation = gl.getUniformLocation(program, "uResolution");
	gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
	this.tileCountsLocation = gl.getUniformLocation(program, "uTileCounts");
	gl.uniform2f(this.tileCountsLocation, this.view.w, this.view.h);
	this.paddingLocation = gl.getUniformLocation(program, "uPadding");
	gl.uniform2f(this.paddingLocation, 0.0, 0.0);

	// Setup texture
	//view.elem.appendChild(this.offscreen); // Debug offscreen
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	this.cacheChars(" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~");
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.activeTexture(gl.TEXTURE0);

	var _this = this;
	setTimeout(function() { _this.updateStyle(); _this.buildTexture(); _this.render(); }, 100);
};


/////////////////
// Build texture
ut.WebGLRenderer.prototype.buildTexture = function() {
	"use strict";
	var gl = this.gl;
	var w = this.offscreen.width / (this.tw + this.pad), h = this.offscreen.height / (this.th + this.pad);
	// Check if need to resize the canvas
	var charCount = this.charArray.length;
	if (charCount > Math.floor(w) * Math.floor(h)) {
		w = Math.ceil(Math.sqrt(charCount));
		h = w + 2; // Allocate some extra space too
		this.offscreen.width = w * (this.tw + this.pad);
		this.offscreen.height = h * (this.th + this.pad);
		this.updateStyle();
		gl.uniform2f(this.tileCountsLocation, w, h);
	}
	gl.uniform2f(this.paddingLocation, this.pad / this.offscreen.width, this.pad / this.offscreen.height);

	var c = 0, ch;
	var halfGap = 0.5 * this.gap; // Squarification
	this.ctx.fillStyle = "#000000";
	this.ctx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
	this.ctx.fillStyle = "#ffffff";
	var tw = this.tw + this.pad;
	var th = this.th + this.pad;
	var y = 0.5 * th; // Half because textBaseline is middle
	for (var j = 0; j < h; ++j) {
		var x = this.pad * 0.5;
		for (var i = 0; i < w; ++i, ++c) {
			ch = this.charArray[c];
			if (ch === undefined) break;
			this.ctx.fillText(ch, x + halfGap, y);
			x += tw;
		}
		if (!ch) break;
		y += th;
	}
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.offscreen);
};


///////////////
// Cache chars
ut.WebGLRenderer.prototype.cacheChars = function(chars, build) {
	"use strict";
	if (!this.gl) return; // Nothing to do if not using WebGL renderer
	var changed = false;
	for (var i = 0; i < chars.length; ++i) {
		if (!this.charMap[chars[i]]) {
			changed = true;
			this.charArray.push(chars[i]);
			this.charMap[chars[i]] = this.charArray.length-1;
		}
	}

	if (changed && build !== false) this.buildTexture();
};


////////////////
// Update style
ut.WebGLRenderer.prototype.updateStyle = function(s) {
	"use strict";
	s = s || window.getComputedStyle(this.view.elem, null);
	this.ctx.font = s.fontSize + "/" + s.lineHeight + " " + s.fontFamily;
	this.ctx.textBaseline = "middle";
	this.ctx.fillStyle = "#ffffff";
	this.tw = this.ctx.measureText("M").width;
	this.th = parseInt(s.fontSize, 10);
	this.gap = this.view.squarify ? (this.th - this.tw) : 0;
	if (this.view.squarify) this.tw = this.th;
	this.pad = Math.ceil(this.th * 0.2) * 2.0; // Must be even number
	var color = s.color.match(/\d+/g);
	var bgColor = s.backgroundColor.match(/\d+/g);
	this.defaultColors.r = parseInt(color[0], 10) / 255;
	this.defaultColors.g = parseInt(color[1], 10) / 255;
	this.defaultColors.b = parseInt(color[2], 10) / 255;
	this.defaultColors.br = parseInt(bgColor[0], 10) / 255;
	this.defaultColors.bg = parseInt(bgColor[1], 10) / 255;
	this.defaultColors.bb = parseInt(bgColor[2], 10) / 255;
};

ut.WebGLRenderer.prototype.clear = function() { /* No op */ };


//////////
// Render
ut.WebGLRenderer.prototype.render = function() {
	"use strict";
	var gl = this.gl;
	gl.clear(gl.COLOR_BUFFER_BIT);
	var attribs = this.attribs;
	var w = this.view.w, h = this.view.h;
	// Create new tile data
	var tiles = this.view.buffer;
	var defaultColor = this.view.defaultColor;
	var defaultBgColor = this.view.defaultBackground;
	var newChars = false;
	for (var j = 0; j < h; ++j) {
		for (var i = 0; i < w; ++i) {
			var tile = tiles[j][i];
			var ch = this.charMap[tile.ch];
			if (ch === undefined) { // Auto-cache new characters
				this.cacheChars(tile.ch, false);
				newChars = true;
				ch = this.charMap[tile.ch];
			}
			var k = attribs.color.itemSize * 6 * (j * w + i);
			var kk = attribs.charIndex.itemSize * 6 * (j * w + i);
			var r = tile.r === undefined ? this.defaultColors.r : tile.r / 255;
			var g = tile.g === undefined ? this.defaultColors.g : tile.g / 255;
			var b = tile.b === undefined ? this.defaultColors.b : tile.b / 255;
			var br = tile.br === undefined ? this.defaultColors.br : tile.br / 255;
			var bg = tile.bg === undefined ? this.defaultColors.bg : tile.bg / 255;
			var bb = tile.bb === undefined ? this.defaultColors.bb : tile.bb / 255;
			for (var m = 0; m < 6; ++m) {
				var n = k + m * attribs.color.itemSize;
				attribs.color.data[n+0] = r;
				attribs.color.data[n+1] = g;
				attribs.color.data[n+2] = b;
				attribs.bgColor.data[n+0] = br;
				attribs.bgColor.data[n+1] = bg;
				attribs.bgColor.data[n+2] = bb;
				attribs.charIndex.data[kk+m] = ch;
			}
		}
	}
	// Upload
	if (newChars) this.buildTexture();
	gl.bindBuffer(gl.ARRAY_BUFFER, attribs.color.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, attribs.color.data, attribs.color.hint);
	gl.bindBuffer(gl.ARRAY_BUFFER, attribs.bgColor.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, attribs.bgColor.data, attribs.bgColor.hint);
	gl.bindBuffer(gl.ARRAY_BUFFER, attribs.charIndex.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, attribs.charIndex.data, attribs.charIndex.hint);

	var attrib = this.attribs.position;
	gl.drawArrays(gl.TRIANGLES, 0, attrib.data.length / attrib.itemSize);
};


ut.WebGLRenderer.VERTEX_SHADER = [
	"attribute vec2 position;",
	"attribute vec2 texCoord;",
	"attribute vec3 color;",
	"attribute vec3 bgColor;",
	"attribute float charIndex;",
	"uniform vec2 uResolution;",
	"uniform vec2 uTileCounts;",
	"uniform vec2 uPadding;",
	"varying vec2 vTexCoord;",
	"varying vec3 vColor;",
	"varying vec3 vBgColor;",

	"void main() {",
		"vec2 tileCoords = floor(vec2(mod(charIndex, uTileCounts.x), charIndex / uTileCounts.x));",
		"vTexCoord = (texCoord + tileCoords) / uTileCounts;",
		"vTexCoord += (0.5 - texCoord) * uPadding;",
		"vColor = color;",
		"vBgColor = bgColor;",
		"vec2 pos = position / uResolution * 2.0 - 1.0;",
		"gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);",
	"}"
].join('\n');

ut.WebGLRenderer.FRAGMENT_SHADER = [
	"precision mediump float;",
	"uniform sampler2D uFont;",
	"varying vec2 vTexCoord;",
	"varying vec3 vColor;",
	"varying vec3 vBgColor;",

	"void main() {",
		"vec4 color = texture2D(uFont, vTexCoord);",
		"color.rgb = mix(vBgColor, vColor, color.rgb);",
		"gl_FragColor = color;",
	"}"
].join('\n');
