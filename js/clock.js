Level = function(bb, sb, anti, dur) {
	this.bb = bb;
	this.sb = sb;
	this.anti = anti;
	this.dur = time_to_seconds(dur);
	this.remain = this.dur;
}

const startLevel = 0;

const levels = [
	new Level(100, 50, 0, '30:0'),
	new Level(200, 100, 0, '30:0'),
	new Level(300, 150, 0, '30:0'),
	new Level(400, 200, 0, '30:0'),
	new Level(400, 200, 50, '30:0'),
	new Level(600, 300, 100, '30:0'),
	new Level(1000, 500, 100, '30:0'),
	new Level(1400, 700, 200, '30:0'),
	new Level(2000, 1000, 300, '30:0'),
	new Level(3000, 1500, 400, '30:0'),
	new Level(6000, 3000, 800, '30:0'),
	new Level(8000, 4000, 1000, '30:0'),
	new Level(14000, 7000, 2000, '30:0'),
	new Level(20000, 10000, 3000, '30:0'),
	new Level(30000, 15000, 4000, '30:0'),
	new Level(40000, 20000, 5000, '30:0'),
];

const buyIn = 10000;
const prizeCnt = 5;

var playerCnt = 19;
var rebuyCnt = 0;
var remainCnt = playerCnt;
var paused = false;

function refresh_every_second() {
	if (!paused) {
		time_elapse();
	}
	redraw();
}

function time_elapse() {
	if (levels[levelIndex].remain != 0) {
		levels[levelIndex].remain --;
		if (levels[levelIndex].remain == 10) {
			new Audio('./resources/10_sec_countdown.mp3').play();
		}
		return;
	}
	if (!isLastLevel()) {
		levelIndex ++;
		return;
	}
	return;
}

function time_to_seconds(time) {
	var mmss = time.split(':');
	var mm = mmss[0]==''?0:parseInt(mmss[0]);
	var ss = mmss[1]==''?0:parseInt(mmss[1]);
	return mm * 60 + ss;
}

function seconds_to_time(ss) {
	var mm = parseInt(ss / 60);
	ss %= 60;
	return pad(mm) + ':' + pad(ss);
}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

function onload() {
	initDivs();
	setupStyles();
	redraw();
	new Audio('./resources/play_poker.mp3').play();
	setInterval(refresh_every_second, 1000);
}

function initDivs() {
	timeDiv = document.getElementById('div_time');
	curAntiDiv = document.getElementById('div_cur_anti');
	curBlindDiv = document.getElementById('div_cur_blind');
	remainCntDiv = document.getElementById('div_remain_cnt');
	//playerCntDiv = document.getElementById('div_player_cnt');
	prizeCntDiv = document.getElementById('div_prize_cnt');
	curLevelDiv = document.getElementById('div_cur_level');
	aveChipDiv = document.getElementById('div_ave_chip');
	nextLevelDiv = document.getElementById('div_next_level');
	pauseDiv = document.getElementById('div_pause');
}

function redraw() {
	var cur = levels[levelIndex];
	timeDiv.innerText = paused ? '暂停' : seconds_to_time(cur.remain);
	curAntiDiv.innerText = cur.anti;
	curBlindDiv.innerText = cur.bb + '/' + cur.sb;
	remainCntDiv.innerText = remainCnt+'/'+playerCnt;
	prizeCntDiv.innerText = prizeCnt;
	curLevelDiv.innerText = levelIndex+1;
	aveChipDiv.innerText = parseInt((playerCnt + rebuyCnt) * buyIn / remainCnt);
	if (isLastLevel()) {
		nextLevelDiv.innerText = '--/--(--)';
	} else {
		var next = levels[levelIndex + 1];
		nextLevelDiv.innerText = next.bb+'/'+next.sb+'('+next.anti+')';
	}
}

function isLastLevel() {
	return levelIndex == levels.length - 1;
}

function onKeyPress(e) {
	// Prevents page from scrolling when pressing SPACE.
	e.preventDefault();
	var key = e.keyCode;
	const plus = 43; 		// shift+plus
	const minus = 95; 		// shift+minus
	const pause = 32;		// space
	const speedUp = 87; 	// shift+w;
	const speedDown = 83; 	// shift+s;
	const reBuy = 82; 		// shift+r;

	if (key == pause) {
		doPause();
	} else if (key == plus) {
		doPlus();
	} else if (key == minus) {
		doMinus();
	} else if (key == speedUp) {
		levels[levelIndex].remain = Math.max(0, levels[levelIndex].remain-60);
	} else if (key == speedDown) {
		levels[levelIndex].remain = levels[levelIndex].remain+60;
	} else if (key == reBuy) {
		rebuyCnt ++;
	} else {
		console.log('key ' + key + ' pressed');
	}
}

function doPause() {
	paused = !paused;
}

function doPlus() {
	remainCnt ++;
	playerCnt ++;
}

function doMinus() {
	if (remainCnt > 0) {
		remainCnt --;
	}
}

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

function setupStyles() {
	var width = getWidth();
	var height = getHeight();

	timeDiv.style.fontSize = height * 0.22 + 'px';
	nextLevelDiv.style.fontSize = height * 0.05 + 'px';

	setupFontSizeForClass('tab_content', height * 0.08);
	setupFontSizeForClass('margin_content', height * 0.04);
	setupFontSizeForClass('margin_title', height * 0.04);
	document.getElementById('top').style.fontSize = height * 0.055 + 'px';
	document.getElementById('next_level_title').style.fontSize = height * 0.05 + 'px';
}

function setupFontSizeForClass(className, fontSize) {
	var elements = document.getElementsByClassName(className);
	for (var i = 0; i < elements.length; i++) {
	  var element = elements[i];
	  element.style.fontSize = fontSize + 'px';
	}
}

var timeDiv;
var curBlindDiv;
var curAntiDiv;
var remainCntDiv;
var prizeCntDiv;
var curLevelDiv;
var aveChipDiv;
var nextLevelDiv;
var pauseDiv;
// Deprecated
var playerCntDiv;

var levelIndex = startLevel;


document.onkeypress = onKeyPress;
window.onresize = setupStyles;