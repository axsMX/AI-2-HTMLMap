﻿/*
==================================
Written by Carlos Cabo 2013

================================== 
*/

#target illustrator
#script "HTML Map From AI Shapes"

/*
==================================
INTERFACE / UI
================================== 
*/

openURL = function(url) {
	var fname = "shortcut.url";
	var shortcut = new File(Folder.temp + '/' + fname);
	shortcut.open('w');
	shortcut.writeln('[InternetShortcut]');
	shortcut.writeln('URL=' + url);
	shortcut.writeln();
	shortcut.close();
	shortcut.execute();
	shortcut.remove();
};

generateHTMLMap = function () {
	if (documents.length > 0 && activeDocument.pathItems.length > 0) {

	var sourceDoc = activeDocument;
	var items = selection;
	var textRefs = sourceDoc.textFrames;
	var pathRefs = sourceDoc.pathItems;
	var symRefs = sourceDoc.symbolItems;
	var resultingMap = '<img src="/REPLACE_FOR_IMAGE_PATH.png" width="' + sourceDoc.width + '" height="' + sourceDoc.height + '" alt="Image description" usemap="#mapname">\n<map name="mapname">\n';
	var i = 0 ;

	if ( items.length == 0 ) {
		alert( "You must select the paths in the document before launching the script!");
	} else {

		for ( i = 0 ; i < items.length; i++ ) {
		//$.writeln(items[i].typename);

			// only path items
			if ( items[i].typename == 'PathItem' ) {
				var pathI = items[i];
				var pathKind = 'polygon';
				var pathName = i;
				if ( pathI.name.indexOf('rect') >= 0 ) { pathKind = 'rect'; }
				if ( pathI.name.indexOf('circle') >= 0 ) { pathKind = 'circle'; }
				//$.writeln (pathI.name);
				
				if (pathI.name) {
					pathName = pathI.name;
				}

				var areaS = '\t<area shape="' + pathKind + '" href="#' + pathName + '" alt="Alt text for #' + pathName + '" coords="';
				var pointsA = [];

				switch(pathKind) {
					case 'rect':
						//rect / rectangle
						areaS = areaS + Math.floor(Math.abs(pathI.geometricBounds[0])) + ',' + Math.floor(Math.abs(pathI.geometricBounds[1])) + ',' + Math.floor(Math.abs(pathI.geometricBounds[2])) + ',' + Math.floor(Math.abs(pathI.geometricBounds[3]));
						break;
					case 'circle':
						// circle
						var gB0 = Math.abs(pathI.geometricBounds[0]);
						var gB1 = Math.abs(pathI.geometricBounds[1]);
						var gB2 = Math.abs(pathI.geometricBounds[2]);
						var gB3 = Math.abs(pathI.geometricBounds[3]);
						var cX = Math.floor(gB0 + (gB2 - gB0)/2);
						var cY = Math.floor(gB1 + (gB3 - gB1)/2);
						var radius = Math.floor((gB2 - gB0)/2);
						areaS = areaS + cX + ',' + cY + ',' + radius;
						break;
					default:
						//polygon
						// loop the points
						for ( j = 0 ; j < pathI.pathPoints.length; j++ ) {
							var px = Math.floor(Math.abs(pathI.pathPoints[j].anchor[0]));
							var py = Math.floor(Math.abs(pathI.pathPoints[j].anchor[1]));
							pointsA.push(px);
							pointsA.push(py);
						}
						areaS = areaS + pointsA.join(',');
						pointsA.length = 0;
					} //switch
					areaS = areaS + '">\n';
					resultingMap = resultingMap + areaS ;
				} //if
			} //for
			resultingMap = resultingMap + '</map>';
			//$.writeln(resultingMap);
			win.panel.eText.text = resultingMap;
		}
	} else {
		alert('No document open or it does not have any paths!');
	}
}

/*
==================================
INTERFACE / UI
================================== 
*/

var win = new Window("dialog", 'HTML Map From AI Shapes V0.1', [0,0,635,450], );
with(win){
	win.panel = add( "panel", [5,5,630,445], undefined );
	with(win.panel){
		win.panel.but = add( "button", [5,410,155,432], 'Generate map' );
		win.panel.eText = add( "edittext", [5,5,615,405], 'HTML Map will be generated here', {multiline: true, scrolling: true});
		win.panel.but_help = add( "button", [595,410,617,432], '?', {name: 'help', } );
	}
}
win.panel.but.onClick = function(){ generateHTMLMap(); }
win.panel.but_help.onClick = function(){ openURL('https://github.com/carloscabo/AI-2-HTMLMap'); }
win.center();
win.show();
