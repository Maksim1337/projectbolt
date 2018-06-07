/* JSHint quality control
 ============================================================== */
/*jshint esversion: 6*/
/*jslint devel: true*/
/*globals unfoldingHeader, global, $:false*/

/* addAnswer NAMESPACE
 ============================================================== */
const addAnswer = function() {
  "use strict";
  // AJAX post answer
  const postAnswer = function (bodyJSON){
    $.ajax({
      type: 'POST',
      data: bodyJSON,
      url: 'answers/add-answer',
      success: function(){
        console.log(`${postAnswer.name} says: Answer added successfully`);
        notifications.getNotificationSocket().emit('newAnswer', {question: bodyJSON.question, questionID: bodyJSON.questionID});
      },
      error: function(jqXHR) {
        // If the server response includes "Violation of UNIQUE KEY"
        if(global.logAJAXErr(postAnswer.name, jqXHR) === "duplicatedKey") {
          // The user is trying to add an already existing answer
          unfoldingHeader.unfoldHeader("This answer already exists", "orange");
        }
        // More general error
        else {
          unfoldingHeader.unfoldHeader("Failed to post your answer. Apologies :(", "red");
        }
      }
    });
  };

  return {
    postAnswer: postAnswer
  };
}();