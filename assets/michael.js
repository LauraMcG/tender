// GLOBAL VERIABLES //

var allergies;
var recipeCount;




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

	function comparisonDisplay() {
		for (i = 1; i <= recipeCount; i++) {
			// placeholder images, will be replaced with data from API
			$('#recipe-comparisons').append('<img src="http://www.sluniverse.com/200.jpg">');
		}
	}


	function recipeNo() {
		console.log('Next recipe image/name would generate / be called from API');
	}

	function recipeYes() {
		console.log('Either continues "swiping" or goes to the comparison page');
		// Store approved recipe into comparison array.
		// if comparison array.length < numRecipes: next recipe generates on swipe screen
		// else if comparison array.length = numRecipes: go to comparison page
	}

//end document ready, end script
});