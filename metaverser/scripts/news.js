/*-------------------------------------------------------------------------------*/
/*---------------------------------- news page ----------------------------------*/
/*-------------------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function () {

    /*---------------------------------- header ----------------------------------*/

    var dropdownToggle = document.getElementById('dropdown-toggle');
    var menu = document.getElementById('menu');

    //toggle dropdown menu from header (for small screens)
    dropdownToggle.addEventListener('click', function (event) {
        event.stopPropagation(); //prevent event from bubbling up and triggering the document click listener
        if (menu.style.display == 'none') {
            menu.style.display = 'grid';
        }
        else {
            menu.style.display = 'none';
        }
    });

    //hide dropdown menu when clicking outside of it
    document.body.addEventListener('click', function (event) {

        var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        if (!menu.contains(event.target) && event.target !== dropdownToggle && viewportWidth < 768) {
            menu.style.display = 'none';
        }
    });

    //display menu (for large screens)
    window.addEventListener('resize', function () {

        var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        if (viewportWidth > 768) {
            menu.style.display = 'grid';
        }
        else {
            menu.style.display = 'none';
        }
    });

    //change light theme to dark theme
    var changeTheme = document.getElementById("change-theme");
    changeTheme.addEventListener('click', toggleTheme);

    var darkTheme = false;
    var styleElement;

    function toggleTheme() {

        var htmlElement = document.documentElement;

        if (darkTheme) {
            //change to light theme
            htmlElement.style.setProperty('--primary-color', '#66023C');
            htmlElement.style.setProperty('--secondary-color', '#BE3455');
            htmlElement.style.setProperty('--accent-color-1', '#5E2BFF');
            htmlElement.style.setProperty('--accent-color-2', '#4CC9F0');
            htmlElement.style.setProperty('--neutral-color', '#F3E8EE');
            //remove <style> element
            styleElement.remove();
            darkTheme = false; //signal state
        }
        else {
            //change to dark theme
            htmlElement.style.setProperty('--primary-color', 'black');
            htmlElement.style.setProperty('--secondary-color', '#66023C');
            htmlElement.style.setProperty('--accent-color-1', '#66023C');
            htmlElement.style.setProperty('--accent-color-2', '#66023C');
            htmlElement.style.setProperty('--neutral-color', '#66023C');
            //create a <style> element
            styleElement = document.createElement('style');
            //styling
            var css = `
    
                    #news-content h1,
                    #news-content .news h1, 
                    #news-content h2, 
                    #news-content h3,
                    #news-content .news h3, 
                    #news-content p,
                    #news-content .metanews,
                    #news-content a {
                        color: white;
                    }
    
                    body {
                        background-color: black;
                    }
    
                `;
            //set text content of the <style> element
            styleElement.textContent = css;
            //append to <head>
            document.head.appendChild(styleElement);
            darkTheme = true; //signal state
        }

    }

});

