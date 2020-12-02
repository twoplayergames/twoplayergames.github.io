var map;
var divSquare = '<div id="s$coord" class = "square $color"></div>';
var divFigure = '<div id="f$coord" class = "figure">$figure</div>';
var isDragging = false;
var isFlipped = false;


$(function () {
  start();
  $('.buttonNew').click(newFiguresPHP);
  $('.buttonFlip').click(flipBoard);
  setInterval('showFiguresPHP()', 1000);
});

function start() {
  map = new Array(64);
  addSquares();
  showFiguresPHP();
}

function flipBoard() {
  isFlipped = !isFlipped;
  start();
}

function setDraggable() {
  $('.figure').draggable({
    start: function (event, ui) {
      isDragging = true;
    }
  });
}

function setDroppable() {
  $('.square').droppable({
    drop: function (event, ui) {
      var frCoord = ui.draggable.attr('id').substring(1);
      var toCoord = this.id.substring(1);
      moveFigure(frCoord, toCoord);
      moveFigurePHP(frCoord, toCoord);
      isDragging = false;
    }
  });
}

function moveFigure(frCoord, toCoord) {
  console.log('move from ' + frCoord + ' to ' + toCoord);
  figure = map[frCoord];
  showFigureAt(frCoord, '1');
  showFigureAt(toCoord, figure);

}

function addSquares() {
  // console.log('addSquares');
  $('.board').html('');
  for (var coord = 0; coord < 64; coord++)
    $('.board').append(divSquare
      .replace ('$coord', isFlipped ? 63 - coord : coord)
      .replace ('$color',
       isBlackSquareAt(coord) ? 'black' : 'white'));
    setDroppable();
}

function showFigures(figures) {
    for (var coord = 0; coord < 64; coord++)
      showFigureAt(coord, figures.charAt(coord));
}

function showFigureAt(coord, figure) {
 if (map[coord] == figure) return;
  console.log('showFigureAt');
  map[coord] = figure;
  $('#s' + coord).html(divFigure
  .replace('$coord', coord)
  .replace('$figure', getChessSymbol(figure)));
  setDraggable();
}

function getChessSymbol(figure) {
  switch (figure) {
    case 'W' : return '&#9898';
    case 'B' : return '&#9899';
    case 'K' : return '&#9812';
    case 'Q' : return '&#9813';
    case 'k' : return '&#9818';
    case 'q' : return '&#9819';
    case 'P' : return '&#9817';
    case 'p' : return '&#9723';
    default : return '';
  }
}

function isBlackSquareAt(coord) {
  return (coord % 8 + Math.floor(coord / 8)) % 2;
}

function newFiguresPHP() {
  $.get('game.php?newFigures',
  showFigures);
}

function moveFigurePHP(frCoord, toCoord) {
  $.get('game.php?moveFigure' +
          '&frCoord=' + frCoord +
          '&toCoord=' + toCoord,
        showFigures);
}

function showFiguresPHP() {
  if (isDragging) return;
  $.get('game.php?getFigures', showFigures);
}
