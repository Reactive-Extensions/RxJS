/// File: input.js
/// This file contains a very simple input system.

/*jshint browser:true */

/// Namespace: ut
/// Container namespace.
var ut = ut || {};

/// Constants: Keycodes
/// KEY_BACKSPACE - 8
/// KEY_TAB - 9
/// KEY_ENTER - 13
/// KEY_SHIFT - 16
/// KEY_CTRL - 17
/// KEY_ALT - 18
/// KEY_ESCAPE - 27
/// KEY_SPACE - 32
/// KEY_LEFT - 37
/// KEY_UP - 38
/// KEY_RIGHT - 39
/// KEY_DOWN - 40
/// KEY_0 - 48
/// KEY_1 - 49
/// KEY_2 - 50
/// KEY_3 - 51
/// KEY_4 - 52
/// KEY_5 - 53
/// KEY_6 - 54
/// KEY_7 - 55
/// KEY_8 - 56
/// KEY_9 - 57
/// KEY_A - 65
/// KEY_B - 66
/// KEY_C - 67
/// KEY_D - 68
/// KEY_E - 69
/// KEY_F - 70
/// KEY_G - 71
/// KEY_H - 72
/// KEY_I - 73
/// KEY_J - 74
/// KEY_K - 75
/// KEY_L - 76
/// KEY_M - 77
/// KEY_N - 78
/// KEY_O - 79
/// KEY_P - 80
/// KEY_Q - 81
/// KEY_R - 82
/// KEY_S - 83
/// KEY_T - 84
/// KEY_U - 85
/// KEY_V - 86
/// KEY_W - 87
/// KEY_X - 88
/// KEY_Y - 89
/// KEY_Z - 90
/// KEY_NUMPAD0 - 96
/// KEY_NUMPAD1 - 97
/// KEY_NUMPAD2 - 98
/// KEY_NUMPAD3 - 99
/// KEY_NUMPAD4 - 100
/// KEY_NUMPAD5 - 101
/// KEY_NUMPAD6 - 102
/// KEY_NUMPAD7 - 103
/// KEY_NUMPAD8 - 104
/// KEY_NUMPAD9 - 105
/// KEY_F1 - 112
/// KEY_F2 - 113
/// KEY_F3 - 114
/// KEY_F4 - 115
/// KEY_F5 - 116
/// KEY_F6 - 117
/// KEY_F7 - 118
/// KEY_F8 - 119
/// KEY_F9 - 120
/// KEY_F10 - 121
/// KEY_F11 - 122
/// KEY_F12 - 123
/// KEY_COMMA - 188
/// KEY_DASH - 189
/// KEY_PERIOD - 190

ut.KEY_BACKSPACE = 8;
ut.KEY_TAB = 9;
ut.KEY_ENTER = 13;
ut.KEY_SHIFT = 16;
ut.KEY_CTRL = 17;
ut.KEY_ALT = 18;
ut.KEY_ESCAPE = 27;
ut.KEY_SPACE = 32;
ut.KEY_LEFT = 37;
ut.KEY_UP = 38;
ut.KEY_RIGHT = 39;
ut.KEY_DOWN = 40;