document.addEventListener("DOMContentLoaded", function () {

    //variables to keep track of loaded news
    var newsCount = 0;
    var newsIndex;

    //populate page with news content
    populateFrom("/data/news.json").then(data => {

        for (var i = 0; i < data.length; i++) {

            //find the headline and generate its own template
            if (data[i].headline) {

                var source = document.getElementById("headline-template").innerHTML;
                var template = Handlebars.compile(source);
                var html = template(data[i]);
                document.getElementById("headline").innerHTML = html;

            }

            //generate on first three news pieces
            if (newsCount < 3 && !data[i].headline) {

                //generate new id
                var numberID = newsCount.toString();
                var newsID = "news-piece" + numberID;

                // create new div to store news
                var divElement = document.createElement("div");
                divElement.classList.add("news-piece", "col-4");
                divElement.id = newsID;
                var parentElement = document.getElementById("news-container");
                parentElement.appendChild(divElement);

                //generate handlebars template
                var source = document.getElementById("news-piece-template").innerHTML;
                var template = Handlebars.compile(source);
                var html = template(data[i]);
                document.getElementById(newsID).innerHTML = html;

                newsCount++;
                newsIndex = i;

            }

        }

    })

    //load more button functionality
    var loadButton = document.getElementById("load");
    loadButton.addEventListener("click", function () {

        populateFrom("/data/news.json").then(data => {

            var loaded = 0;

            for (var i = newsIndex + 1; i < data.length; i++) {

                if (!data[i].headline) {

                    //generate new id
                    var numberID = newsCount.toString();
                    var newsID = "news-piece" + numberID;

                    // create new div to store news
                    var divElement = document.createElement("div");
                    divElement.classList.add("news-piece", "col-4");
                    divElement.id = newsID;
                    var parentElement = document.getElementById("news-container");
                    parentElement.appendChild(divElement);

                    //generate handlebars template
                    var source = document.getElementById("news-piece-template").innerHTML;
                    var template = Handlebars.compile(source);
                    var html = template(data[i]);
                    document.getElementById(newsID).innerHTML = html;

                    newsCount++;
                    newsIndex = i;
                    loaded++;
                }
                if (loaded >= 3) { //stop generating news after n pieces
                    break;
                }
            }

            //hide load more button when everything is loaded
            if (newsIndex + 1 >= data.length) {
                loadButton.style.display = 'none';
            }

        })

    });

    //variable to check if return button already exists
    var returnButtonGenerated = false;

    //search bar functionality
    document.getElementById("search-form").addEventListener("submit", function (event) {

        event.preventDefault(); //prevent the form from submitting

        //empty the page to show results instead
        var headline = document.getElementById("headline");
        headline.innerHTML = '';
        var newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = '';
        loadButton.style.display = 'none'; //hide load button


        //create new button and add to DOM
        if (!returnButtonGenerated) {
            var divElement = document.createElement("div");
            var btnElement = document.createElement("button");
            btnElement.innerText = "Return";
            btnElement.id = "return";
            divElement.classList.add("return");
            divElement.appendChild(btnElement);
            var parentElement = document.getElementById("search");
            parentElement.appendChild(divElement);
            returnButtonGenerated = true; //signal generation
        }
        //add functionality to new button
        var returnButton = document.getElementById("return");
        returnButton.addEventListener("click", function () {
            location.reload();
        });

        //collect input from user and make sure it is a string and has no spaces before and after
        var inputValue = document.getElementById("search-input").value.toString().trim();

        //populate page with news content on search command
        populateFrom("/data/news.json").then(data => {

            var targetNewsCount = 0; //variable to keep track of news loaded
            var results = false; //boolean to check results

            for (var i = 0; i < data.length; i++) {

                for (var i = 0; i < data.length; i++) {
                    var summary = data[i].summary.toLowerCase(); //convert summary to lowercase
                    var title = data[i].title.toLowerCase(); //convert title to lowercase
                    var website = data[i].website.toLowerCase(); //convert website to lowercase
                    var formattedDate = data[i].formattedDate;
                    var inputValueLowerCase = inputValue.toLowerCase(); //convert input value to lowercase
                    //regular expression for full word match
                    var regex = new RegExp("\\b" + inputValueLowerCase + "\\b", "i");
                    //check for matches and generate news if match found
                    if (inputValueLowerCase !== ""  //make sure input isn't nothing
                        && ((regex.test(summary) || regex.test(title) || regex.test(website)) //check for word match in different sections
                            || regex.test(formattedDate))) { //check for date match

                        //generate new id
                        var numberID = targetNewsCount.toString();
                        var newsID = "news-piece" + numberID;

                        // create new div to store news
                        var divElement = document.createElement("div");
                        divElement.classList.add("news-piece", "col-4");
                        divElement.id = newsID;
                        var parentElement = document.getElementById("news-container");
                        parentElement.appendChild(divElement);

                        //generate handlebars template
                        var source = document.getElementById("news-piece-template").innerHTML;
                        var template = Handlebars.compile(source);
                        var html = template(data[i]);

                        //highlight matching text in summary, title, and website
                        html = highlightText(html, inputValueLowerCase);

                        document.getElementById(newsID).innerHTML = html;

                        targetNewsCount++;

                        results = true; //signal that at least one result has been found
                    }
                }

            }

            //check if 'no results found' has already been generated
            var checkCreated = document.getElementById("results");

            //if no results are found, generate 'no results found' for user
            if (!results) {
                if (!checkCreated) { //generate 'no results found'
                    var divElement = document.createElement("div");
                    divElement.classList.add("results");
                    divElement.id = "results";
                    var pElement = document.createElement("p");
                    pElement.innerText = "No Results Found";
                    divElement.appendChild(pElement);
                    var parentElement = document.getElementById("search");
                    parentElement.appendChild(divElement);
                }
            }
            else {
                if (checkCreated) {
                    checkCreated.remove(); //remove 'no results found'
                }
            }

        })
    });

});

/*---------------------------------- functions ----------------------------------*/

//highlight matching text within HTML string
function highlightText(html, inputValueLowerCase) {

    //regular expression for matching the input value
    var regex = new RegExp("(?<!-)\\b" + inputValueLowerCase + "\\b(?!-)", "gi");

    //wrap matching text with <span> tags and apply highlight class
    return html.replace(regex, function (match) {
        return '<span class="' + "highlight" + '">' + match + '</span>';
    });

}

//load json file data
async function populateFrom(URL) {
    var requestURL = URL;
    var request = new Request(requestURL);

    var response = await fetch(request);
    var data = await response.json();

    return data;
}

