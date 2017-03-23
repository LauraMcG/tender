// GLOBAL VERIABLES //
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
var choice;
var choiceArr = [];

//jQuery
$(document).ready(function () {
	// firebase config stuffffff
	var config = {
	    apiKey: "AIzaSyCNW-ixsg97qolFlHZqdW4V7RbeEY8DxpE",
	    authDomain: "tender-dcacd.firebaseapp.com",
	    databaseURL: "https://tender-dcacd.firebaseio.com",
	    storageBucket: "tender-dcacd.appspot.com",
	    messagingSenderId: "1016777459469"
	};

	var testConfig = {
	    apiKey: "AIzaSyC1Dklm_uM23jwisqSKin-Daz5Uruhwvpk",
	    authDomain: "tender-test.firebaseapp.com",
	    databaseURL: "https://tender-test.firebaseio.com",
	    storageBucket: "tender-test.appspot.com",
	    messagingSenderId: "669209710942"
  	};

	//init firebase
	firebase.initializeApp(testConfig);

	// Create a variable to reference the database
	var database = firebase.database();

	//collecting info when the survey is submitted
	$('#submit-data').on('click', function(event) {
		//dont refresh
		event.preventDefault();
		// console.log('submit button has been clicked');
		//collecting the user responses
		//if None is selected then set allergies to empty string
		if ( $('#restriction').val() === 'None' )
		{
			restriction = '';
		}
		//else just set the value
		else 
		{
			restriction = $('#restriction').val();
		}
		//if None is selected then set allergies to empty string
		if ( $('#allergies').val() === 'None' )
		{
			allergies = '';
		}
		//else just set the value
		else 
		{
			allergies = $('#allergies').val();
		}
		//pull data for recipe numeber to compare
		recipeCount = $('#recipe-count').val();
		//pull data for cuisine choice
		cuisine = $('#cuisine').val();
		
		//adding user responses to local storage
        localStorage.clear();
        localStorage.setItem('recipe count', recipeCount);
        localStorage.setItem('cuisine', cuisine);
        localStorage.setItem('dietary restrictions', restriction);
        localStorage.setItem('allergies', allergies);
		
		//call API function
		callAPI();
	});
	//local stufffff
	recipeCount = parseInt(localStorage.getItem('recipe count'));

	//clicked NO, do this
	$('.no').on('click', function() {
		noToFirebase();
	});

	//clicked YES, do this
	$('.yes').on('click', function(){
		yesToFirebase();
	});


	//API call
	function callAPI () {
		var URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&cuisine=" + cuisine + "&diet=" + restriction + "&fillIngredients=false&instructionsRequired=true&intolerances=" + allergies + "&limitLicense=false&number=20&offset=0";
		// console.log(URL);
		//ajax call
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
            	//set initial values in firebase
	            database.ref().set({
				    resultObject: result,
				    count: 0,
				    yesCount: 0,
				    noCount: 0,
				    choices:''
			    });
	            //navigate to swipe page after the call
			    window.location.href = 'swipe.html';
            },
            	error: function (error) {
            }
        });
	};

	//function to handle yes clicks
	function yesToFirebase() {
		
		//get snapshot to assign current recipe to choice arrary
		firebase.database().ref('/').once('value').then(function(snapshot) {
			if(snapshot.val()) {
				//update choice in the choice array
				console.log(choiceArr);
				choiceArr.push(snapshot.val().resultObject.results[snapshot.val().count]);
				console.log(choiceArr);

				cnt++;
				yesCnt++;

				//update database with count data
				database.ref().update({
					count: cnt,
					yesCount: yesCnt,
				});
				//if the ammount of yes clicks match the inital desired recipes to compare, set choices in firebase and move to compare page
				if ( recipeCount === yesCnt) 
				{
					database.ref().update({
						choices: choiceArr,			     
					});
					//go to compare page
					window.location.href = 'comparison.html';
					return;
				} 
			}
			
			// If any errors are experienced, log them to console.
			}, function(errorObject) {
			   		console.log("The read failed: " + errorObject.code);
		});

		//inc counts
		
	}

	//function to handle ick selections
	function noToFirebase() {
		//update counts
		cnt++;
		noCnt++;

		//set values in firebase
		database.ref().update({
			count: cnt,
			noCount: noCnt
		});

		
	}

	//initial display for swipe page
	function swipeDisplay() {
		database.ref().on("value", function(snapshot) {

		//get initial values from firebase
		if(snapshot.val()) {
			recipeName = snapshot.val().resultObject.results[snapshot.val().count].title;
			recipeImg = snapshot.val().resultObject.results[snapshot.val().count].image;
			//set IDs with initial picture and name
			$('#recipeName').html(recipeName);
			$('#recipeImg').attr('src', recipeImg).attr('height','300').attr('width','300');
		}
		// If any errors are experienced, log them to console.
		}, function(errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
		/* end database section */
	}
	//call fcn
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