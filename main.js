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

$(document).ready(init);
function init(){
  newGame();
  $newGame = $('#newGame');
  $newGame.click(newGame);
  $gameSize = $('#gameSize');
  $gameSize.change(newGame);
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
      .css('left', left)
      .css('top', top);
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
  if($card.css('background-image').includes('playingCard.png')){
    $card.css('background-image', 'url(cardFace.png)');
    $card.text($card.data('face'));
  }
  else {
    $card.text('');
    $card.css('background-image', 'url(playingCard.png)');
  }
}

function checkWin(){
  console.log("Checking win...");
  if($cards.length === 0){
    console.log("You win!");
  }
  else{
    console.log($cards.length/2," cards left.");
  }
}
