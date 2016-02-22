/*! jQuery Navigation Bar Plugin v2.0.1
Licensed Zhao Chengjia - MIT License */
(function( $, undefined ) {

var identifiers = {},
	// default consts of core
	_consts = {
		id: {
			context: "jqnavbar",
			option: "navbar-options",
			itemData: "item-data",
			childStatus: "child-menu-status",
			blockOverIndex: "block-over-index"
		},
		event: {
			open: "navbar_openMenu",
			close: "navbar_closeMenu",
			autoClose: "navbar_autoCloseMenu"
		},
		className: {
			container: "navbar",
			nav: "nav",
			block: "block",
			cover: "cover",
			menu: "menu",
			item: "mitem",
			itemOn: "on",
			itemParent: "parent",
			itemDisabled: "disabled",
			itemIcon: "mitemicon"
		}
	},
	// default options
	_setting = {
		/* menu array
		normal menu object format:
		{ id:string, icon:string, text:string, action:function, disabled:boolean, children:array }
		or a separator:
		{ separator:true }*/
		menu: null,
		skin: "bootstrap",
		event: {
			autoClose: "mousedown"
		},
		animation: { // requires jquery.easing.js
			blockMove: "easeOutBack",
			blockMoveDuration: 500,
			verticalExpand: "easeOutBack",
			verticalExpandDuration: 300,
			verticalExpandDelay: 100,
			verticalCollapse: undefined,
			verticalCollapseDuration: 200,
			verticalCollapseDelay: 100,
			horizontalExpand: "easeOutBack",
			horizontalExpandDuration: 300,
			horizontalExpandDelay: 300,
			horizontalCollapse: undefined,
			horizontalCollapseDuration: 200,
			horizontalCollapseDelay: 200
		}
	},
	methods = {
		init: function( opts ) {
			return this.each(function() {
				var _s = $(this),
					options = $.extend({}, _setting, opts);
				methods.destory.call(_s, null);
				_s.data(_consts.id.option, options);
				methods._generateIdentifier.call(_s, null);
				methods.addBar.call(_s, options.menu || []);
				methods._autoCollapse.call(_s, null);
			});
		},
		destory: function() {
			return this.each(function() {
				var _s = $(this),
					_d = _s.data(_consts.id.option);
				if ( !!_d ) {
					_s.removeData(_consts.id.option).children("." + _consts.className.container).remove();
					_d.event.autoClose && _d._identifier &&
						$(document).unbind(_d.event.autoClose + "." + _consts.id.context + _d._identifier);						
				}
			});
		},
		addBar: function( menu ) {
			var _s = this,
				_d = _s.data(_consts.id.option),
				_class = _consts.className,
				$ul = $("<ul/>").addClass(_class.nav).appendTo(
					$("<div/>").addClass(_class.container + " " + _d.skin).appendTo(_s)).append(
					$("<li/>").addClass(_class.block));
			$.each(menu, function( i, m ) {
				!m.separator && methods.addBarItem.call(_s, $ul, m);
			});
			$ul.bind("mouseleave", function() {
				var $$ul = $(this);
				!_d._menu_on && $$ul.children("." + _class.block).stop(true, false).fadeOut(function() {
					$(this).css("opacity", 0).hide();
					_d._menu_on = false;
				});
			});
			$.browser.msie && $ul.bind("selectstart", function() { return false; });
		},
		addMenu: function( $li, menu ) {
			var _s = this,
				$ul = $("<ul/>").addClass(_consts.className.menu).appendTo(
					$("<div/>").addClass(_consts.className.cover).appendTo($li));
			$.each(menu, function( i, m ) {
				m.separator ? methods.addSeparator.call(_s, $ul, m) : methods.addMenuItem.call(_s, $ul, m);
			});
		},
		addBarItem: function( $ul, m ) {
			var _s = this,
				_d = _s.data(_consts.id.option),
				_class = _consts.className,
				_event = _consts.event,
				$li = methods.addItem.call(_s, m).appendTo($ul);
			$li.bind(_event.open, methods.expand).bind(_event.close, methods.collapse).bind("mouseenter", function() {
				var $$li = $(this),
					$block = $ul.children("." + _class.block).data(_consts.id.blockOverIndex, $$li.index());
				if ( $block.is(":hidden") ) {
					methods._disabledBlock.call($block, !!methods.isDisabled.call(_s, $$li));
					$block.css({ width: $$li.outerWidth(), left: $$li.position().left, opacity: 0 })
						.show().stop(true, false).animate({ opacity: 1 }, function() { $(this).css("opacity", 1); });
				} else {
					var offset = { width: $$li.outerWidth(), left: $$li.position().left },
						_anima = _d.animation;
					$$li.siblings().each(function() {
						var $$$li = $(this),
							$cover = $$$li.children("." + _class.cover);
						if ( $cover.is(":visible") ) {
							$$$li.trigger(_event.close, _d);
							return false;
						}
					});
					!methods.isDisabled.call(_s, $$li) && methods._disabledBlock.call($block, false);
					if ( methods.isDisabled.call(_s, $$li) ) methods._disabledBlock.call($block, true);
					else if ( _d._menu_on ) $$li.trigger(_event.open, _d);
					$block.stop(true, false).css("opacity", 1)
					.animate(offset, _anima.blockMoveDuration, _anima.blockMove, function() { $(this).css(offset); });
				}
			}).bind("click", function() {
				var $$li = $(this),
					$cover = $$li.children("." + _class.cover),
					__d = $$li.data(_consts.id.itemData);
				if ( methods.isDisabled.call(_s, $$li) ) {
				} else if ( $cover.length ) {
					$$li.trigger( (_d._menu_on = !_d._menu_on) ? _event.open : _event.close, _d);
				} else {
					_d._menu_on = false;
					$.isFunction(__d.action) && __d.action.call($$li, __d);
				}
				return false;
			});
		},
		addMenuItem: function( $ul, m ) {
			var _s = this,
				_d = _s.data(_consts.id.option),
				_class = _consts.className,
				_event = _consts.event,
				$li = methods.addItem.call(_s, m).appendTo($ul);
			$li.bind(_event.open, methods.expandMenu).bind(_event.close, methods.collapseMenu).bind("mouseenter", function() {
				var $$li = $(this).addClass(_class.itemOn);
				!methods.isDisabled.call(_s, $$li) && $$li.trigger(_event.open, _d);
			}).bind("mouseleave", function() {
				$(this).removeClass(_class.itemOn).trigger(_event.close, _d);
			}).bind("click", function() {
				var $$li = $(this),
					$cover = $$li.children("." + _class.cover),
					__d = $$li.data(_consts.id.itemData);
				if ( methods.isDisabled.call(_s, $$li) ) {
				} else if ( !$cover.length ) {
					$.isFunction(__d.action) && __d.action.call($$li, __d);
					// collapse ohter
					var $parents = $$li.parents("li." + _class.item);
					$parents.each(function( i, _li ) {
						var $$$li = $(_li), _data = null;
						$$$li.removeClass(_class.itemOn);
						_data = (i + 1 !== $parents.length) ? { time: 0, delay: 0} : {};
						$$$li.trigger(_event.close, [ _d, _data ]);
					});
					_d._menu_on = false;
					$$li.parents("ul." + _class.nav + ":first").trigger("mouseleave");
				}
				return false;
			});
		},
		addItem: function( m ) {
			if ( !m ) return null;
			var _s = this,
				_class = _consts.className,
				$li = $("<li/>").addClass(_class.item);
			if ( !m.icon ) $("<label/>").appendTo($li);
			else $("<img/>").addClass(_class.itemIcon).attr("src", m.icon).appendTo($li);
			m.text && $("<a/>").text(m.text).appendTo($li);
			if ( m.children && m.children.length ) {
				$li.addClass(_class.itemParent).append("<span/>");
				methods.addMenu.call(_s, $li, m.children);
			}
			$li.data(_consts.id.itemData, m);
			methods.item.call(_s, m.id, $li);
			m.disabled && methods._disabledItem.call($li, true);
			return $li;
		},
		addSeparator: function( $ul, m ) {
			m && m.separator && $("<li/>").addClass("separator").append("<hr/>").appendTo($ul);
		},
		item: function( id, $li ) {
			var _d = this.data(_consts.id.option),
				index = _d._itemElementIndex || ( _d._itemElementIndex = {} );
			if ( arguments.length === 1 ) return ( id instanceof $ && id.is("." + _consts.className.item) ) ? id : index[id]
			else if ( id && $li ) index[id] = $li;
		},
		close: function( id ) {
			var _class = _consts.className,
				_closeEvent = _consts.event.close;
			if ( arguments.length === 1 && !!id ) {
				var _s = $(this),
					_d = _s.data(_consts.id.option),
					$li = methods.item.call(_s, id);
				return $li.each(function() {
					var _li = $(this);
					_li.parent().is("ul." + _class.nav) && (_d._menu_on = false);
					_li.trigger(_closeEvent, _d);
				});
			} else {
				return this.each(function() {
					var _s = $(this),
						_d = _s.data(_consts.id.option),
						$ul = _s.children("." + _class.container).children("ul." + _class.nav);
					_d._menu_on = false;
					$ul.children("li." + _class.item).each(function() { $(this).trigger(_closeEvent, _d); });
				});
			}
		},
		expand: function( e, _set, d ) {
			var _class = _consts.className,
				_anima = _set.animation,
				$li = $(this),
				$cover = $li.children("." + _class.cover),
				_d = $.extend({
					type: _anima.verticalExpand,
					delay: _anima.verticalExpandDelay,
					duration: _anima.verticalExpandDuration
				}, d);

			if ( $cover.length && $li.data(_consts.id.childStatus) !== "open" ) {
				$li.data(_consts.id.childStatus, "open").addClass(_class.itemOn);
				var $menu = $cover.children(),
					height = $cover.height();
				$menu.css({ top: - height - 10 });
				$cover.css({ height: height + 80, overflow: "hidden" }).show();
				$menu.stop(true, false).delay(_d.delay).animate({ top: 0 }, _d.duration, _d.type, function() {
					$(this).css({ height: "", top: 0 });
					$cover.css({ height: "", overflow: "visible" });
				});
			}
			return false;
		},
		collapse: function( e, _set, d ) {
			var _class = _consts.className,
				_anima = _set.animation,
				$li = $(this),
				$cover = $li.children("." + _class.cover),
				_d = $.extend({
					type: _anima.verticalCollapse,
					delay: _anima.verticalCollapseDelay,
					duration: _anima.verticalCollapseDuration
				}, d);

			if ( $cover.length && $li.data(_consts.id.childStatus) !== "close" ) {
				$li.data(_consts.id.childStatus, "close").removeClass(_class.itemOn);
				var $menu = $cover.children(),
					height = $cover.height();
				$cover.css({ overflow: "hidden" });
				$menu.stop(true, false).delay(_d.delay).animate({ top: - height - 10 }, _d.duration, _d.type, function() {
					$cover.css({ height: "" }).hide();
				});
			}
			return false;
		},
		expandMenu: function( e, _set, d ) {
			var _class = _consts.className,
				_anima = _set.animation,
				$li = $(this),
				$cover = $li.children("." + _class.cover),
				_d = $.extend({
					type: _anima.horizontalExpand,
					delay: _anima.horizontalExpandDelay,
					duration: _anima.horizontalExpandDuration
				}, d);

			if ( $cover.length && $li.data(_consts.id.childStatus) !== "open" ) {
				$li.data(_consts.id.childStatus, "open");
				var $menu = $cover.children(),
					width = $cover.width();
				$menu.css({ left: - width - 10 });
				$cover.css({ width: width + 50, overflow: "hidden" }).show();
				$menu.stop(true, false).delay(_d.delay).animate({ left: 0 }, _d.duration, _d.type, function() {
					$(this).css({ width: "", left: 0 });
					$cover.css({ width: "", overflow: "visible" });
				});
			}
			return false;
		},
		collapseMenu: function( e, _set, d ) {
			var _class = _consts.className,
				_anima = _set.animation,
				$li = $(this),
				$cover = $li.children("." + _class.cover),
				_d = $.extend({
					type: _anima.horizontalCollapse,
					delay: _anima.horizontalCollapseDelay,
					duration: _anima.horizontalCollapseDuration
				}, d);

			if ( $cover.length && $li.data(_consts.id.childStatus) !== "close" ) {
				$li.data(_consts.id.childStatus, "close");
				var $menu = $cover.children(),
					width = $cover.width();
				$cover.css({ overflow: "hidden" });
				$menu.stop(true, false).delay(_d.delay).animate({ left: - width - 10 }, _d.duration, _d.type, function() {
					$cover.css({ width: "" }).hide();
				});
			}
			return false;
		},
		disabled: function( id, status ) {
			return this.each(function() {
				var _s = $(this),
					$li = methods.item.call(_s, id),
					blockHandler = function(status) {
						var $block = _s.children("." + _consts.className.container)
							.children("ul." + _consts.className.nav).children("." + _consts.className.block);
						if ( $li.parent().is("." + _consts.className.nav) &&
							$li.index() === $block.data(_consts.id.blockOverIndex) ) {
							methods._disabledBlock.call($block, status);
							return true;
						}
						return false;
					};
				if ( $li && methods.isDisabled.call(_s, $li) !== status ) {
					if ( status ) {
						methods._disabledItem.call($li, true);
						blockHandler(true);
						methods.close.call(_s, $li);
					} else {
						methods._disabledItem.call($li, false);
						if ( blockHandler(false) ) $li.trigger("mouseenter");
						else $li.is("." + _consts.className.itemOn) && $li.trigger("mouseenter");
					}
				}
			});
		},
		isDisabled: function( id ) {
			var $li = (id instanceof $ && id.is("." + _consts.className.item)) ? id : methods.item.call(this, id);
			return $li && $li.length ? $li.is("." + _consts.className.itemDisabled) : this;
		},
		text: function( id, t ) {
			return this.each(function() {
				var $li = methods.item.call($(this), id);
				$li.data(_consts.id.itemData).text = t;
				$li && $li.children("a").text(t);
			});
		},
		icon: function( id, url ) {
			return this.each(function() {
				var _s = $(this),
					$li = methods.item.call(_s, id);
				$li.data(_consts.id.itemData).icon = url;
				$li && $li.children("img." + _consts.className.itemIcon).attr("src", url);
				!!methods.isDisabled.call(_s, $li) && methods._disabledItem.call($li, true);
			});
		},
		_disabledBlock: function( status ) {
			status ? $(this).addClass(_consts.className.itemDisabled) : $(this).removeClass(_consts.className.itemDisabled);
		},
		_disabledItem: function( status ) {
			var _s = $(this),
				$icon = _s.children("img." + _consts.className.itemIcon),
				_d = _s.data(_consts.id.itemData);
			if ( status ) {
				_s.addClass(_consts.className.itemDisabled);
				!$.support.cssFilter && $icon.length && methods._grayscale($icon);
			} else {
				_s.removeClass(_consts.className.itemDisabled);
				$icon.length && $icon.attr("src", _d.icon);
			}
		},
		_autoCollapse: function() {
			var _s = this,
				_d = _s.data(_consts.id.option);
			if ( _d.event.autoClose && _d._identifier ) {
				var _e = _d.event.autoClose + "." + _consts.id.context + _d._identifier;
				_s.bind(_e, _d, function( e ) {
					var __d = e.data;
					_s.parent().trigger(__d.event.autoClose, __d._identifier);
					return false;
				});
				$(document).bind(_e, _s, function( e, id ) {
					var $s = e.data,
						$d = $s.data(_consts.id.option);
					if ( $d._identifier != id ) {
						methods.close.call($s, null);
						$s.children("." + _consts.className.container).children("ul." + _consts.className.nav).trigger("mouseleave");
					}
				});
			}
		},
		_grayscale: function( $img ) { // grayscale function for ie10 and ie11
			var _img = Array.prototype.slice.call($img)[0],
				imgPixels = null,
				canvas = document.createElement("canvas"),
				ctx = canvas.getContext("2d"),
				width = $img.width(), height = $img.height();
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(_img, 0, 0);
			imgPixels = ctx.getImageData(0, 0, width, height);
			for ( var y = 0; y < imgPixels.height; y++ ) {
				for ( var x = 0; x < imgPixels.width; x++ ) {
					var i = (y * 4) * imgPixels.width + x * 4,
						avg = ( imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2] ) / 3;
					imgPixels.data[i] = avg;
					imgPixels.data[i + 1] = avg;
					imgPixels.data[i + 2] = avg;
				}
			}  
			ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
			$img.attr("src", canvas.toDataURL());
		},
		_generateIdentifier: function() {
			var _d = this.data(_consts.id.option),
				_id = new Date().getTime();
			while ( identifiers[_id] ) _id++;
			identifiers[_id] = true;
			_d._identifier = _id;
		}
	};

$.fn.extend({
	navbar: function() {
		var m = arguments[0];
		if ( methods[m] ) {
			return methods[m].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ( typeof m === "object" || !m ) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " + m + " does not exist in jquery.navbar");
			return this;
		}
	}
});

/* jquery removed browser function from 1.9, patch up it */
$.browser = function() {
	var b = {},
		ua = navigator.userAgent.toLowerCase(),
		matched = function() {
			var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || 
				/(webkit)[ \/]([\w.]+)/.exec(ua) || 
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || 
				/(msie) ([\w.]+)/.exec(ua) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || 
				[];
			return { browser: match[1] || "", version: match[2] || "0" };
		}();

	if ( matched.browser ) {
		b[matched.browser] = true;
		b.version = matched.version;
	}
	if ( b.chrome ) {
		b.webkit = true;
	} else if ( b.webkit ) {
		b.safari = true;
		if ( /version\/(\S+)/i.test(ua) ) {
			b.version = RegExp["$1"];
		} else {
			var _version = "1";
			if ( Number(b.version) < 100 ) _version = "1";
			else if ( Number(b.version) < 312 ) _version = "1.2";
			else if ( Number(b.version) < 412 ) _version = "1.3";
			else _version = "2";
			b.version = _version;
		}
	} else if ( b.mozilla ) {
		if ( /FireFox\/(\S+)/i.test(ua) ) {
			b.version = RegExp["$1"];
		} else if ( !!(ua.match(/trident/) && (ua.match(/rv 11/) || ua.match(/rv:11/))) ) {
			delete b.mozilla;
			b.msie = true;
			b.version = "11.0";
		}
	}
	return b;
}();

/* detect css filter */
$.support.cssFilter = function() {
	var el = document.createElement("div");
	el.style.cssText = (true ? "-webkit-" : "") + "filter: blur(2px)";
	// ie9- only support progid:DXImageTransform.Microsoft filter
	return (el.style.length != 0) && (document.documentMode === undefined || document.documentMode <= 9);
}();

})( jQuery );