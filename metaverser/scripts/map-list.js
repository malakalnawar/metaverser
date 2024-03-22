/*-------------------------------------------------------------------------------*/
/*-------------------------------- map list page --------------------------------*/
/*-------------------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function() {

    /*---------------------------------- header ----------------------------------*/

    var dropdownToggle = document.getElementById('dropdown-toggle');
    var menu = document.getElementById('menu');

    //toggle dropdown menu from header (for small screens)
    dropdownToggle.addEventListener('click', function(event) {
        event.stopPropagation(); //prevent event from bubbling up and triggering the document click listener
        if (menu.style.display == 'none') {
            menu.style.display = 'grid';
        }
        else {
            menu.style.display = 'none';
        }
    });

    //hide dropdown menu when clicking outside of it
    document.body.addEventListener('click', function(event) {

        var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        if (!menu.contains(event.target) && event.target !== dropdownToggle && viewportWidth < 768) {
            menu.style.display = 'none';
        }
    });

    //display menu (for large screens)
    window.addEventListener('resize', function() {
        
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

        if(darkTheme) {
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

                #map-list-container ul,
                #map-list-container a,
                #map-list-container h1 {
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

document.addEventListener('DOMContentLoaded', function() {

//fill page with map info
fillMapInfo("data/coms-orgs.json", "map-list-container");

});

/*---------------------------------- functions ----------------------------------*/

//fill the DOM with divs containing map info
async function fillMapInfo(URL, parentID) {
    try {
        //populate page with map content
        var data = await populateFrom(URL);

        document.getElementById(parentID).innerHTML = "";

        for (var i = 0; i < data.length; i++) {

            //generate new id
            var listID = "map-list" + i;

            // create new div to store list
            var divElement = document.createElement("div");
            divElement.classList.add("map-list");
            divElement.id = listID;
            var parentElement = document.getElementById(parentID);
            parentElement.appendChild(divElement);

            //generate handlebars template
            var source = document.getElementById("map-info-template").innerHTML;
            var template = Handlebars.compile(source);
            var html = template(data[i]);
            document.getElementById(listID).innerHTML = html;

        }
    } catch (error) {
        console.error('An error occurred:', error);
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