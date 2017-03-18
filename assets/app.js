// GLOBAL VERIABLES //

var recipeCount;
var cuisine;
var restriction;
var allergies;
var comparisonArray = [];
var ingredientArray = [];
var recipeName;
var recipeImg;

//jQuery
$(document).ready(function () {
	/* start firebase section*/

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCNW-ixsg97qolFlHZqdW4V7RbeEY8DxpE",
    authDomain: "tender-dcacd.firebaseapp.com",
    databaseURL: "https://tender-dcacd.firebaseio.com",
    storageBucket: "tender-dcacd.appspot.com",
    messagingSenderId: "1016777459469"
  };

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// At the initial load, get a snapshot of the current data.


	//collecting info on 
	$('#submit-data').on('click', function(event) {
		event.preventDefault();

		console.log('submit button has been clicked');
		//collecting the user responses
		recipeCount = $('#recipe-count').val();
		cuisine = $('#cuisine').val();
		restriction = $('#restriction:checked').val();
		allergies = $('#allergies').val().trim();
		//adding user responses to local storage
		localStorage.clear();
		localStorage.setItem('recipe count', recipeCount);
		localStorage.setItem('cuisine', cuisine);
		localStorage.setItem('dietary restrictions', restriction);
		localStorage.setItem('allergies', allergies);
		
		callAPI();

	//collecting restrictions may be tricky if they're multiple choice.
	//let's talk about what data we want to collect, and how we're collecting it.

		console.log(allergies + ' ' + recipeCount);

	});

	recipeCount = parseInt(localStorage.getItem('recipe count'));

		for (i = 1; i <= recipeCount; i++) {
			// placeholder images, will be replaced with data from API
			$('#recipe-comparisons').append('<img src="http://www.sluniverse.com/200.jpg">');
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
			console.log('next recipe will pull from API/firebase');
		}
		// else if comparison array.length = numRecipes: go to comparison page
		if (comparisonArray.length === recipeCount) {
			location.href='comparison.html';
		}
	});

	$('.generate').on('click', function(){
		//callAPI();
		recipeName = "Steamed Fish, Chinese Style"
		recipeImg = 'https://spoonacular.com/recipeImages/steamed-fish-chinese-style-2-98660.png'
		recipeIngredients = 
		$('body').append('')
		$('body').append('<h1> ' + recipeName + '</h1>');
		$('body').append('<img src="' + recipeImg + '">');
	});

	function swipeDisplay() {
		database.ref().on("value", function(snapshot) {

		if(snapshot.val()) {
			recipeName = snapshot.val().resultObject[0].title;
			recipeImg = snapshot.val().resultObject[0].image;

			$('#recipeName').html(recipeName);
			$('#recipeImg').attr('src', recipeImg);
		}
		  

		 // If any errors are experienced, log them to console.
		}, function(errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
		/* end database section */
	}
	swipeDisplay();

	function callAPI () {
		// var URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&" +cuisine+ "&" + restriction + "&" + allergies;

		//var URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&cuisine=american&instructionsRequired=true";

		var URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&cuisine=Chinese&excludeIngredients=coconut%2C+mango&fillIngredients=false&includeIngredients=onions%2C+lettuce%2C+tomato&instructionsRequired=true&intolerances=peanut%2C+shellfish&limitLicense=false&maxCalories=1500&maxCarbs=100&maxFat=100&maxProtein=100&minCalories=150&minCarbs=5&minFat=5&minProtein=5&number=10&offset=0&type=main+course";

		console.log(cuisine);

		console.log(URL);
		// ATeOl1ceiGmshW4SaYTwMkI7hCWHp1mP7mejsn8ZUMdWj4aj9x - what I found
		// ZdKhTNFHHDmshquH7By5lOHgNXebp1m1xmfjsnQzYt1dr9fosl - what it was
		$.ajax({
            url: URL,
            type: 'GET',
            dataType: 'json',
            headers: {
                'X-Mashape-Key': 'ATeOl1ceiGmshW4SaYTwMkI7hCWHp1mP7mejsn8ZUMdWj4aj9x',
                'Accept': 'application/json'
            },
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
              console.log(result);	
              console.log(result.results[0].title);
              recipeName = result.results[0].title;
              console.log(result.results[0].image);
              recipeImage = result.results[0].image;

              var numSteps = result.results[0].analyzedInstructions[0].steps.length;
              for (i = 0; i < numSteps; i++) {
              	console.log(result.results[0].analyzedInstructions[0].steps[i].step);
              	numIngredients = result.results[0].analyzedInstructions[0].steps[i].ingredients.length;
              	for (x = 0; x < numIngredients; x++) {
	              	ingredient = result.results[0].analyzedInstructions[0].steps[i].ingredients[x].name;
	              	ingredientArray.push(ingredient);
              	}
              }
              console.log(ingredientArray);
               // $("#food-view").text(result[0].name);
            },
            error: function (error) {
                
            }
        });
};

//end document ready, end script
});