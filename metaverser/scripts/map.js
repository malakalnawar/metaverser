/*-------------------------------------------------------------------------------*/
/*-------------------------------- map page --------------------------------*/
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

                #map-content h1,
                #map-content .map-info h1,
                #map-content h3,
                #map-content .map-info h3,
                #map-content p,
                #map-content .map-info p,
                #map-content .map-info ul,
                #map-content a,
                #map-content .map-info a {
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

document.addEventListener('DOMContentLoaded', function () {

    //coordinates (longitude, latitude)
    /*
    NOTE: TURN INTO JSON FILE IF DATA BECOMES LARGER
    */
    var countries = [
        // North America
        [-106.3468, 56.1304, "Canada"], // Canada
        // United States
        [-122.4194, 37.7749, "California, USA"], // California
        [-122.3321, 47.6062, "Washington, USA"], // Washington
        [-71.0589, 42.3601, "Massachusetts, USA"],  // Massachusetts
        [-97.7431, 30.2672, "Texas, USA"],  // Texas
        [-74.0060, 40.7128, "New York, USA"],  // New York
        // South America
        [-47.9292, -15.7801, "Brazil"], // Brazil
        // Europe & Russia
        [105.3188, 61.5240, "Russia"],  // Russia
        [-0.1276, 51.5074, "United Kingdom"],   // United Kingdom
        [13.4049, 52.5200, "Germany"],   // Germany
        // Asia
        [116.4074, 39.9042, "China"],  // China 
        [138.2529, 36.2048, "Japan"],  // Japan
        [78.9629, 20.5937, "India"],   // India
        [54.3705, 24.4764, "United Arab Emirates"],   // UAE 
        // Africa
        [8.6753, 9.0820, "Nigeria"] // Nigeria
    ];
    var northAmerica = countries.slice(0, 6);
    var southAmerica = countries.slice(6, 7);
    var europeRussia = countries.slice(7, 10);
    var asia = countries.slice(10, 14);
    var africa = countries.slice(14, 15);


    /*---------------------------------- map ----------------------------------*/

    //build maps
    buildMap(countries, "data/geo.json", "#map0", "map-info0"); // World Map
    buildMap(northAmerica, "data/north-america-geo.json", "#map1", "map-info1"); // North America Map
    buildMap(southAmerica, "data/south-america-geo.json", "#map2", "map-info2"); // South America Map
    buildMap(asia, "data/asia-geo.json", "#map3", "map-info3"); // Asia Map
    buildMap(europeRussia, "data/europe-geo.json", "#map4", "map-info4"); // Europe & Russia Map
    buildMap(africa, "data/africa-geo.json", "#map5", "map-info5"); // Africa Map

    window.addEventListener("resize", function () {
        checkWindowWidth(); //displays maps according to widnow size
    })

});

//checks the windows width to know which map or set of maps to display
function checkWindowWidth() {

    if (window.innerWidth < 768) {
        //hide large screen maps
        var elements = document.getElementsByClassName("large-screen");
        Array.from(elements).forEach(function (element) { element.style.display = "none"; });
        //show small screen maps
        var elements = document.getElementsByClassName("small-screen");
        Array.from(elements).forEach(function (element) { element.style.display = "block"; });
    }
    else {
        //show large screen maps
        var elements = document.getElementsByClassName("large-screen");
        Array.from(elements).forEach(function (element) { element.style.display = "block"; });
        //hide small screen maps
        var elements = document.getElementsByClassName("small-screen");
        Array.from(elements).forEach(function (element) { element.style.display = "none"; });
    }

}

//fills a parent div with map info
async function fillMapInfo(URL, parentID, countryName) {
    try {
        //populate page with app content
        var data = await populateFrom(URL);

        document.getElementById(parentID).innerHTML = "";

        for (var i = 0; i < data.length; i++) {

            if (data[i].country == countryName) {

                //generate handlebars template
                var source = document.getElementById("map-info-template").innerHTML;
                var template = Handlebars.compile(source);
                var html = template(data[i]);
                document.getElementById(parentID).innerHTML = html;

            }

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

//creates a map using geoJSON data
function buildMap(countryCoordinates, geoJSON, mapID, infoClassName) {

    var map = d3.geoMercator(); //create mercator object
    var path = d3.geoPath().projection(map); //path generator
    var svg = d3.select(mapID); //svg container
    //load map data from JSON file
    d3.json(geoJSON).then(function (data) {
        // Render map features
        svg.selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", "#F3E8EE")
            .style("stroke", "black");
        //append markers to the map
        svg.selectAll(".marker")
            .data(countryCoordinates)
            .enter().append("circle")
            .attr("class", "marker")
            .attr("cx", function (d) { return map(d)[0]; }) //convert longitude to x-coordinate
            .attr("cy", function (d) { return map(d)[1]; }) //convert latitude to y-coordinate
            .attr("r", 4) //marker
            .style("fill", "#5E2BFF") //marker color
            .on("mouseover", function (d) {
                d3.select(this).attr("r", 8); //increase marker size on hover
            })
            .on("mouseout", function (d) {
                d3.select(this).attr("r", 4); //restore
            })
            .on("click", function (d) {
                fillMapInfo("data/coms-orgs.json", infoClassName, d.srcElement.__data__[2]);
            })

    }).catch(function (error) {
        console.log("Error loading map data:", error);
    });

    checkWindowWidth();

}