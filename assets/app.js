// GLOBAL VERIABLES //

var allergies;
var recipeCount;
var restriction;
var comparisonArray = [];
var cuisine;

//jQuery
$(document).ready(function () {

	//collecting info when the survey is submitted
	$('#submit-data').on('click', function(event) {
		event.preventDefault();

		console.log('submit button has been clicked');
		//collecting the user responses
		restriction = $('#restriction').val().trim();
		recipeCount = $('#recipe-count').val();
		cuisine = $('#cuisine').val().trim();
		allergies = $('#allergies').val();
		//adding user responses to local storage
		localStorage.clear();
		localStorage.setItem('allergies', allergies);
		localStorage.setItem('recipe count', recipeCount);
		localStorage.setItem('cuisine', cuisine);
		localStorage.setItem('restriction', restriction);

	//collecting restrictions may be tricky if they're multiple choice.
	//let's talk about what data we want to collect, and how we're collecting it.

		console.log(allergies + ' ' + recipeCount + ' ' + cuisine);

		callAPI();

// after collecting information, the function will redirect to the swipe page
		// window.location = 'swipe.html';

	});

recipeCount = parseInt(localStorage.getItem('recipe count'));

// COMPARISON PAGE DIV GENERATION --- make into a function?
		for (i = 1; i <= recipeCount; i++) {
			// placeholder images, will be replaced with data from API

			var compare = $('<div></div>');
			compare.addClass('col-sm-3 comparison');
			compare.html('<img src="http://www.sluniverse.com/200.jpg">'); //recipe image
			compare.append('<h3>Recipe title<h3>') //recipe title
				.append('<p>serving / cost per serving / preptime</p>') //various stats
				.append('<ul>ingredients</ul>') //list of ingredients
				
			$('#recipe-comparisons').append(compare);
		}
	

//  console.log(localStorage.getItem('allergies'));
	$('.no').on('click', function() {
		
		console.log('Next recipe image/name would generate / be called from API');
		// calls another recipe from API
	});

	$('.yes').on('click', function(){
		console.log(recipeCount);

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
		}
	});

	function callAPI () {
			var URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&cuisine="+ cuisine +"&instructionsRequired=true";
			   // var URL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&cuisine=' + cuisine + '&diet='+ restriction + '&fillIngredients=false&intolerances=egg&limitLicense=true&number=10&offset=0&query=burger&ranking=1';
	$.ajax({
            url: URL,
            type: 'GET',
            dataType: 'json',
            headers: {
                'X-Mashape-Key': 'ZdKhTNFHHDmshquH7By5lOHgNXebp1m1xmfjsnQzYt1dr9fosl',
                'Accept': 'application/json'
            },
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
              console.log(result);
              console.log(result.results[0].title);

              console.log('recipe ID: ' + result.results[0].id);
              console.log('image URL: ' + result.results[0].image);
              console.log('recipie URL: ' + result.results[0].spoonacularSourceUrl);
              console.log('');

               // $("#food-view").text(result[0].name);
            },
            error: function (error) {
                
            }
        });
};

//end document ready, end script
});