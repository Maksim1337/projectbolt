/* viewQuestions NAMESPACE
 ============================================================== */
const viewQuestions = function () {
  const scriptFilename = "viewQuestions.js";

  const addToTable = function (question, isTopUser) {
    let questionText = question[0];
    let questionUser = question[1];
    let questionID = question[2];
    let questionsTable = document.getElementById("questionsTable");
    let topUser = false; // by default, when addToTable is called the row won't contain a user of the month

    (function ensureParamIsProvided() {
      if(typeof isTopUser !== "undefined" || isTopUser !== undefined || isTopUser !== null) {
        topUser = isTopUser;
      }
    })();

    // A row with a delete button, question, user and answers
    let tableRow = document.createElement("div");
    tableRow.setAttribute("class", "Table-row");

    /* Delete
    ============================================================== */
    // The delete div
    let rowItemDelete = document.createElement("div");
    rowItemDelete.setAttribute("class", "Table-row-item u-Flex-grow1 deleteColumn");
    rowItemDelete.setAttribute("data-header", "Action");

    // The delete div style
    rowItemDelete.style.display = "flex";
    rowItemDelete.style.justifyContent = "center";
    rowItemDelete.style.alignContent = "center";

    // The delete button
    let rowItemDeleteButton = document.createElement("button");
    rowItemDeleteButton.setAttribute("class", "deleteButton fa fa-close");
    rowItemDeleteButton.setAttribute("id", questionID);
    rowItemDelete.appendChild(rowItemDeleteButton);

    // The question
    let rowItemQuestion = document.createElement("div");
    rowItemQuestion.setAttribute("class", "Table-row-item u-Flex-grow9");
    rowItemQuestion.setAttribute("data-header", "Question");
    rowItemQuestion.textContent = questionText;

    // The user
    let rowItemUser = document.createElement("div");
    rowItemUser.setAttribute("class", "Table-row-item u-Flex-grow1");
    rowItemUser.setAttribute("data-header", "User");
    rowItemUser.textContent = questionUser;

    if(topUser) {
      let rowItemImg = document.createElement("img");
      rowItemImg.src = "images/topBadge.jpg";
      rowItemImg.style.height = "20px";
      // Add flex stuff here
      rowItemUser.appendChild(rowItemImg);
    }

    // The answers link
    let rowItemAnswer = document.createElement("div");
    rowItemAnswer.setAttribute("class", "Table-row-item u-Flex-grow1");
    rowItemAnswer.setAttribute("data-header", "Answers");
    let rowItemAnswerLink = document.createElement("a");
    rowItemAnswerLink.textContent = "Answers";
    rowItemAnswerLink.title = "Answers";
    rowItemAnswerLink.href = "answers.html?qid=" + questionID;
    global.trackQuestionsVisited($(rowItemAnswerLink), questionID);
    rowItemAnswer.appendChild(rowItemAnswerLink);

    // Append the delete button, question, user and answer to that table row
    tableRow.appendChild(rowItemDelete);
    tableRow.appendChild(rowItemQuestion);
    tableRow.appendChild(rowItemUser);
    tableRow.appendChild(rowItemAnswer);

    // Append the row to the table
    questionsTable.appendChild(tableRow);
  };

  const reloadQuestions = function () {
    return new Promise((resolve, reject) => {
      // Remove all from the table except for the headers
      $(".Table-row:not(.Table-header)").remove();
      let sessionID = sessionStorage.getItem('projectBoltSessionID');

      let getAllQuestionsPromise = $.getJSON("questions/get-all-questions/"+sessionID);
      global.logPromise(getAllQuestionsPromise, scriptFilename, "Requesting all question data");

      let isTeacherPromise = $.get("login/is-teacher/"+sessionID);
      global.logPromise(isTeacherPromise, scriptFilename, "Requesting user teacher status");

      let isUserOfTheMonthPromise = userOfTheMonth.getUserOfTheMonth();
      global.logPromise(isUserOfTheMonthPromise, scriptFilename, "Requesting user of the month");

      // TODO Delete this
      // This is a test of mostPopularQuestion
      let getMostPopularQuestions = $.getJSON("questions/get-most-popular/"+sessionID);
      global.logPromise(getMostPopularQuestions, scriptFilename, "Requesting most popular questions");

      Promise.all([getAllQuestionsPromise, isTeacherPromise, getMostPopularQuestions, isUserOfTheMonthPromise]).then((values) => {
        let questionsData = values[0];      // Return value from getAllQuestionsPromise
        let isTeacher = values[1];          // Return value from isTeacherPromise
        let getMostPopularQuestions = [2];  // Return value from getMostPopularQuestions
        let isUserOfTheMonth = values[3];   // Return value from isUserOfTheMonthPromise

        $.each(questionsData, function (key, val) {
          if(val["UserID"] === isUserOfTheMonth) {
            addToTable([val["Question"], val["Username"], val["ID"]], true);
          }
          else {
            addToTable([val["Question"], val["Username"], val["ID"]], false);
          }
        });

        $(".deleteColumn").css("display", "none");      
        if (isTeacher) {
          $(".deleteColumn").css("display", "flex");
        }
        $('.deleteButton').on("click", function(){
          removeQuestion.removeQuestion($(this));
        });
        
        resolve();

      }).catch(() => {
        reject();
      })
    });
  };

  return {
    reloadQuestions: reloadQuestions,
  }
}();

$(document).ready(function () {
  let loginCheckPromise = loginCheck.checkLogin();
  let loadNavigationPromise = navigation.loadNavigation();
  let initNotificationsPromise = notifications.initNotifications();

  Promise.all([loginCheckPromise, loadNavigationPromise, initNotificationsPromise]).then(() => {
    viewQuestions.reloadQuestions().then(() => {
      global.hideLoader();
    }).catch(() => {
      unfoldingHeader.unfoldHeader("An error ocurred (logging out in 5 seconds)", "red");
      setTimeout(function(){ global.logout(); }, 5000);   
    }); 
  }).catch(() => {
    unfoldingHeader.unfoldHeader("An error ocurred (logging out in 5 seconds)", "red");
    setTimeout(function(){ global.logout(); }, 5000);   
  }); 
});
