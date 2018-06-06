const viewRatings = function() {
    const updateAllRatings = function updateAllRatings() {
        console.log("Updating all ratings");
        $('.ui.rating').each(function( index ) {
            updateRating($(this));
        });
    };

    const updateRating = function updateRatings(ratingElement) {
        ratingElement.rating("disable");
        let answerID = ratingElement.attr("id");
        let sessionID = sessionStorage.getItem('projectBoltSessionID');

        console.log("Acquiring ratings of answerID " + answerID);
        $.getJSON( "rating/get-all-ratings/"+answerID+"/"+sessionID, function() {})
        .done(function(data) {
            console.log("Ratings recieved of answerID " + answerID);
            let totalRating = 0;
            let ratingCount = data.length;
            $.each( data, function( key, val ) {
                totalRating += val["Rating"];
            });
            averageRating = Math.ceil(totalRating / ratingCount);
            ratingElement.rating('set rating', averageRating);
        })
        .fail(function(message) {
            unfoldingHeader.unfoldHeader("Failed acquiring ratings, see console for details", "red", true);
            console.log("Failed acquiring ratings of answerID " + answerID + ": " + message.responseText);
        })
        .always(function() {
            ratingElement.rating("enable");
        });
    };

    return {
        updateAllRatings: updateAllRatings,
        updateRating: updateRating
    }
}();