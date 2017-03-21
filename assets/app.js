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


	//collecting info when the survey is submitted
	$('#submit-data').on('click', function(event) {
		event.preventDefault();

		console.log('submit button has been clicked');
		//collecting the user responses
		recipeCount = $('#recipe-count').val();
		cuisine = $('#cuisine').val();
		restriction = $('#restriction').val();
		allergies = $('#allergies').val().trim();
		//adding user responses to local storage
		localStorage.clear();
		localStorage.setItem('recipe count', recipeCount);
		localStorage.setItem('cuisine', cuisine);
		localStorage.setItem('dietary restrictions', restriction);
		localStorage.setItem('allergies', allergies);

		//collecting restrictions may be tricky if they're multiple choice.
		//let's talk about what data we want to collect, and how we're collecting it.

		console.log(allergies + ' ' + recipeCount + ' ' + cuisine);

		callAPI();

		// after collecting information, the function will redirect to the swipe page
		// window.location = 'swipe.html';

	});

	recipeCount = parseInt(localStorage.getItem('recipe count'));

	

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
	//swipeDisplay();

	function callAPI() {

			// var URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&cuisine="+ cuisine +"&instructionsRequired=true";
			   // var URL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&cuisine=' + cuisine + '&diet='+ restriction + '&fillIngredients=false&intolerances=egg&limitLicense=true&number=10&offset=0&query=burger&ranking=1';

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
              recipeImage = result.results[0].image;

              //info from query
              console.log('recipe ID: ' + result.results[0].id);
              console.log('image URL: ' + result.results[0].image);
              console.log('recipe URL: ' + result.results[0].spoonacularSourceUrl);

            },
            error: function (error) {
                
            }
        });
	};

	// function pullIngredients() {
	// 	database.ref().on("value", function(snapshot) {
 //        	ingredientArray = [];
 //        	var firebaseObject = snapshot.val().resultObject;
 //        	//console.log(firebaseObject);
	//         var numSteps = firebaseObject.analyzedInstructions[0].steps.length;
	//         //console.log(numSteps);
	// 	    for (i = 0; i < numSteps; i++) {
	// 	      	console.log(firebaseObject.analyzedInstructions[0].steps[i].step);
	// 	      	numIngredients = firebaseObject.analyzedInstructions[0].steps[i].ingredients.length;
	// 	      	for (x = 0; x < numIngredients; x++) {
	// 	          	ingredient = firebaseObject.analyzedInstructions[0].steps[i].ingredients[x].name;
	// 	          	ingredientArray.push(ingredient);
	// 	      	}
 //      		}
	// 	})
	// 	return ingredientArray;
	// }
	// pullIngredients();

	function comparisonDisplay() {
		database.ref().on("value", function(snapshot) {
			var recipe1 = snapshot.val().resultObject[0];
			var name = recipe1.title;
			var image = recipe1.image;
			console.log(name + image);
		})
		pullIngredients(ingredientArray);
		recipeCount = 2;
		if (recipeCount === 2) {
			
			$('.1of2').append();
		}
	}

	function renderDataToDom(chosenRecipes) {
		recipeCount = 3;
		for (i = 0; i < recipeCount; i++) {
		// placeholder images, will be replaced with data from API
			var recipe;
			var name;
			var image;
			var price;
			var servings;
			recipe = chosenRecipes.results[i];
			name = recipe.title;
			image = recipe.image;
			price = recipe.pricePerServing;
			servings = recipe.servings;
			console.log(name + ' ' + image + ' ' + price + ' ' + servings);
		
			var compare = $('<div></div>');

			compare.addClass('col-sm-3 comparison');
			compare.html('<img src="' + image + '">'); //recipe image
			compare.append('<h3>' + name + '</h3>'); //recipe title
			compare.append('<p>$' + price + ' per serving</p>');
			compare.append('<p> Number of servings: ' + servings + '</p>');

			
			$('#recipe-comparisons').append(compare);
		}
	}

	function getSelectRecipeData() {
		$('recipe-comparisons').html('');
		firebase.database().ref('/').once('value').then(function(snapshot) {
			var data = snapshot.val().resultObject;
			renderDataToDom(data);
		});

	};
	getSelectRecipeData()
	//comparisonDisplay();
//end document ready, end script
});