// GLOBAL VARIABLES //
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
var randomNumObj = {uniqueRandoms: []};

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

	//init firebase
	firebase.initializeApp(config);

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
				    choices:'',
				    randomNum:''
			    });
	            //navigate to swipe page after the call
			    window.location.href = 'swipe.html';
			    makeUniqueRandom();
            },
            	error: function (error) {
            	}
        });
	};

	//function to handle yes clicks
	function yesToFirebase() {
		
		//get snapshot to assign current recipe to choice arrary
		firebase.database().ref('/').once('value').then(function(snapshot) {
			cnt++;
			yesCnt++;
			//update choice in choice array
			choiceArr.push(snapshot.val().resultObject.results[snapshot.val().randomNum]);
			//update database with count data
			database.ref().update({
				count: cnt,
				yesCount: yesCnt,
			});
			//append choice to choices in firebase
			database.ref().update({
					choices: choiceArr,			     
				});
			//get random number	
			makeUniqueRandom();
			//if the ammount of yes clicks match the inital desired recipes to compare, set choices in firebase and move to compare page
			if ( recipeCount === yesCnt) 
			{
				//go to compare page
				window.location.href = 'comparison.html';
				return;
			} 
			// If any errors are experienced, log them to console.
			}, function(errorObject) {
			   		console.log("The read failed: " + errorObject.code);
			   });		
	}

	//function to handle ick selections
	function noToFirebase() {
		//make a new random number to populate next choice
		makeUniqueRandom();
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
		//get the initial random number
		makeUniqueRandom();

		database.ref().on("value", function(snapshot) {
		//get initial values from firebase
			if(snapshot.val()) {
				recipeName = snapshot.val().resultObject.results[snapshot.val().randomNum].title;
				recipeImg = snapshot.val().resultObject.results[snapshot.val().randomNum].image;
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
	//funciton call to populate swipe page
	swipeDisplay();


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
			ingredientArray = [];
			ingredientsArray = [];
			recipe = chosenRecipes[i];

			if (recipe) {
				var recipeSteps = recipe.analyzedInstructions[0].steps;
				var numSteps = recipeSteps.length;
				for (y = 0; y < numSteps; y++) {
			      	//console.log(firebaseObject.analyzedInstructions[0].steps[i].step);
			      	if (recipe.analyzedInstructions[0].steps[y].ingredients) {
				      	var numIngredients = recipe.analyzedInstructions[0].steps[y].ingredients;
				      	var test = numIngredients.length;
				      	for (x = 0; x < test; x++) {
				          	var ingredient = recipe.analyzedInstructions[0].steps[y].ingredients[x].name;
				          	ingredientArray.push(ingredient);
				      	}
			      	}
	      		}

				name = recipe.title;
				image = recipe.image;
				servings = recipe.servings;
				source = recipe.sourceUrl;
				var ingredientList = '';
				for (z = 0; z < ingredientArray.length; z++) {
					ingredientList = ingredientList + '- ' + ingredientArray[z] + '<br>';
				} 

				console.log(name + ' ' + image + ' ' + price + ' ' + servings + ' ' + source);

				// adding the thumbnail divs
				var compare = $('<div></div>');
				compare.addClass('col-sm-3');
				var compareThumb= $('<div></div>');
				compareThumb.addClass('thumbnail');

				compareThumb.html('<img src="' + image + '">'); //recipe image
				compareThumb.append('<h3>' + name + '</h3>'); //recipe title
				compareThumb.append('<p> Number of servings: ' + servings + '</p>');
				compareThumb.append('<p>' + ingredientList + '</p>');
				compareThumb.append('<a href="' + source + '">');

				//takes user to recipe
				$(compare).click(function() {
				  window.location = $(this).find("a").attr("href"); 
				  return false;
				});
				compare.append(compareThumb);
				$('#recipe-comparisons').append(compare);
			}
		}
	}

	//function to generate a random number
	function makeUniqueRandom() {
		var n = 20;
	    if (!randomNumObj.uniqueRandoms.length) {
	        for (var i = 0; i < n; i++) {
	            randomNumObj.uniqueRandoms.push(i); // generates [1,2,3,4]
	        }
	    }
	    var index = Math.floor(Math.random() * randomNumObj.uniqueRandoms.length),
	        val = randomNumObj.uniqueRandoms[index];
	    	randomNumObj.uniqueRandoms.splice(index, 1);
	    database.ref().update({
			randomNum: val
		});
	}	

	function getSelectRecipeData() {
		$('recipe-comparisons').html('');
		firebase.database().ref('/').once('value').then(function(snapshot) {
			var data = snapshot.val().choices;
			renderDataToDom(data);
		});
	};

	getSelectRecipeData()
//end document ready, end script
});