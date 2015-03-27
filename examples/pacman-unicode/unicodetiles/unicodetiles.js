/// File: unicodetiles.js
/// This file contains the main tile engine namespace.
/// All coordinates are assumed to be integers - behaviour is undefined
/// if you feed in floats (or anything other) as x and y (or similar) parameters.

/*jshint browser:true devel:true trailing:true latedef:true undef:true unused:true newcap:true */

if (!window.console) {
	window.console = { log: function(){}, warn: function(){}, error: function(){} }
}

/// Namespace: ut
/// Container namespace.
var ut = ut || {};

/// Constants: Semi-internal constants for ut namespace
/// VERSION  - Version of the library as string.
/// NULLCHAR - Character used when none is specified otherwise.
/// CSSCLASS - The CSS class name used for the tile engine element.
/// NULLTILE - The tile used as placeholder for empty tile.
ut.VERSION = "2.1";
ut.NULLCHAR = " ";
ut.CSSCLASS = "unicodetiles";
ut.NULLTILE = {}; // Initialized properly after ut.Tile is defined

/// Class: Tile
/// Represents a unicode character tile with various attributes.

/// Constructor: Tile
/// Constructs a new Tile object.
///
/// Parameters:
///   ch - a character to display for this tile
///   r - (optional) red foregorund color component 0-255
///   g - (optional) green foreground color component 0-255
///   b - (optional) blue foreground color component 0-255
///   br - (optional) red background color component 0-255
///   bg - (optional) green background color component 0-255
///   bb - (optional) blue background color component 0-255
ut.Tile = function(ch, r, g, b, br, bg, bb) {
	"use strict";
	this.ch = ch || ut.NULLCHAR;
	this.r = r;
	this.g = g;
	this.b = b;
	this.br = br;
	this.bg = bg;
	this.bb = bb;
};

	/// Function: getChar
	/// Returns the character of this tile.
	ut.Tile.prototype.getChar = function() { return this.ch; };
	/// Function: setChar
	/// Sets the character of this tile.
	ut.Tile.prototype.setChar = function(ch) { this.ch = ch; };
	/// Function: setColor
	/// Sets the foreground color of this tile.
	ut.Tile.prototype.setColor = function(r, g, b) { this.r = r; this.g = g; this.b = b; };
	/// Function: setGrey
	/// Sets the foreground color to the given shade (0-255) of grey.
	ut.Tile.prototype.setGrey = function(grey) { this.r = grey; this.g = grey; this.b = grey; };
	/// Function: setBackground
	/// Sets the background color of this tile.
	ut.Tile.prototype.setBackground = function(r, g, b) { this.br = r; this.bg = g; this.bb = b; };
	/// Function: resetColor
	/// Clears the color of this tile / assigns default color.
	ut.Tile.prototype.resetColor = function() { this.r = this.g = this.b = undefined; };
	/// Function: resetBackground
	/// Clears the background color of this tile.
	ut.Tile.prototype.resetBackground = function() { this.br = this.bg = this.bb = undefined; };
	/// Function: getColorHex
	/// Returns the hexadecimal representation of the color
	ut.Tile.prototype.getColorHex = function() {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return "#" + this.r.toString(16) + this.g.toString(16) + this.b.toString(16);
		else return "";
	};
	/// Function: getBackgroundHex
	/// Returns the hexadecimal representation of the background color
	ut.Tile.prototype.getBackgroundHex = function() {
		if (this.br !== undefined && this.bg !== undefined && this.bb !== undefined)
			return "#" + this.br.toString(16) + this.bg.toString(16) + this.bb.toString(16);
		else return "";
	};
	/// Function: getColorRGB
	/// Returns the CSS rgb(r,g,b) representation of the color
	ut.Tile.prototype.getColorRGB = function() {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return 'rgb('+this.r+','+this.g+','+this.b+')';
		else return "";
	};
	/// Function: getBackgroundRGB
	/// Returns the CSS rgb(r,g,b) representation of the background color
	ut.Tile.prototype.getBackgroundRGB = function() {
		if (this.br !== undefined && this.bg !== undefined && this.bb !== undefined)
			return 'rgb('+this.br+','+this.bg+','+this.bb+')';
		else return "";
	};
	/// Function: getColorJSON
	/// Returns the JSON representation of the color, i.e. object { r, g, b }
	ut.Tile.prototype.getColorJSON = function() {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return { "r": this.r, "g": this.g, "b": this.b };
		else return {};
	};
	/// Function: getBackgroundJSON
	/// Returns the JSON representation of the background color, i.e. object { r, g, b }
	ut.Tile.prototype.getBackgroundJSON = function() {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return { "r": this.br, "g": this.bg, "b": this.bb };
		else return {};
	};
	/// Function: copy
	/// Makes this tile identical to the one supplied. Custom properties are not copied.
	ut.Tile.prototype.copy = function(other) {
		this.ch = other.ch;
		this.r = other.r; this.g = other.g; this.b = other.b;
		this.br = other.br; this.bg = other.bg; this.bb = other.bb;
	};
	/// Function: clone
	/// Returns a new copy of this tile. Custom properties are not cloned.
	ut.Tile.prototype.clone = function() {
		return new ut.Tile(this.ch, this.r, this.g, this.b, this.br, this.bg, this.bb);
	};