ut.KEY_0 = 48;
ut.KEY_1 = 49;
ut.KEY_2 = 50;
ut.KEY_3 = 51;
ut.KEY_4 = 52;
ut.KEY_5 = 53;
ut.KEY_6 = 54;
ut.KEY_7 = 55;
ut.KEY_8 = 56;
ut.KEY_9 = 57;
ut.KEY_A = 65;
ut.KEY_B = 66;
ut.KEY_C = 67;
ut.KEY_D = 68;
ut.KEY_E = 69;
ut.KEY_F = 70;
ut.KEY_G = 71;
ut.KEY_H = 72;
ut.KEY_I = 73;
ut.KEY_J = 74;
ut.KEY_K = 75;
ut.KEY_L = 76;
ut.KEY_M = 77;
ut.KEY_N = 78;
ut.KEY_O = 79;
ut.KEY_P = 80;
ut.KEY_Q = 81;
ut.KEY_R = 82;
ut.KEY_S = 83;
ut.KEY_T = 84;
ut.KEY_U = 85;
ut.KEY_V = 86;
ut.KEY_W = 87;
ut.KEY_X = 88;
ut.KEY_Y = 89;
ut.KEY_Z = 90;
ut.KEY_NUMPAD0 = 96;
ut.KEY_NUMPAD1 = 97;
ut.KEY_NUMPAD2 = 98;
ut.KEY_NUMPAD3 = 99;
ut.KEY_NUMPAD4 = 100;
ut.KEY_NUMPAD5 = 101;
ut.KEY_NUMPAD6 = 102;
ut.KEY_NUMPAD7 = 103;
ut.KEY_NUMPAD8 = 104;
ut.KEY_NUMPAD9 = 105;
ut.KEY_F1 = 112;
ut.KEY_F2 = 113;
ut.KEY_F3 = 114;
ut.KEY_F4 = 115;
ut.KEY_F5 = 116;
ut.KEY_F6 = 117;
ut.KEY_F7 = 118;
ut.KEY_F8 = 119;
ut.KEY_F9 = 120;
ut.KEY_F10 = 121;
ut.KEY_F11 = 122;
ut.KEY_F12 = 123;

ut.KEY_COMMA = 188;
ut.KEY_DASH = 189;
ut.KEY_PERIOD = 190;


ut.pressedKeys = {};
ut.keyRepeatDelay = 150;

/// Function: isKeyPressed
/// Checks if given key is pressed down. You must call <ut.initInput> first.
///
/// Parameters:
///   key - key code to check
///
/// Returns:
///    True if the key is pressed down, false otherwise.
ut.isKeyPressed = function(key) {
	"use strict";
	if (ut.pressedKeys[key]) return true;
	else return false;
};

/// Function: setKeyRepeatInterval
/// Sets the interval when user's onKeyDown handler is called when a key is held down.
/// <ut.initInput> must be called with a handler for this to work.
///
/// Parameters:
///   milliseconds - the interval delay in milliseconds (1 second = 1000 milliseconds)
ut.setKeyRepeatInterval = function(milliseconds) {
	"use strict";
	ut.keyRepeatDelay = milliseconds;
};

/// Function: initInput
/// Initilizes input by assigning default key handlers and optional user's handlers.
/// This must be called in order to <ut.isKeyPressed> to work.
///
/// Parameters:
///   onkeydown - (optional) function(keyCode) for key down event handler
///   onkeyup - (optional) function(keyCode) for key up event handler
ut.initInput = function(onKeyDown, onKeyUp) {
	ut.onkeydown = onKeyDown;
	ut.onkeyup = onKeyUp;
	// Attach default onkeydown handler that updates pressedKeys
	document.onkeydown = function(event) {
		"use strict";
		var k = event.keyCode;
		if (ut.pressedKeys[k] !== null && ut.pressedKeys[k] !== undefined) return false;
		ut.pressedKeys[k] = true;
		if (ut.onkeydown) {
			ut.onkeydown(k); // User event handler
			// Setup keyrepeat
			ut.pressedKeys[k] = setInterval("ut.onkeydown("+k+")", ut.keyRepeatDelay);
		}
		if (ut.pressedKeys[ut.KEY_CTRL] || ut.pressedKeys[ut.KEY_ALT])
			return true; // CTRL/ALT for browser hotkeys
		else return false;
	};
	// Attach default onkeyup handler that updates pressedKeys
	document.onkeyup = function(event) {
		"use strict";
		var k = event.keyCode;
		if (ut.onkeydown && ut.pressedKeys[k] !== null && ut.pressedKeys[k] !== undefined)
			clearInterval(ut.pressedKeys[k]);
		ut.pressedKeys[k] = null;
		if (ut.onkeyup) ut.onkeyup(k); // User event handler
		return false;
	};
	// Avoid keys getting stuck at down
	window.onblur = function() {
		"use strict";
		for (var k in ut.pressedKeys)
			if (ut.onkeydown && ut.pressedKeys[k] !== null)
				clearInterval(ut.pressedKeys[k]);
		ut.pressedKeys = {};
	};
};

