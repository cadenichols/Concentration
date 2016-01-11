'use strict';
(function(){
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
  var audioPlaying = 0;

  var preload = {dramatic: {audio: new Audio ('sounds/dramatic.mp3'), image: new Image().src = 'images/dramaticGopher.gif'},
  omfgdogs: {audio: new Audio('sounds/omfgdogs.mp3'), image: new Image().src = 'images/omfgdogs.gif'},
  nyancat: {audio: new Audio('sounds/nyancat.mp3'), image: new Image().src = 'images/nyancade.gif'},
  pokemon: {audio: new Audio('sounds/pokemon.mp3'), image: new Image().src = 'images/magikarp.gif'},
  leekspin: {audio: new Audio('sounds/leekspin.mp3'), image: new Image().src = 'images/leekspin.gif'},
  heman: {audio: new Audio('sounds/heman.mp3'), image: new Image().src = 'images/heman.gif'},
  gangnam: {audio: new Audio('sounds/gangnam.mp3'), image: new Image().src = 'images/gangnamStyle.gif'},
  pbjtime: {audio: new Audio('sounds/pbjtime.mp3'), image: new Image().src = 'images/pbjtime.gif'},
  numanuma: {audio: new Audio('sounds/numanuma.mp3'), image: new Image().src = 'images/numanuma.gif'},
  spiderpig: {audio: new Audio('sounds/spiderpig.mp3'), image: new Image().src = 'images/spiderpig.gif'},
  looneyTunes: {audio: new Audio('sounds/looneyTunes.mp3'), image: new Image().src = 'images/looneyTunes.gif'},
  tux: {image: new Image().src = 'images/tux.png'},
  octocat: {image: new Image().src = 'images/octocat.png'}};

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
    checkAudio(audioPlaying);
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
        setCard($card, preload.nyancat.image);
        playAudio(1);
        break;
        case 2:
        setCard($card, preload.leekspin.image);
        playAudio(2);
        break;
        case 3:
        setCard($card, preload.pokemon.image);
        playAudio(3);
        break;
        case 4:
        setCard($card, preload.heman.image);
        playAudio(4);
        break;
        case 5:
        setCard($card, preload.gangnam.image);
        playAudio(5);
        break;
        case 6:
        setCard($card, preload.dramatic.image);
        playAudio(6);
        break;
        case 7:
        setCard($card, preload.octocat.image);
        break;
        case 8:
        setCard($card, preload.tux.image);
        break;
        case 9:
        setCard($card, preload.omfgdogs.image);
        $card.css({backgroundRepeat: 'repeat-y', height: "90px"});
        playAudio(9);
        break;
        case 10:
        setCard($card, preload.pbjtime.image);
        playAudio(10);
        break;
        case 11:
        setCard($card, preload.numanuma.image);
        playAudio(11);
        break;
        case 12:
        setCard($card, preload.spiderpig.image);
        playAudio(12);
        break;
        case 13:
        setCard($card, preload.looneyTunes.image);
        playAudio(13);
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
      preload.nyancat.audio.pause();
      break;
      case 2:
      preload.leekspin.audio.pause();
      break;
      case 3:
      preload.pokemon.audio.pause();
      break;
      case 4:
      preload.heman.audio.pause();
      break;
      case 5:
      preload.gangnam.audio.pause();
      case 6:
      preload.dramatic.audio.pause();
      break;
      case 9:
      preload.omfgdogs.audio.pause();
      break;
      case 10:
      preload.pbjtime.audio.pause();
      break;
      case 11:
      preload.numanuma.audio.pause();
      break;
      case 12:
      preload.spiderpig.audio.pause();
      break;
      case 13:
      preload.looneyTunes.audio.pause();
      break;
    }
    audioPlaying = false;
  }

  function playAudio(audioName){
    if(!audioPlaying){
      switch(audioName){
        case 1:
        preload.nyancat.audio.currentTime = 0;
        preload.nyancat.audio.play();
        break;
        case 2:
        preload.leekspin.audio.play();
        preload.leekspin.audio.currentTime = 0;
        break;
        case 3:
        preload.pokemon.audio.currentTime = 0.5;
        preload.pokemon.audio.play();
        break;
        case 4:
        preload.heman.audio.currentTime = 0;
        preload.heman.audio.play();
        break;
        case 5:
        preload.gangnam.audio.currentTime = 4;
        preload.gangnam.audio.play();
        break;
        case 6:
        preload.dramatic.audio.currentTime = 0.4;
        preload.dramatic.audio.play();
        break;
        case 9:
        preload.omfgdogs.audio.currentTime = 0.3;
        preload.omfgdogs.audio.play();
        break;
        case 10:
        preload.pbjtime.audio.currentTime = 0.5;
        preload.pbjtime.audio.play();
        break;
        case 11:
        preload.numanuma.audio.currentTime = 60.5;
        preload.numanuma.audio.play();
        break;
        case 12:
        preload.spiderpig.audio.currentTime = 0;
        preload.spiderpig.audio.play();
        break;
        case 13:
        preload.looneyTunes.audio.currentTime = 0.7;
        preload.looneyTunes.audio.play();
        break;
      }
      audioPlaying = audioName;
    }
  }

  function setCard($card, imageObj){
    $card.css("background-image", "url(" + imageObj + ")");
  }
  function checkWin(){
    if($gameArea.children().length === 0){
      alert("You win!");
    }
  }
})();
