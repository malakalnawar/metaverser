/*-------------------------------------------------------------------------------*/
/*-------------------------------- profiles page --------------------------------*/
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

                #profile-content h1,
                #profile-content .info h1,
                #profile-content h2, 
                #profile-content h3,
                #profile-content p,
                #profile-content a,
                #profile-content .info a {
                    color: white;
                }

                #profile-content .profile img {
                    background-color: white;
                }

                #profile-content .graph-container {
                    background-color: white;
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

    /*---------------------------------- graph ----------------------------------*/

    let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    let graphWidth; //width of graph to be determined
    if (viewportWidth > 768) {
        graphWidth = viewportWidth - (viewportWidth * 0.4);
    }
    else {
        graphWidth = viewportWidth - (viewportWidth * 0.2);
    }
    loadGraph(graphWidth, 250); //build graph

    //reload graph on resize
    window.addEventListener('resize', function () {
        let resizeTimer;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {

            //destroy graph
            document.getElementById("container").innerHTML = "";

            //rebuild graph after timer
            let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            let graphWidth; //width of graph to be determined
            if (viewportWidth > 768) {
                graphWidth = viewportWidth - (viewportWidth * 0.4);
            }
            else {
                graphWidth = viewportWidth - (viewportWidth * 0.2);
            }
            loadGraph(graphWidth, 250);

        }, 1000); //1000 milliseconds
    })

    /*-------------------------------- sort functionality --------------------------------*/

    //event listners for each sorting option
    document.getElementById("newest").addEventListener("click", function () { selectOption('Newest') });
    document.getElementById("oldest").addEventListener("click", function () { selectOption('Oldest') });
    //generate sorted options
    function selectOption(option) {
        //change name of sort button
        var sortButton = document.getElementById("sort-button");
        sortButton.innerText = option;
        //empty grid
        document.getElementById("profile-container").innerHTML = "";
        //delete load more button
        var loadButtonDiv = document.getElementById("load-button");
        document.getElementById("load-button").innerHTML = "";
        //create new load more button
        var loadButton = document.createElement('button');
        loadButton.setAttribute('id', 'load');
        loadButton.textContent = 'Load More';
        loadButtonDiv.appendChild(loadButton);
        //rebuild profile grid
        buildProfileGrid(option);
    }

    /*-------------------------------- profile grid data handling --------------------------------*/

    buildProfileGrid();

});

/*-------------------------------- functions --------------------------------*/

//convert date strings to Date objects
function toDate(string) {
    const [month, day, year] = string.split('/').map(Number);
    return new Date(year, month - 1, day); // Month is zero-based in JavaScript Date objects
}

//sort data according to option
function sortData(data, option) {
    //options
    switch (option) {
        case 'Newest':
            //from newest to oldest
            data.sort((a, b) => toDate(b.formattedDate) - toDate(a.formattedDate));
            return data;
            break;
        case 'Oldest':
            //from oldest to newest
            data.sort((a, b) => toDate(a.formattedDate) - toDate(b.formattedDate));
            return data;
            break;
        default:
            //return data as is
            return data;
    }
}

