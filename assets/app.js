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
			alert('recipe count hit');
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
			$('#recipeImg').attr('src', recipeImg);
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
			$('#recipeImg').attr('src', recipeImg);
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
			$('#recipeImg').attr('src', recipeImg);
		}
		  
		 // If any errors are experienced, log them to console.
		}, function(errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
		/* end database section */
	}
	swipeDisplay();

//end document ready, end script
});