'use strict';

var cards = [];
var faces = [];
var gameSize = 12;
var $cards;
var $newGame;
var $selectedCard = null;
var compareDelay;
var canClick = true;
var matchesFound;
var $gameSize = $('#gameSize');
var $gameArea;
var $moves;
var moves = 0;
var dramatic = new Audio('sounds/dramatic.mp3');

$(document).ready(init);
function init(){
  varInit();

  newGame();
  $newGame.click(newGame);
  $gameSize.change(newGame);
}

function varInit(){
  $gameArea = $('.gameArea');
  $moves = $('#movesTaken');
  $gameSize = $('#gameSize');
  $newGame = $('#newGame');
}

function newDeck(cardPairs){
  var sortedCards = [];
  var shuffledCards = [];
  for(var i = 1; i <= cardPairs; i++){
    sortedCards.push(i,i);
  }
  for(var i = 1; i <= cardPairs*2;i++){ //map was only shuffling half of the deck
    shuffledCards.push(sortedCards.splice(Math.floor(Math.random()*sortedCards.length),1)[0]);
  };
  return shuffledCards;
}

function newGame(){
  moves = 0;
  $moves.text(moves);
  $selectedCard = null;
  gameSize = Math.floor($gameSize.val());
  if(gameSize <= 40 && gameSize >= 4){
    matchesFound = 0;
    $('.gameArea').children().remove();
    faces = newDeck(gameSize);
    for(var i = faces.length; i > 0; i--){
      var left = cards.length%10*76+"px";
      var top = Math.floor(cards.length/10)*96+"px";
      var $card = $('<div>')
      .addClass('card')
      .data('cardID', i)
      .css({top: top, left: left, backgroundRepeat: "no-repeat", backgroundPosition: "center"});
      cards.push($card);
    }
    $('.gameArea').append(cards);
    cards = [];
  }
  else{
    alert("Please enter a value between 4 and 40 (inclusive)");
  }
  $cards = $('.card');
  $cards.click(cardClick);
}

function pickFace(){
  var faceIndex = Math.floor(Math.random()*(faces.length-1));
  var face = faces.splice(faceIndex, 1)[0];
  return face;
}


function cardClick(){
  if(canClick){
    var $this = $(this);
    if($this.data('face') === undefined){
      $this.data('face', pickFace());
    }

    if($selectedCard !== null){
      if($this.data('cardID') !== $selectedCard.data('cardID')){
        flipCard($this);
        compareCards($this);
      }
    }
    else{
      flipCard($this);
      $selectedCard = $this;
    }
  }
};

function compareCards($clickedCard){
  moves++;
  $moves.text(moves);
  canClick = false;
  if($selectedCard.data('face') === $clickedCard.data('face')){
    compareDelay = setTimeout(function(){
      $selectedCard.remove();
      $clickedCard.remove();
      $selectedCard = null;
      checkWin();
      canClick = true;
    }, 500);
  }
  else{
    compareDelay = setTimeout(function () {
      flipCard($selectedCard);
      flipCard($clickedCard);
      $selectedCard = null;
      canClick = true;
    }, 500);
  }
}

function flipCard($card){
  if($card.css('background-image').includes('images/playingCard.png')){
    $card.css('background-image', 'url(images/cardFace.png)');
    switch($card.data('face')){
      case 1:
        setCard($card, 'nyancade.gif');
        break;
      case 2:
        setCard($card, 'leekspin.gif');
        break;
      case 3:
        setCard($card, 'magikarp.gif');
        break;
      case 4:
        setCard($card, 'heman.gif');
        break;
      case 5:
        setCard($card, 'gangnamStyle.gif');
        break;
      case 6:
        setCard($card, 'dramaticGopher.gif');
        dramatic.play();
        break;
      case 7:
        setCard($card, 'octocat.png');
        break;
      case 8:
        setCard($card, 'tux.png');
      break;
      default:
        $card.text($card.data('face'));
        break;
    }
  }
  else {
    switch($card.data('face')){
      case 6:
        dramatic.pause()
        dramatic.currentTime = 122;
        break;
    }
    $card.text('');
    $card.css("background-image", 'url(images/playingCard.png)');
  }
}

function setCard($card, imageName){
  $card.css("background-image", 'url(images/'+imageName);
}
function checkWin(){
  if($gameArea.children().length === 0){
    alert("You win!");
  }
}
