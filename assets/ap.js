
// GLOBAL VERIABLES //

var recipeCount;
var cuisine;
var restriction;
var allergies;





//jQuery
$(document).ready(function () {

//collecting info on 
$('#submit-data').on('click', function(event) {
	event.preventDefault();

	console.log('submit button has been clicked');
	recipeCount = $('#recipe-count').val();
	cuisine = $('#cuisine').val();
	restriction = $('#restriction:checked').val();
	
	allergies = $('#allergies').val().trim();


//collecting restrictions may be tricky if they're multiple choice.
//let's talk about what data we want to collect, and how we're collecting it.

	console.log(recipeCount);
	console.log(cuisine);
	console.log(restriction);
	console.log(allergies);

	var URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&" +cuisine+ "&" + restriction + "&" + allergies;
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
              console.log(result);
              console.log(result.results[0].title);

               // $("#food-view").text(result[0].name);
            },
            error: function (error) {
                
            }
        });

});





//end document ready, end script
});