ut.NULLTILE = new ut.Tile();


/// Class: Viewport
/// The tile engine viewport / window. Takes care of initializing a proper renderer.

/// Constructor: Viewport
/// Constructs a new Viewport object.
/// If you wish to display a player character at the center, you should use odd sizes.
///
/// Parameters:
///   elem - the DOM element which shall be transformed into the tile engine
///   w - (integer) width in tiles
///   h - (integer) height in tiles
///   renderer - (optional) choose rendering engine, see <Viewport.setRenderer>, defaults to "auto".
///   squarify - (optional) set to true to force the tiles square; may break some box drawing
ut.Viewport = function(elem, w, h, renderer, squarify) {
	"use strict";
	this.elem = elem;
	this.elem.innerHTML = "";
	this.w = w;
	this.h = h;
	this.renderer = null; // setRenderer() is called later
	this.squarify = squarify;
	this.cx = Math.floor(w/2);
	this.cy = Math.floor(h/2);

	// Add CSS class if not added already
	if (elem.className.indexOf(ut.CSSCLASS) === -1) {
		if (elem.className.length === 0) elem.className = ut.CSSCLASS;
		else elem.className += " " + ut.CSSCLASS;
	}

	// Create two 2-dimensional array to hold the viewport tiles
	this.buffer = new Array(h);
	for (var j = 0; j < h; ++j) {
		this.buffer[j] = new Array(w);
		for (var i = 0; i < w; ++i) {
			this.buffer[j][i] = new ut.Tile();
		}
	}

	/// Function: updateStyle
	/// If the style of the parent element is modified, this needs to be called.
	this.updateStyle = function(updateRenderer) {
		var s = window.getComputedStyle(this.elem, null);
		this.defaultColor = s.color;
		this.defaultBackground = s.backgroundColor;
		if (updateRenderer !== false)
			this.renderer.updateStyle(s);
	};

	/// Function: setRenderer
	/// Switch renderer at runtime. All methods fallback to "dom" if unsuccesful.
	/// Possible values:
	///   * "webgl" - Use WebGL with an HTML5 <canvas> element
	///   * "canvas" - Use HTML5 <canvas> element
	///   * "dom" - Use regular HTML element manipulation through DOM
	///   * "auto" - Use best available, i.e. try the above in order, picking the first that works
	this.setRenderer = function(newrenderer) {
		this.elem.innerHTML = "";
		if (newrenderer === "auto" || newrenderer === "webgl") {
			try {
				this.renderer = new ut.WebGLRenderer(this);
			} catch (e) {
				console.error(e);
				newrenderer = "canvas";
				this.elem.innerHTML = "";
			}
		}
		if (newrenderer === "canvas") {
			try {
				this.renderer = new ut.CanvasRenderer(this);
			} catch (e) {
				console.error(e);
				newrenderer = "dom";
				this.elem.innerHTML = "";
			}
		}
		if (newrenderer === "dom") {
			this.renderer = new ut.DOMRenderer(this);
		}
		this.updateStyle(false);
	};

	this.setRenderer(renderer || "auto");
};

	/// Function: getRendererString
	/// Gets the currently used renderer.
	///
	/// Returns:
	///   One of "webgl", "canvas", "dom", "".
	ut.Viewport.prototype.getRendererString = function() {
		if (this.renderer instanceof ut.WebGLRenderer) return "webgl";
		if (this.renderer instanceof ut.CanvasRenderer) return "canvas";
		if (this.renderer instanceof ut.DOMRenderer) return "dom";
		return "";
	};

	/// Function: put
	/// Puts a tile to the given coordinates.
	/// Checks bounds and does nothing if invalid coordinates are given.
	///
	/// Parameters:
	///   tile - the tile to put
	///   x - (integer) x coordinate
	///   y - (integer) y coordinate
	ut.Viewport.prototype.put = function(tile, x, y) {
		if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
		this.buffer[y][x] = tile;
	};

	/// Function: unsafePut
	/// Puts a tile to the given coordinates.
	/// Does *not* check bounds; throws exception if invalid coordinates are given.
	///
	/// Parameters:
	///   tile - the tile to put
	///   x - (integer) x coordinate
	///   y - (integer) y coordinate
	ut.Viewport.prototype.unsafePut = function(tile, x, y) {
		this.buffer[y][x] = tile;
	};

	/// Function: putString
	/// Creates a row of tiles with the chars of the given string.
	/// Wraps to next line if it can't fit the chars on one line.
	///
	/// Parameters:
	///   str - (string) the string to put
	///   x - (integer) x coordinate (column)
	///   y - (integer) y coordinate (row)
	///   r - (optional) red foregorund color component 0-255
	///   g - (optional) green foreground color component 0-255
	///   b - (optional) blue foreground color component 0-255
	///   br - (optional) red background color component 0-255
	///   bg - (optional) green background color component 0-255
	///   bb - (optional) blue background color component 0-255
	ut.Viewport.prototype.putString = function(str, x, y, r, g, b, br, bg, bb) {
		var len = str.length;
		var tile;
		if (x < 0 || y < 0) return;
		for (var i = 0; i < len; ++i) {
			if (x >= this.w) { x = 0; ++y;}
			if (y >= this.h) return;
			tile = new ut.Tile(str[i], r, g, b, br, bg, bb);
			this.unsafePut(tile, x, y);
			++x;
		}
	};

	/// Function: get
	/// Returns the tile in the given coordinates.
	/// Checks bounds and returns empty tile if invalid coordinates are given.
	///
	/// Parameters:
	///   x - (integer) x coordinate
	///   y - (integer) y coordinate
	///
	/// Returns:
	///   The tile.
	ut.Viewport.prototype.get = function(x, y) {
		if (x < 0 || y < 0 || x >= this.w || y >= this.h) return ut.NULLTILE;
		return this.buffer[y][x];
	};

	/// Function: clear
	/// Clears the viewport buffer by assigning empty tiles.
	ut.Viewport.prototype.clear = function() {
		for (var j = 0; j < this.h; ++j) {
			for (var i = 0; i < this.w; ++i) {
				this.buffer[j][i] = ut.NULLTILE;
			}
		}
		this.renderer.clear();
	};

	/// Function: render
	/// Renders the buffer as html to the element specified at construction.
	ut.Viewport.prototype.render = function() {
		this.renderer.render();
	};


