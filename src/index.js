const API_KEY = "6fe4fbead1507fbf062d28ac8cc61f05";
var INPUTFIELD = document.getElementById("search-input");
INPUTFIELD.addEventListener("input", debounce(sendRequest, 300));

/**
 * Stop a function from being executed while an action is being invoked
 * @param {function} func the function that is executed after the debouce time
 * @param {*} wait the amount of time to wait after last received action
 */
function debounce(func, wait) {
    var timeout;

    return function() {
        var context = this;
        var args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(function() {
            timeout = null;
            func.apply(context, args);
        }, wait);
    }
}

/**
 * Sends a request to themoviedb api with the user's current input
 */
function sendRequest(){
    if (INPUTFIELD.value.length >= 3) {
        var url = "https://api.themoviedb.org/3/search/movie?api_key="+ API_KEY + "&language=en-US&query="+ INPUTFIELD.value;

        closeSelectionList();
        
        fetch(url).then(data => {
            return data.json();
        }).then(res => {
            createSearchList(res.results);
        });
    } else{
        closeSelectionList();
    }
}

/**
 * Creates a selection list to display for the user
 * @param {Array} data list of movies that match user's input
 */
function createSearchList(data) {
    var listContainer, listItem, movieReleaseYear, i, listLength;

    // list is sorted by the average movie rating in descending order
    data.sort(function(a, b) {
        return a.vote_average - b.vote_average
    });
    data.reverse();

    listContainer = document.createElement("div");
    listContainer.setAttribute("class", "autocomplete-list");

    // setting the max number of movies in selection list to 8
    listLength = 8;
    if(data.length < listLength) {
        listLength = data.length;
    }

    for(i = 0; i < listLength; i++) {
        movieReleaseYear = data[i].release_date.substr(0, 4);

        listItem = document.createElement("div");
        listItem.innerHTML = "<h4>" + data[i].title + "</h4>" + "<h5>" + data[i].vote_average + " Rating, " + movieReleaseYear + "</h5>";
        listItem.innerHTML += "<input type='hidden' value='" + data[i].title + "'>";

        listItem.addEventListener("click", function(e) {
            INPUTFIELD.value = this.getElementsByTagName("input")[0].value;
            closeSelectionList();
        });

        listContainer.appendChild(listItem);
    }

    INPUTFIELD.parentNode.appendChild(listContainer);
}

/**
 * Clears the selection list
 */
function closeSelectionList() {
    var listContainer, i;

    listContainer = document.getElementsByClassName("autocomplete-list"); 

    if(listContainer.length === 0) {
        return;
    } else {
        for (i = 0; i < listContainer.length; i++) {
            listContainer[i].parentNode.removeChild(listContainer[i]);
        }
    }
}