/*-------------------------------------------------------------------------------*/
/*---------------------------------- specs page ---------------------------------*/
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

                #specs-content h1,
                #specs-content h2, 
                #specs-content h3,
                #specs-content p,
                #specs-content a {
                    color: white;
                }

                .spec-table th,
                .spec-table td,
                .spec-table caption,
                .reg-table th,
                .reg-table td,
                .reg-table caption {
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