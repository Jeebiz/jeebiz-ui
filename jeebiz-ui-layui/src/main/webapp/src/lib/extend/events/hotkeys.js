/**
 * 整合 jquery.fn.hotkeys
 * @returns
 */
layui.define(["jquery"], function (exports) {
	var jQuery = layui.jquery;
	
	/*
	 * jQuery Hotkeys Plugin
	 * Copyright 2018, John Resig
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 *
	 * Based upon the plugin by Tzury Bar Yochay:
	 * http://github.com/tzuryby/hotkeys
	 *
	 * Original idea by:
	 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
	 * 
	 */

	/*
	 * One small change is: now keys are passed by object { keys: '...' }
	 * Might be useful, when you want to pass some other data to your handler
	 * 
	 * Based upon the plugin by Tzury Bar Yochay:
	 * https://github.com/jeresig/jquery.hotkeys
	 * 
	 */
	(function(jQuery){
		
		jQuery.hotkeys = {
				
			version: "1.0",

			specialKeys: {
				8 : "backspace", 
				9 : "tab", 
				10: "return", 
				13: "return", 
				16: "shift", 
				17: "ctrl", 
				18: "alt", 
				19: "pause",
				20: "capslock", 
				27: "esc", 
				32: "space", 
				33: "pageup", 
				34: "pagedown", 
				35: "end", 
				36: "home",
				37: "left", 
				38: "up", 
				39: "right", 
				40: "down", 
				45: "insert", 
				46: "del", 
				59: ";", 
				61: "=",
				96: "0", 
				97: "1", 
				98: "2", 
				99: "3", 
				100: "4", 
				101: "5", 
				102: "6", 
				103: "7",
				104: "8", 
				105: "9", 
				106: "*", 
				107: "+", 
				109: "-", 
				110: ".", 
				111 : "/", 
				112: "f1", 
				113: "f2", 
				114: "f3", 
				115: "f4", 
				116: "f5", 
				117: "f6", 
				118: "f7", 
				119: "f8", 
				120: "f9", 
				121: "f10", 
				122: "f11", 
				123: "f12", 
				144: "numlock", 
				145: "scroll", 
				173: "-",
				186: ";", 
				187: "=",
				188: ",",
				189: "-",
				190: ".",
				191: "/",
				192: "`",
				219: "[",	
				220: "\\",
				221: "]",
				222: "'",
				224: "meta"
			},
		
			shiftNums: {
				"`": "~", 
				"1": "!", 
				"2": "@", 
				"3": "#", 
				"4": "$", 
				"5": "%", 
				"6": "^", 
				"7": "&", 
				"8": "*", 
				"9": "(", 
				"0": ")", 
				"-": "_", 
				"=": "+", 
				";": ": ", 
				"'": "\"", 
				",": "<", 
				".": ">",  
				"/": "?",  
				"\\": "|"
			},
			
			// excludes: button, checkbox, file, hidden, image, password, radio, reset, search, submit, url
		    textAcceptingInputTypes: [ "text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color", "tel"],

		    // default input types not to bind to unless bound directly
		    textInputTypes: /textarea|input|select/i,

		    options: {
		    	filterInputAcceptingElements: true,
		    	filterTextInputs: true,
		    	filterContentEditable: true,
		    	filterEvent : function (){
		    		return false;
		    	}
		    }
			
		};

		function keyHandler( handleObj ) {
			try{
				// fix data is string
				if (typeof handleObj.data === "string") {
					handleObj.data = {
				        keys: handleObj.data
					};
				}
				
				// Only care when a possible input has been specified
			    if (!handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string") {
			    	return;
			    }
			    
			    //cache origin handler
				var origHandler = handleObj.handler,
				 	keys = handleObj.data.keys.toLowerCase().split(" ");
				
				//set new handler
				handleObj.handler = function( event ) {
					
					/* Don't fire in text-accepting inputs that we didn't directly bind to */
					var filterInputAcceptingElements = handleObj.data.filterInputAcceptingElements || jQuery.hotkeys.options.filterInputAcceptingElements;
					var filterContentEditable = handleObj.data.filterContentEditable || jQuery.hotkeys.options.filterContentEditable;
					var filterTextInputs = handleObj.data.filterTextInputs || jQuery.hotkeys.options.filterTextInputs;
					var filterEvent = handleObj.data.filterEvent || jQuery.hotkeys.options.filterEvent;
					if (this !== event.target &&
							(filterInputAcceptingElements && jQuery.hotkeys.textInputTypes.test(event.target.nodeName) ||
							(filterContentEditable && jQuery(event.target).attr('contenteditable')) ||
							(filterTextInputs && jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1)) ||
							(filterEvent.call(this , event) == true )
					) {
						return;
					}
					console.log(event.which);
					// Keypress represents characters, not special keys
					var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
						character = String.fromCharCode( event.which ).toLowerCase(),
						modif = "", 
						possible = {};
		
					// check combinations (alt|ctrl|shift+anything)
					jQuery.each(["alt", "ctrl", "shift"], function(index, specialKey) {
						//event[specialKey + 'Key'] = event.altKey,event.ctrlKey,event.shiftKey
				        if (event[specialKey + 'Key'] && special !== specialKey) {
				        	modif += specialKey + '+';
				        }
				    });
					
					// metaKey is triggered off ctrlKey erronously
					// TODO: Need to make sure this works consistently across platforms
					if ( event.metaKey && !event.ctrlKey && special !== "meta") {
						modif += "meta+";
					}

					if (event.metaKey && special !== "meta" && modif.indexOf("alt+ctrl+shift+") > -1) {
						modif = modif.replace("alt+ctrl+shift+", "hyper+");
					}
					// is special
					if ( special ) {
						
						possible[ modif + special ] = true;
		
					} else {
						
						possible[ modif + character ] = true;
						possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;
		
						// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
						if ( modif === "shift+" ) {
							possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
						}
					}
		
					for ( var i = 0, l = keys.length; i < l; i++ ) {
						if ( possible[ keys[i] ] ) {
							return origHandler.apply( this, arguments );
						}
					}
				};
			}catch(e){}
		}

		jQuery.each([ "keydown", "keyup", "keypress" ], function() {
			jQuery.event.special[ this ] = { 
				add: keyHandler
			};
		});

	})( jQuery || window.jQuery);
	
	exports('hotkeys', {});
});