//load line graph (d3.js)
function loadGraph(w, h) { //takes w (width) and h (height) as arguements

    //////////////////////////////////////////////////////////////////////////
    /////////////adapted from 'https://d3js.org/getting-started'//////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////below this this line////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    //declare the chart dimensions and margins.
    const MARGIN_TOP = 20;
    const MARGIN_RIGHT = 20;
    const MARGIN_BOTTM = 30;
    const MARGIN_LEFT = 40;

    //declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
        .domain([new Date("1995-01-01"), new Date("2023-01-01")])
        .range([MARGIN_LEFT, w - MARGIN_RIGHT]);

    //declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([0, 1600])
        .range([h - MARGIN_BOTTM, MARGIN_TOP]);

    //create the SVG container.
    const svg = d3.create("svg")
        .attr("width", w)
        .attr("height", h);

    //add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${h - MARGIN_BOTTM})`)
        .call(d3.axisBottom(x));

    //add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${MARGIN_LEFT},0)`)
        .call(d3.axisLeft(y));

    //append the SVG element.
    container.append(svg.node());

    //create a line generator
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));



    populateFrom("/data/graphData.json").then(data => {

        //convert data into graph readable form
        var data1 = [];
        for (var i = 0; i < data.webOfScience.length; i++) {
            var obj = {
                date: new Date(data.webOfScience[i].date),
                value: data.webOfScience[i].value
            }
            data1.push(obj); //add new objects to data array
        }
        var data2 = [];
        for (var j = 0; j < data.scopus.length; j++) {

            var obj = {
                date: new Date(data.scopus[j].date),
                value: data.scopus[j].value
            }
            data2.push(obj); //add new objects to data array
        }

        //define the y-axis grid line data
        const gridLineData = Array.from({ length: Math.ceil((y.domain()[1] - y.domain()[0]) / 200) }, (_, i) => y.domain()[0] + i * 200);

        //append a line element for each y-axis grid line
        svg.selectAll(".y-grid-line")
            .data(gridLineData)
            .enter()
            .append("line")
            .attr("class", "y-grid-line")
            .attr("x1", MARGIN_LEFT)
            .attr("y1", d => y(d))
            .attr("x2", w - MARGIN_RIGHT)
            .attr("y2", d => y(d))
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("stroke-opacity", 0.2);
        //append a path element for the line
        svg.append("path")
            .datum(data1)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("d", line);
        //append circles for data1
        svg.selectAll(".circle1")
            .data(data1)
            .enter()
            .append("circle")
            .attr("class", "circle1")
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value))
            .attr("r", 2)
            .style("fill", "blue");
        //add label
        svg.append("text")
            .attr("x", w - MARGIN_RIGHT - 30)
            .attr("y", y(data1[data1.length - 2].value) + 5)
            .style("text-anchor", "end")
            .style("fill", "blue")
            .text("Web of Science");
        //append a path element for the line
        svg.append("path")
            .datum(data2)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("d", line);
        //append circles for data2
        svg.selectAll(".circle2")
            .data(data2)
            .enter()
            .append("circle")
            .attr("class", "circle2")
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value))
            .attr("r", 2)
            .style("fill", "red");
        //add label
        svg.append("text")
            .attr("x", w - MARGIN_RIGHT - 40)
            .attr("y", y(data2[data2.length - 2].value) + 5)
            .style("text-anchor", "end")
            .style("fill", "red")
            .text("Scopus");
    });

    //////////////////////////////////////////////////////////////////////////
    /////////////adapted from 'https://d3js.org/getting-started'//////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////above this this line////////////////////////////
    //////////////////////////////////////////////////////////////////////////
}

//load json file data
async function populateFrom(URL) {
    var requestURL = URL;
    var request = new Request(requestURL);

    var response = await fetch(request);
    var data = await response.json();

    return data;
}

//build the profile grid
function buildProfileGrid(sortBy) {

    //variables to keep track of loaded profiles
    var profileCount = 0;
    var profileIndex;
    //populate page with profile content
    populateFrom("/data/profiles.json").then(data => {

        //sort data if necessary
        sortData(data, sortBy);

        for (var i = 0; i < data.length; i++) {
            if (profileCount < 4) {

                //generate new id
                var numberID = profileCount.toString();
                var profileID = "profile" + numberID;

                //create new div to store profile
                var divElement = document.createElement("div");
                divElement.classList.add("profile", "col-6");
                divElement.id = profileID;
                var parentElement = document.getElementById("profile-container");
                parentElement.appendChild(divElement);

                //generate handlebars template
                var source = document.getElementById("profile-template").innerHTML;
                var template = Handlebars.compile(source);
                var html = template(data[i]);
                document.getElementById(profileID).innerHTML = html;

                profileCount++;
                profileIndex = i;
            }
        }
    })

    //load button functionality
    var loadButton = document.getElementById("load");
    loadButton.addEventListener("click", function () {

        populateFrom("/data/profiles.json").then(data => {

            //sort data if necessary
            sortData(data, sortBy);

            var loaded = 0;

            for (var i = profileIndex + 1; i < data.length; i++) {
                //generate new id
                var numberID = profileCount.toString();
                var profileID = "profile" + numberID;

                // create new div to store profile
                var divElement = document.createElement("div");
                divElement.classList.add("profile", "col-6");
                divElement.id = profileID;
                var parentElement = document.getElementById("profile-container");
                parentElement.appendChild(divElement);

                //generate handlebars template
                var source = document.getElementById("profile-template").innerHTML;
                var template = Handlebars.compile(source);
                var html = template(data[i]);
                document.getElementById(profileID).innerHTML = html;

                profileCount++;
                profileIndex = i;
                loaded++;

                if (loaded >= 2) { //stop generating news after n pieces
                    break;
                }
            }
            //hide load more button when everything is loaded
            if (profileIndex + 1 >= data.length) {
                loadButton.style.display = 'none';
            }
        })
    });
}