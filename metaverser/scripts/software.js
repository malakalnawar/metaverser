/*-------------------------------------------------------------------------------*/
/*-------------------------------- software page --------------------------------*/
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

                #software-content h1,
                #software-content h2, 
                #software-content h3,
                #software-content p,
                #software-content a {
                    color: white;
                }

                #software-content .app-thumbnail0 img,
                #software-content .app-thumbnail1 img {
                    box-shadow: 0px 4px 6px rgba(255, 255, 255, 0.4);
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

//global variable to hold interval funcitons
var intervals = [];

document.addEventListener('DOMContentLoaded', function () {

    /*---------------------------------- displaying apps ----------------------------------*/

    //generates apps and moves them
    moveAppsAcrossScreen("/data/game-engines.json", "app-container0", "app-thumbnail0");
    moveAppsAcrossScreen("/data/web-dev-frameworks.json", "app-container1", "app-thumbnail1");

    /*---------------------------------- app pausing ----------------------------------*/

    //pause app movement during resize to prevent offset
    window.addEventListener('resize', function () {
        pauseMovement(); //pause movement during resize
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(function () {
            //reload after resize
            document.getElementById("app-container0").innerHTML = "";
            document.getElementById("app-container1").innerHTML = "";
            moveAppsAcrossScreen("/data/game-engines.json", "app-container0", "app-thumbnail0");
            moveAppsAcrossScreen("/data/web-dev-frameworks.json", "app-container1", "app-thumbnail1");
        }, 500);
    });
    //pause movement if clicked
    var controller0 = document.getElementById("controller0");
    controller0.addEventListener("click", function () {
        pauseMovement();
    });
    //pause movement if clicked
    var controller1 = document.getElementById("controller1");
    controller1.addEventListener("click", function () {
        pauseMovement();
    });

    /*-------------------------------- arrow buttons functionality --------------------------------*/

    //move apps when left arrow is clicked
    var leftArrow0 = document.getElementById("left-arrow0");
    leftArrow0.addEventListener("click", function (event) {
        skipOnce("app-thumbnail0", -1);
        event.stopPropagation();
    });
    var leftArrow1 = document.getElementById("left-arrow1");
    leftArrow1.addEventListener("click", function (event) {
        skipOnce("app-thumbnail1", -1);
        event.stopPropagation();
    });
    //move apps when right arrow is clicked
    var rightArrow0 = document.getElementById("right-arrow0");
    rightArrow0.addEventListener("click", function (event) {
        skipOnce("app-thumbnail0", 1);
        event.stopPropagation();
    });
    var rightArrow1 = document.getElementById("right-arrow1");
    rightArrow1.addEventListener("click", function (event) {
        skipOnce("app-thumbnail1", 1);
        event.stopPropagation();
    });

});

/*-------------------------------- functions --------------------------------*/

//pause app movement
function pauseMovement() {
    for (var i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i]);
    }
    intervals = [];
}

//resume app movement
function resumeMovement(className) {
    var apps = document.getElementsByClassName(className);
    for (var i = 0; i < apps.length; i++) {
        (function (i) {
            var interval = setInterval(function () {
                moveElement(apps[i], apps.length);
            }, 50);
            intervals.push(interval); //store in global
        })(i);
    }
}

//move apps a certain distance (once)
function skipOnce(className, direction) {
    var apps = document.getElementsByClassName(className); //get array of html elements
    var time = 0; //variable to record animation time
    for (var i = 0; i < apps.length; i++) {
        (function (i) {
            var interval = setInterval(function () {
                if (apps[i] == apps[0]) {
                    time = time + 50; //increase time of animation by interval time
                    if (time == 1000) { //1000 = 1 second
                        pauseMovement();
                        return;
                    }
                }
                moveElementOnce(apps[i], apps.length, 28, direction); //move apps once
            }, 50);
            intervals.push(interval); //store in global
        })(i);
    }
}

//load json file data
async function populateFrom(URL) {
    var requestURL = URL;
    var request = new Request(requestURL);

    var response = await fetch(request);
    var data = await response.json();

    return data;
}

//build app row
async function displayMovingRow(URL, parentID, className) {
    try {
        //populate page with app content
        var data = await populateFrom(URL);

        for (var i = 0; i < data.length; i++) {
            //generate new ID
            var numberID = i.toString();
            var appID = className + numberID;
            //create new div to store app
            var divElement = document.createElement("div");
            divElement.classList.add(className);
            divElement.id = appID;
            //append
            var parentElement = document.getElementById(parentID);
            parentElement.appendChild(divElement);
            //generate handlebars template
            var source = document.getElementById("app-template").innerHTML;
            var template = Handlebars.compile(source);
            var html = template(data[i]);
            document.getElementById(appID).innerHTML = html;
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

//app row setup
async function moveAppsAcrossScreen(URL, parentID, className) {
    try {
        await displayMovingRow(URL, parentID, className); //wait for data to be loaded and apps displayed

        var apps = document.getElementsByClassName(className); //get array of html elements

        //assign interval to each app and move them accordingly
        for (var i = 0; i < apps.length; i++) {
            (function (i) {
                var interval = setInterval(function () {
                    moveElement(apps[i], apps.length);
                }, 50);
                intervals.push(interval); //store in global
            })(i);
        }
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
}

//move app thumbnails
function moveElement(element, arrayLength) {
    //variables
    var computedStyle = getComputedStyle(element);
    var currentLeft = parseInt(computedStyle.getPropertyValue("left")); //get left attribute value of element
    var elementWidth = parseInt(computedStyle.getPropertyValue("width"));
    var rowWidth = elementWidth * arrayLength; //calculate length of app row
    var rect = element.getBoundingClientRect();
    var xPos = rect.left; //get x position of element
    //move apps
    element.style.left = currentLeft + 1 + 'px';

    //place app at beginning for another cycle
    if (xPos > window.innerWidth && xPos > rowWidth - 200) {
        if (window.innerWidth >= rowWidth) {
            //use window width to reposition
            element.style.left = currentLeft - window.innerWidth + 'px';
        }
        else {
            //use length of app row to reposition
            element.style.left = currentLeft - rowWidth + 'px';
        }
    }
}

//move app thumbnails (once)
function moveElementOnce(element, arrayLength, speed, direction) {
    //variables
    var computedStyle = getComputedStyle(element);
    var currentLeft = parseInt(computedStyle.getPropertyValue("left")); //get left attribute value of element
    var elementWidth = parseInt(computedStyle.getPropertyValue("width"));
    var rowWidth = elementWidth * arrayLength; //calculate length of app row
    var rect = element.getBoundingClientRect();
    var xPos = rect.left; //get x position of element
    //move apps
    if (window.innerWidth > 768) {
        element.style.left = currentLeft + (speed * direction) + 'px'; //direction: 1 = right & -1 = left
    }
    else {
        element.style.left = currentLeft + ((speed / 2) * direction) + 'px'; //direction: 1 = right & -1 = left
    }
    //place app at beginning for another cycle
    if (xPos >= window.innerWidth && xPos >= rowWidth - 200) {
        if (window.innerWidth >= rowWidth) {
            //use window width to reposition
            element.style.left = currentLeft - window.innerWidth + 'px';
        }
        else {
            //use length of app row to reposition
            element.style.left = currentLeft - rowWidth + 'px';
        }
    }
    //place app at end for another cycle
    if (xPos <= -200) {
        if (window.innerWidth >= rowWidth) {
            // Use window width to reposition
            element.style.left = currentLeft + window.innerWidth + 'px';
        } else {
            // Use length of app row to reposition
            element.style.left = currentLeft + rowWidth + 'px';
        }
    }

}

