// GLOBAL VERIABLES //

var allergies;
var recipeCount;




//jQuery
$(document).ready(function () {

	//collecting info on 
	$('#submit-data').on('click', function(event) {
		event.preventDefault();

		console.log('submit button has been clicked');
		//collecting the user responses
		allergies = $('#allergies').val().trim();
		recipeCount = $('#recipe-count').val();
		//adding user responses to local storage
		localStorage.clear();
		localStorage.setItem('allergies', allergies);
		localStorage.setItem('recipe count', recipeCount);

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


	// function recipeNo() {
	// 	console.log('Next recipe image/name would generate / be called from API');
	// }

	$('.no').on('click', function(event) { 
		console.log('Gross, I work');
		console.log(localStorage.getItem('allergies'));
		
	});

//end document ready, end script
});