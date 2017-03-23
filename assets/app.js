// GLOBAL VRIABLES //

var recipeCount;
var cuisine;
var restriction;
var allergies;
var comparisonArray = [];
var ingredientArray = [];
var recipeName;
var recipeImg;
var cnt = 0;
var noCnt = 0;
var yesCnt = 0;

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
		if ( $('#restriction').val() === 'None' )
		{
			restriction = '';
		}
		else 
		{
			restriction = $('#restriction').val();
		}

		if ( $('#allergies').val() === 'None' )
		{
			allergies = '';
		}
		else 
		{
			allergies = $('#allergies').val();
		}

		recipeCount = $('#recipe-count').val();
		cuisine = $('#cuisine').val();
		
		//adding user responses to local storage
        localStorage.clear();
        localStorage.setItem('recipe count', recipeCount);
        localStorage.setItem('cuisine', cuisine);
        localStorage.setItem('dietary restrictions', restriction);
        localStorage.setItem('allergies', allergies);
		// console.log(restriction);
		// console.log(allergies);
		
		callAPI();

		


	});

	recipeCount = parseInt(localStorage.getItem('recipe count'));

	

	//  console.log(localStorage.getItem('allergies'));
	$('.no').on('click', function() {
		noToFirebase();
	});

	$('.yes').on('click', function(){
		yesToFirebase();

		
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

	


	function callAPI () {

		var URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&cuisine=" + cuisine + "&diet=" + restriction + "&fillIngredients=false&instructionsRequired=true&intolerances=" + allergies + "&limitLicense=false&number=20&offset=0";
		
		console.log(URL);
		
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
	            // console.log(result);

	            database.ref().set({
			      resultObject: result,
			      count: 0,
			      yesCount: 0,
			      noCount: 0,
			    });

			    window.location.href = 'swipe.html';


            },
            error: function (error) {
              
            }
        });
	};

	function yesToFirebase() {
		cnt++;
		yesCnt++;
		console.log(yesCnt);
		console.log(recipeCount);
		if ( recipeCount === yesCnt)
		{
			window.location.href = 'comparison.html';
		} 

		
		// console.log(cnt);
		// console.log(yesCnt);

		database.ref().update({
			      count: cnt,
			      yesCount: yesCnt,
			      noCount: noCnt
			    });

		database.ref().on("value", function(snapshot) {
		if(snapshot.val()) {
			recipeName = snapshot.val().resultObject.results[snapshot.val().count].title;
			recipeImg = snapshot.val().resultObject.results[snapshot.val().count].image;

			$('#recipeName').html(recipeName);
			$('#recipeImg').attr('src', recipeImg).attr('height','300').attr('width','300');
		}
		  
		 // If any errors are experienced, log them to console.
		}, function(errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
		/* end database section */
	}


	function noToFirebase() {
	
		cnt++;
		noCnt++;
		// console.log(cnt);
		// console.log(noCnt);

		database.ref().update({
			      count: cnt,
			      noCount: noCnt
			    });

		database.ref().on("value", function(snapshot) {
		if(snapshot.val()) {
			recipeName = snapshot.val().resultObject.results[snapshot.val().count].title;
			recipeImg = snapshot.val().resultObject.results[snapshot.val().count].image;

			$('#recipeName').html(recipeName);
			$('#recipeImg').attr('src', recipeImg).attr('height','300').attr('width','300');
		}
		  
		 // If any errors are experienced, log them to console.
		}, function(errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
		/* end database section */
	}

	function swipeDisplay() {
		database.ref().on("value", function(snapshot) {

		if(snapshot.val()) {
			recipeName = snapshot.val().resultObject.results[0].title;
			recipeImg = snapshot.val().resultObject.results[0].image;

			$('#recipeName').html(recipeName);
			$('#recipeImg').attr('src', recipeImg).attr('height','300').attr('width','300');
		}
		  
		 // If any errors are experienced, log them to console.
		}, function(errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
		/* end database section */
	}
	swipeDisplay();


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
		//recipeCount = 3;
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
		
		//new code for adding the thumbnail divs
			var compare = $('<div></div>');
			compare.addClass('col-sm-3');
			var compareThumb= $('<div></div>');
			compareThumb.addClass('thumbnail');


			compareThumb.html('<img src="' + image + '">'); //recipe image
			compareThumb.append('<h3>' + name + '</h3>'); //recipe title
			compareThumb.append('<p>$' + price + ' per serving</p>');
			compareThumb.append('<p> Number of servings: ' + servings + '</p>');

			compare.append(compareThumb);
			
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