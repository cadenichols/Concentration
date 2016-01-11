'use strict';

var cards = [];
var faces = [];
var gameSize;
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
var audioPlaying = false;
var dramatic = new Audio('sounds/dramatic.mp3');
var omfgdogs = new Audio('sounds/omfgdogs.mp3');
var nyancat = new Audio('sounds/nyancat.mp3');
var pokemon = new Audio('sounds/pokemon.mp3');
var leekspin = new Audio('sounds/leekspin.mp3');
var heman = new Audio('sounds/heman.mp3');
var gangnam = new Audio('sounds/gangnam.mp3');
var pbjtime = new Audio('sounds/pbjtime.mp3');
var numanuma = new Audio('sounds/numanuma.mp3');
var spiderpig = new Audio('sounds/spiderpig.mp3');

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
      checkAudio($selectedCard.data('face'));
      checkAudio($clickedCard.data('face'));
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
        playAudio(1);
        break;
      case 2:
        setCard($card, 'leekspin.gif');
        playAudio(2);
        break;
      case 3:
        setCard($card, 'magikarp.gif');
        playAudio(3);
        break;
      case 4:
        setCard($card, 'heman.gif');
        playAudio(4);
        break;
      case 5:
        setCard($card, 'gangnamStyle.gif');
        playAudio(5);
        break;
      case 6:
        setCard($card, 'dramaticGopher.gif');
        playAudio(6);
        break;
      case 7:
        setCard($card, 'octocat.png');
        break;
      case 8:
        setCard($card, 'tux.png');
      break;
      case 9:
        setCard($card, 'omfgdogs.gif');
        playAudio(9);
        break;
      case 10:
        setCard($card, 'pbjtime.gif');
        playAudio(10);
        break;
      case 11:
        setCard($card, 'numanuma.gif');
        playAudio(11);
        break;
      case 12:
        setCard($card, 'spiderpig.gif');
        playAudio(12);
        break;
      default:
        $card.text($card.data('face'));
        break;
    }
    $card.css('cursor','default');
  }
  else {
    checkAudio($card.data('face'));
    $card.text('');
    $card.css({backgroundImage: 'url(images/playingCard.png)', backgroundRepeat: "no-repeat", height: "93px", cursor: "pointer"});
  }
}

function checkAudio(audioName){
  switch (audioName) {
    case 1:
      nyancat.pause();
      break;
    case 2:
      leekspin.pause();
      break;
    case 3:
      pokemon.pause();
      break;
    case 4:
      heman.pause();
      break;
    case 5:
      gangnam.pause();
    case 6:
      dramatic.pause();
      break;
    case 9:
      omfgdogs.pause();
      break;
    case 10:
      pbjtime.pause();
      break;
    case 11:
      numanuma.pause();
      break;
    case 12:
      spiderpig.pause();
      break;
  }
  audioPlaying = false;
}

function playAudio(audioName){
  if(!audioPlaying){
    switch(audioName){
      case 1:
        nyancat.currentTime = 0;
        nyancat.play();
        break;
      case 2:
        leekspin.play();
        leekspin.currentTime = 0;
        break;
      case 3:
        pokemon.currentTime = 0.5;
        pokemon.play();
        break;
      case 4:
        heman.currentTime = 0;
        heman.play();
        break;
      case 5:
        gangnam.currentTime = 4;
        gangnam.play();
        break;
      case 6:
        dramatic.currentTime = 0.4;
        dramatic.play();
        break;
      case 9:
        omfgdogs.currentTime = 0.3;
        omfgdogs.play();
        break;
      case 10:
        pbjtime.currentTime = 0.5;
        pbjtime.play();
        break;
      case 11:
        numanuma.currentTime = 60.5;
        numanuma.play();
        break;
      case 12:
        spiderpig.currentTime = 0;
        spiderpig.play();
        break;
    }
    audioPlaying = true;
  }
}

function setCard($card, imageName){
  switch (imageName) {
    case 'omfgdogs.gif':
      $card.css({backgroundImage: 'url(images/'+imageName+')', backgroundRepeat: 'repeat-y', height: "90px"})
      break;
    default:
      $card.css("background-image", 'url(images/'+imageName+')');
      break;
  }
}
function checkWin(){
  if($gameArea.children().length === 0){
    alert("You win!");
  }
}
