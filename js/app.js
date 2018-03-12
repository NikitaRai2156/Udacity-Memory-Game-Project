/*
 * Create a list that holds all of your cards
 */
var cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];


// Counter variables for number of moves and number of matches found
var moves = 0;
var matchesFound = 0;


// Boolean variable for game ON/OFF state
var gameOn = false;


// new timer variable
var timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {
	$('#timer').html(timer.getTimeValues().toString());
});


// Reset button functionality
$('.resetButton').click(resetGame);


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


// Adding each card's HTML to the page
function createCard(card) {
    $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}


// Generating random cards on the deck
function generateCards() {
    for (var i = 0; i < 2; i++) {
        cardList = shuffle(cardList);
        cardList.forEach(createCard);
    }
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// List of open cards
var openCardList = [];


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


// Function called when a card is clicked
function flipCard() {
	if (gameOn === false) {
		gameOn = true;
		timer.start();
	}
	if (openCardList.length === 1) {
		incrementMoves();
		$(this).toggleClass("show open").animateCss('flipInY');
		openCardList.push($(this));
		setTimeout(matchOpenCardList, 1100);
	}
	else if (openCardList.length === 0) {
		$(this).toggleClass("show open").animateCss('flipInY');
		openCardList.push($(this));
		disableClickOnCard();
	}
}


// To disable clicks on an opened card
function disableClickOnCard () {
	openCardList.forEach(function (card) {
		card.off('click');
	});
}


// To enable clicks on a card
function enableClickOnCard () {
	openCardList[0].click(flipCard);
}


// function to check if the 2 cards in openCardList match and take further actions
function matchOpenCardList () {
	if (openCardList[0][0].firstChild.className === openCardList[1][0].firstChild.className) {
		openCardList[0].addClass("match").animateCss('pulse');
		openCardList[1].addClass("match").animateCss('pulse');
		disableClickOnCard();
		clearOpenCardList();
		setTimeout(checkForWin, 1000);
	}
	else {
		openCardList[0].toggleClass("show open").animateCss('flipInY');
		openCardList[1].toggleClass("show open").animateCss('flipInY');
		enableClickOnCard();
		clearOpenCardList();
	}
}


// Function to clear openCardList after one move
function clearOpenCardList() {
	openCardList = [];
}


// Function to add CSS animations
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});


// Function to increment the number of moves
function incrementMoves() {
	moves += 1;
	$('#moves').html(`${moves} Moves`);
	starRating();
}


// Function to check if the game has been won by the user
function checkForWin() {
	matchesFound += 1;
	if(matchesFound == 8) {
    	timer.pause();
    	displayRatingInModal();
    	var gameTime = timer.getTimeValues().toString();
    	$('#gameTime').html(gameTime);
    	showResultModal();
	}
}


// Function to add star rating
function starRating() {
	var firstStar = $('#firstStar');
	var secondStar = $('#secondStar');
	var thirdStar = $('#thirdStar');
	if(moves >= 20) {
		secondStar.html('<i class="fa fa-star-o" aria-hidden="true"></i>');
	}
	else if(moves >= 12) {
		thirdStar.html('<i class="fa fa-star-o" aria-hidden="true"></i>');
	}
}


// Function to display star rating in the modal
function displayRatingInModal() {
	rating = $('#rating');
	if(moves >= 20) {
		rating.html('<i class="fa fa-star" aria-hidden="true">');
	}
	else if (moves >= 12) {
		rating.html('<i class="fa fa-star" aria-hidden="true"></i></i><i class="fa fa-star" aria-hidden="true"></i>');
	}
	else {
		rating.html('<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>');
	}
}


// Function to reset rating to 3 whole stars 
function resetRating() {
    $('#firstStar').html('<i class="fa fa-star" aria-hidden="true"></i>');
    $('#secondStar').html('<i class="fa fa-star" aria-hidden="true"></i>');
    $('#thirdStar').html('<i class="fa fa-star" aria-hidden="true"></i>');
}


// Function to display Result Modal
function showResultModal() {
	console.log("showing result modal");
	setTimeout(function () {
        var modal = $('#popup-window');
        modal.css('display', 'block');
        console.log("modal display changed");
    }, 1000);
}


// Function to hide Result Modal
function hideResultModal() {
	var modal = $('#popup-window');
    modal.css('display', 'none');
}


// Function to reset game
function resetGame() {
	moves = 0;
	matchesFound = 0;
	$('#deck').empty();
	$('#gameArea')[0].style.display = "";
	gameOn = false;
	timer.stop();
	$('#timer').html("00:00:00");
    startGame();
}


// Function to start game
function startGame () {
	hideResultModal();
	resetRating();
	console.log("stars generated!");
	generateCards();
	console.log("Cards generated!");
	$('.card').click(flipCard);
    $('#moves').html("0 Moves");
}


// Calling initialization function
startGame();
