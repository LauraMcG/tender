// GLOBAL VERIABLES //

var allergies;
var recipeCount = 3;
var restrictions;
var comparisonArray = [];

//jQuery
$(document).ready(function () {

	//collecting info on 
	$('#submit-data').on('click', function(event) {
		event.preventDefault();

		console.log('submit button has been clicked');
		allergies = $('#allergies').val().trim();
		recipeCount = $('#recipe-count').val();

	//collecting restrictions may be tricky if they're multiple choice.
	//let's talk about what data we want to collect, and how we're collecting it.

		console.log(allergies + ' ' + recipeCount);

	});


		for (i = 1; i <= recipeCount; i++) {
			// placeholder images, will be replaced with data from API
			$('#recipe-comparisons').append('<img src="http://www.sluniverse.com/200.jpg">');
		}
	


	$('.no').on('click', function() {
		console.log('Next recipe image/name would generate / be called from API');
		// calls another recipe from API
	})

	$('.yes').on('click', function(){
		console.log('Either continues "swiping" or goes to the comparison page');
		// Store approved recipe into comparison array.
		comparisonArray.push('test');
		console.log(comparisonArray + comparisonArray.length);
		// if comparison array.length < numRecipes: next recipe generates on swipe screen
		if (comparisonArray.length < recipeCount) {
			console.log('next recipe will pull from API');
		}
		// else if comparison array.length = numRecipes: go to comparison page
		if (comparisonArray.length === recipeCount) {
			location.href='comparison.html';
			comparisonDisplay();
		}
	})

//end document ready, end script
});