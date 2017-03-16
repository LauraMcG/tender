
// GLOBAL VERIABLES //

var allergies;
var recipieCount;




//jQuery
$(document).ready(function () {

//collecting info on 
$('#submit-data').on('click', function(event) {
	event.preventDefault();

	console.log('submit button has been clicked');
	allergies = $('#allergies').val().trim();
	recipieCount = $('#recipie-count').val();

//collecting restrictions may be tricky if they're multiple choice.
//let's talk about what data we want to collect, and how we're collecting it.

	console.log(allergies + ' ' + recipieCount);

});



//end document ready, end script
});