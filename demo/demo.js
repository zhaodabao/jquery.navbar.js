$(document).ready(function() {
var $nav = $("#nav").css("position", "static").navbar({
	menu: [{
		id: "1",
		text: "System",
		icon: "images/system.png",
		action: clickMenu
	}, {
		id: "2",
		text: "Filter",
		icon: "images/filter.png",
		action: clickMenu
	}, {
		id: "3",
		text: "Back",
		icon: "images/back.png",
		action: clickMenu,
		disabled: true
	}, {
		id: "4",
		text: "Format",
		icon: "images/rules.png",
		children: [{
			id: "4.1",
			text: "Vertical...",
			icon: "images/align_middle.png",
			children: [{
				id: "4.1.1",
				text: "Top",
				icon: "images/align_top.png",
				action: clickMenu
			}, {
				id: "4.1.2",
				text: "Middle",
				icon: "images/align_middle.png",
				action: clickMenu
			}, {
				id: "4.1.3",
				text: "Bottom",
				icon: "images/align_bottom.png",
				action: clickMenu
			}]
		}, {
			id: "4.2",
			text: "Horizontal...",
			icon: "images/align_center.png",
			disabled: true,
			children: [{
				id: "4.2.1",
				text: "Left",
				icon: "images/align_left.png",
				action: clickMenu
			}, {
				id: "4.2.2",
				text: "Center",
				icon: "images/align_center.png",
				action: clickMenu
			}, {
				id: "4.2.3",
				text: "Right",
				icon: "images/align_right.png",
				action: clickMenu
			}]
		}, {
			separator: true
		}, {
			id: "4.3",
			text: "Coverage...",
			icon: "images/coverage.png",
			disabled: false,
			children: [{
				id: "4.3.1",
				text: "Move Front",
				icon: "images/move_front.png",
				action: clickMenu
			}, {
				id: "4.3.2",
				text: "Move Back",
				icon: "images/move_back.png",
				action: clickMenu
			}, {
				id: "4.3.3",
				text: "Move Forwards",
				icon: "images/move_forwards.png",
				disabled: true,
				action: clickMenu
			}, {
				id: "4.3.4",
				text: "Move Backwards",
				icon: "images/move_backwards.png",
				disabled: true,
				action: clickMenu
			}]
		}]
	}, {
		id: "5",
		text: "Shapes",
		icon: "images/shapes.png",
		disabled: true,
		children: [{
			id: "5.1",
			text: "Rect",
			icon: "images/shape_rect.png",
			action: clickMenu
		}, {
			id: "5.2",
			text: "Circle",
			icon: "images/shape_circle.png",
			action: clickMenu
		}, {
			id: "5.3",
			text: "Polygon",
			icon: "images/shape_polygon.png",
			action: clickMenu
		}]
	}]
});

$("#shapesAvailable").click(function() {
	$nav.navbar("disabled", "5", false);
});
$("#shapesUnAvailable").click(function() {
	$nav.navbar("disabled", "5", true);
});
$("#changeBack").click(function() {
	$nav.navbar("icon", "3", "images/science.png");
	$nav.navbar("text", "3", "Science");
	$nav.navbar("disabled", "3", false);
});

function clickMenu( m ) {
	alert("you click menu is " + m.text);
}

});