/// Class: Engine
/// The tile engine itself.

/// Constructor: Engine
/// Constructs a new Engine object. If width or height is given,
/// it will not attempt to fetch tiles outside the boundaries.
/// In that case 0,0 is assumed as the upper-left corner of the world,
/// but if no width/height is given also negative coords are valid.
///
/// Parameters:
///   vp - the <Viewport> instance to use as the viewport
///   func - the function used for fetching tiles
///   w - (integer) (optional) world width in tiles
///   h - (integer) (optional) world height in tiles
ut.Engine = function(vp, func, w, h) {
	"use strict";
	this.viewport = vp;
	this.tileFunc = func;
	this.w = w;
	this.h = h;
	this.refreshCache = true;
	this.cacheEnabled = false;
	this.transitionTimer = null;
	this.transitionDuration = 0;
	this.transition = null;
	this.cachex = 0;
	this.cachey = 0;
	this.tileCache = new Array(vp.h);
	this.tileCache2 = new Array(vp.h);
	for (var j = 0; j < vp.h; ++j) {
		this.tileCache[j] = new Array(vp.w);
		this.tileCache2[j] = new Array(vp.w);
	}
};

	/// Function: setTileFunc
	/// Sets the function to be called with coordinates to fetch each tile.
	/// Optionally can apply a transition effect. Effects are:
	/// "boxin", "boxout", "circlein", "circleout", "random"
	///
	/// Parameters:
	///   func - function taking parameters (x, y) and returning an ut.Tile
	///   effect - (string) (optional) name of effect to use (see above for legal values)
	///   duration - (integer) (optional) how many milliseconds the transition effect should last
	ut.Engine.prototype.setTileFunc = function(func, effect, duration) {
		"use strict";
		if (effect) {
			this.transition = undefined;
			if (typeof effect === "string") {
				if (effect === "boxin") this.transition = function(x, y, w, h, new_t, old_t, factor) {
					var halfw = w * 0.5, halfh = h * 0.5;
					x -= halfw; y -= halfh;
					if (Math.abs(x) < halfw * factor && Math.abs(y) < halfh * factor) return new_t;
					else return old_t;
				};
				else if (effect === "boxout") this.transition = function(x, y, w, h, new_t, old_t, factor) {
					var halfw = w * 0.5, halfh = h * 0.5;
					x -= halfw; y -= halfh;
					factor = 1.0 - factor;
					if (Math.abs(x) < halfw * factor && Math.abs(y) < halfh * factor) return old_t;
					else return new_t;
				};
				else if (effect === "circlein") this.transition = function(x, y, w, h, new_t, old_t, factor) {
					var halfw = w * 0.5, halfh = h * 0.5;
					x -= halfw; y -= halfh;
					if (x*x + y*y < (halfw*halfw + halfh*halfh) * factor) return new_t;
					else return old_t;
				};
				else if (effect === "circleout") this.transition = function(x, y, w, h, new_t, old_t, factor) {
					var halfw = w * 0.5, halfh = h * 0.5;
					x -= halfw; y -= halfh;
					factor = 1.0 - factor;
					if (x*x + y*y > (halfw*halfw + halfh*halfh) * factor) return new_t;
					else return old_t;
				};
				else if (effect === "random") this.transition = function(x, y, w, h, new_t, old_t, factor) {
					if (Math.random() > factor) return old_t;
					else return new_t;
				};
			}
			if (this.transition) {
				this.transitionTimer = (new Date()).getTime();
				this.transitionDuration = duration || 500;
			}
		}
		this.tileFunc = func;
	};

	/// Function: setMaskFunc
	/// Sets the function to be called to fetch mask information according to coordinates.
	/// If mask function returns false to some coordinates, then that tile is not rendered.
	///
	/// Parameters:
	///   func - function taking parameters (x, y) and returning a true if the tile is visible
	ut.Engine.prototype.setMaskFunc = function(func) { this.maskFunc = func; };

	/// Function: setShaderFunc
	/// Sets the function to be called to post-process / shade each visible tile.
	/// Shader function is called even if caching is enabled, see <Engine.setCacheEnabled>.
	///
	/// Parameters:
	///   func - function taking parameters (tile, x, y) and returning an ut.Tile
	ut.Engine.prototype.setShaderFunc = function(func) { this.shaderFunc = func; };

	/// Function: setWorldSize
	/// Tiles outside of the range x = [0,width[; y = [0,height[ are not fetched.
	/// Set to undefined in order to make the world infinite.
	///
	/// Parameters:
	///   width - (integer) new world width
	///   height - (integer) new world height
	ut.Engine.prototype.setWorldSize = function(width, height) { this.w = width; this.h = height; };

	/// Function: setCacheEnabled
	/// Enables or disables the usage of tile cache. This means that
	/// extra measures are taken to not call the tile function unnecessarily.
	/// This means that all animating must be done in a shader function,
	/// see <Engine.setShaderFunc>.
	/// Cache is off by default, but should be enabled if the tile function
	/// does more computation than a simple array look-up.
	///
	/// Parameters:
	///   mode - true to enable, false to disable
	ut.Engine.prototype.setCacheEnabled = function(mode) { this.cacheEnabled = mode; this.refreshCache = true; };

	/// Function: update
	/// Updates the viewport according to the given player coordinates.
	/// The algorithm goes as follows:
	///   * Record the current time
	///   * For each viewport tile:
	///   * Check if the tile is visible by testing the mask
	///   * If not visible, continue to the next tile in the viewport
	///   * Otherwise, if cache is enabled try to fetch the tile from there
	///   * Otherwise, call the tile function and check for shader function presence
	///   * If there is shader function, apply it to the tile, passing the recorded time
	///   * Put the tile to viewport
	///
	/// Parameters:
	///   x - (integer) viewport center x coordinate in the tile world
	///   y - (integer) viewport center y coordinate in the tile world
	ut.Engine.prototype.update = function(x, y) {
		"use strict";
		x = x || 0;
		y = y || 0;
		// World coords of upper left corner of the viewport
		var xx = x - this.viewport.cx;
		var yy = y - this.viewport.cy;
		var timeNow = (new Date()).getTime(); // For passing to shaderFunc
		var transTime;
		if (this.transition) transTime = (timeNow - this.transitionTimer) / this.transitionDuration;
		if (transTime >= 1.0) this.transition = undefined;
		var tile;
		// For each tile in viewport...
		for (var j = 0; j < this.viewport.h; ++j) {
			for (var i = 0; i < this.viewport.w; ++i) {
				var ixx = i+xx, jyy = j+yy;
				// Check horizontal bounds if requested
				if (this.w && (ixx < 0 || ixx >= this.w)) {
					tile = ut.NULLTILE;
				// Check vertical bounds if requested
				} else if (this.h && (jyy < 0 || jyy >= this.w)) {
					tile = ut.NULLTILE;
				// Check mask
				} else if (this.maskFunc && !this.maskFunc(ixx, jyy)) {
					tile = ut.NULLTILE;
				// Check transition effect
				} else if (this.transition && !this.refreshCache) {
					tile = this.transition(i, j, this.viewport.w, this.viewport.h,
						this.tileFunc(ixx, jyy), this.tileCache[j][i], transTime);
				// Check cache
				} else if (this.cacheEnabled && !this.refreshCache) {
					var lookupx = ixx - this.cachex;
					var lookupy = jyy - this.cachey;
					if (lookupx >= 0 && lookupx < this.viewport.w && lookupy >= 0 && lookupy < this.viewport.h) {
						tile = this.tileCache[lookupy][lookupx];
						if (tile === ut.NULLTILE) tile = this.tileFunc(ixx, jyy);
					} else // Cache miss
						tile = this.tileFunc(ixx, jyy);
				// If all else fails, call tileFunc
				} else tile = this.tileFunc(ixx, jyy);
				// Save the tile to cache (always due to transition effects)
				this.tileCache2[j][i] = tile;
				// Apply shader function
				if (this.shaderFunc && tile !== ut.NULLTILE)
					tile = this.shaderFunc(tile, ixx, jyy, timeNow);
				// Put shaded tile to viewport
				this.viewport.unsafePut(tile, i, j);
			}
		}
		// Cache stuff is enabled always, because it is also required by transitions
		// Save the new cache origin
		this.cachex = xx;
		this.cachey = yy;
		// Swap cache buffers
		var tempCache = this.tileCache;
		this.tileCache = this.tileCache2;
		this.tileCache2 = tempCache;
		this.refreshCache = false;
	};
