/*!
* IconPicker ('https://github.com/furcan/IconPicker')
* Version: 1.5.0 
* Author: Furkan MT ('https://github.com/furcan')
* Dependencies: Font Awesome Free v5.11.2 (https://fontawesome.com/license/free)
* Copyright 2019 IconPicker, MIT Licence ('https://opensource.org/licenses/MIT')*
*/

'use strict';

// IconPicker: Default Options on
const ipDefaultOptions = {
    jsonIconList: null,
    jsonUrl: null,
    searchPlaceholder: 'Search Icon',
    showAllButton: 'Show All',
    cancelButton: 'Cancel',
    noResultsFound: 'No results found.',
    borderRadius: '20px',
};
let ipNewOptions;
const ipGithubUrl = 'https://github.com/furcan/IconPicker';
// IconPicker: Default Options off

// IconPicker: Extend Options on
const extendIconPicker = function () {
    let extended = {};
    let deep = false;
    let i = 0;
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
        deep = arguments[0];
        i++;
    }
    const merge = function (obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = extendIconPicker(extended[prop], obj[prop]);
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };
    for (; i < arguments.length; i++) {
        merge(arguments[i]);
    }
    return extended;
};
// IconPicker: Extend Options off


// IconPicker: Main on
const IconPicker = {

    // init
    Init: function (ipUserOptions) {
        ipNewOptions = extendIconPicker(true, ipDefaultOptions, ipUserOptions);
    },

    // run
    Run: function (theButton, theCallback) {


        // IconPicker: Append Library to Body on
        const appendIconListToBody = function (data, buttonShowAll, buttonCancel, searchPlaceholder, borderRadius, inputElement, previewElement, theCallback) {

            // data
            const jsonData = JSON.parse(data);

            // icons
            let icons = '';
            for (let index = 0; index < jsonData.length; ++index) {
                let icon = '<i data-search="' + jsonData[index] + '" data-class="' + jsonData[index] + '" class="first-icon select-icon ' + jsonData[index] + '"></i>';
                icons += icon;
            }

            // loading indicator
            const loadingIndicator = '<div id="IconPickerLoading"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="60" height="60" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="translate(25 50)"><circle cx="0" cy="0" r="9" fill="#1e1e1e" transform="scale(0.24 0.24)"><animateTransform attributeName="transform" type="scale" begin="-0.2666s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="0.8s" repeatCount="indefinite"/></circle></g><g transform="translate(50 50)"><circle cx="0" cy="0" r="9" fill="#1e1e1e" transform="scale(0.00153 0.00153)"><animateTransform attributeName="transform" type="scale" begin="-0.1333s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="0.8s" repeatCount="indefinite"/></circle></g><g transform="translate(75 50)"><circle cx="0" cy="0" r="9" fill="#1e1e1e" transform="scale(0.3 0.3)"><animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="0.8s" repeatCount="indefinite"/></circle></g></svg></div>';

            // icons wrap
            const iconWrap = '<div class="ip-icons-content" style="border-radius:' + borderRadius + ';">' +
                '<div class="ip-icons-search"><input id="IconPickerSearch" type="text" spellcheck="false" autocomplete="off" placeholder="' + searchPlaceholder + '" style="border-radius:' + borderRadius + ';" /><i class="placeholder-icon fas fa-search"></i></div>' +
                '<div class="ip-icons-search-results"></div>' +
                '<div class="ip-icons-area">' +
                loadingIndicator +
                icons +
                '<a class="ip-show-all-icons" style="border-radius:' + borderRadius + ';">' + buttonShowAll + '</a>' +
                '</div>' +
                '<div class="ip-icons-footer"><a class="cancel" style="border-radius:' + borderRadius + ';">' + buttonCancel + '</a></div>' +
                '</div>';

            // create the modal element
            let IconPickerModal = document.createElement('div')
            IconPickerModal.id = 'IconPickerModal';
            IconPickerModal.innerHTML = iconWrap;

            // body
            let docBody = document.body;

            // append to body
            docBody.appendChild(IconPickerModal);

            // get the modal element
            const ipElement = document.getElementById(IconPickerModal.id);

            // modal element display css
            ipElement.style.display = 'block';

            // heights
            const ipHeight = ipElement.offsetHeight;
            const winHeight = window.innerHeight;

            // modal element position top css on
            const liveScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            let totalTopPos = liveScrollTop + ((winHeight - ipHeight) / 2);
            if (winHeight + 20 <= ipHeight) {
                totalTopPos = liveScrollTop;
            }
            ipElement.style.top = totalTopPos + 'px';
            // modal element position top css off

            // add css animation class to modal
            ipElement.classList.add('animate');

            // remove loading indicator on
            const loadingElement = document.getElementById('IconPickerLoading');
            let ltAnimate = setTimeout(function () {
                loadingElement.classList.add('hide');
                clearTimeout(ltAnimate);
            }, 600);
            let ltRemove = setTimeout(function () {
                loadingElement.parentNode.removeChild(loadingElement);
                clearTimeout(ltRemove);
            }, 900);
            // remove loading indicator off

            // show all button click listener on
            const showAllButtonElm = document.getElementById(IconPickerModal.id).getElementsByClassName('ip-show-all-icons')[0];
            showAllButtonElm.addEventListener('click', function () {
                ipElement.classList.add('show-all');
                this.parentNode.removeChild(this);
            }, false);
            // show all button click listener off

            // close and remove all on
            let removeIpElement = function (delay) {
                ipElement.classList.remove('animate');
                setTimeout(function () {
                    docBody.removeChild(ipElement);
                }, delay);
            }
            // close and remove all off

            // cancel button click listener on
            const cancelButtonElm = document.getElementById(IconPickerModal.id).getElementsByClassName('cancel')[0];
            cancelButtonElm.addEventListener('click', function () {
                removeIpElement(400);
            }, false);
            // cancel button click listener off

            // search input keyup listener on
            const searchInputElm = document.getElementById('IconPickerSearch');

            searchInputElm.addEventListener('keyup', function (e) {

                // keycodes
                const eKeyCode = e.keyCode;
                const eCode = e.code.toString().toLowerCase();

                // check space and backspace keyup
                let spaceOrBackspace = false;
                if (eKeyCode === 32 || eCode === 'space' || eKeyCode === 8 || eCode === 'backspace') {
                    spaceOrBackspace = true;
                }

                // cant type space
                if (eKeyCode === 32 || eCode === 'space') {
                    this.value = this.value.replace(' ', '');
                    return false;
                }

                // this val
                const searchVal = this.value.toString().toLowerCase();

                // define icons areas
                const firstIconsArea = document.getElementById(IconPickerModal.id).getElementsByClassName('ip-icons-area')[0];
                const searchResultArea = document.getElementById(IconPickerModal.id).getElementsByClassName('ip-icons-search-results')[0];

                // clear old results
                searchResultArea.innerHTML = '';

                // (if not space or backspace) and (if typed at least one char) able to search
                if ( ! spaceOrBackspace && searchVal.length > 0) {

                    // for "serch term" in Json
                    let tempIcons = '';
                    for (let index = 0; index < jsonData.length; ++index) {
                        // if there is results create them
                        if (jsonData[index].indexOf(searchVal) > -1) {
                            firstIconsArea.style.display = 'none';
                            let tempIcon = '<i data-search="' + jsonData[index] + '" data-class="' + jsonData[index] + '" class="search-icon select-icon ' + jsonData[index] + '"></i>';
                            tempIcons += tempIcon;
                        }
                    }

                    // create a temp container
                    let tempResults = document.createElement('div');
                    tempResults.id = 'IconsTempResults';
                    tempResults.innerHTML = tempIcons;

                    // no results found on
                    if (tempIcons.length < 1) {
                        firstIconsArea.style.display = 'none';
                        let noResultsText = ipNewOptions.noResultsFound;
                        if (!noResultsText || (noResultsText && noResultsText.length < 1)) {
                            noResultsText = ipDefaultOptions.noResultsFound;
                        }
                        tempResults.innerHTML = '<p class="ip-no-results-found">' + noResultsText + '</p>';
                    }
                    // no results found off

                    // append temp container to results area
                    searchResultArea.appendChild(tempResults);

                    // event listener for each temp icon
                    eachIconEventListener('search');

                }
                // show first icons
                else {
                    firstIconsArea.style.display = 'block';
                }

            }, false);
            // search input keyup listener off


            // each icon click listener on
            const eachIconEventListener = function (firstOrSearch) {

                const inputElm = document.querySelectorAll(inputElement);
                const previewElm = document.querySelectorAll(previewElement);

                // define icons on
                let eachIconElm;
                if (firstOrSearch === 'first') { // first
                    eachIconElm = document.getElementById(IconPickerModal.id).getElementsByClassName('first-icon');
                } else if (firstOrSearch === 'search') { // search
                    eachIconElm = document.getElementById(IconPickerModal.id).getElementsByClassName('search-icon');
                }
                // define icons off

                // add listeners each on
                for (let i = 0; i < eachIconElm.length; i++) {
                    let singleIconElm = eachIconElm[i];
                    singleIconElm.addEventListener('click', function (e) {
                        e.preventDefault();
                        let iconClassName = this.dataset.class;

                        // each input value on
                        for (let i = 0; i < inputElm.length; i++) {

                            const getTagName = inputElm[i].tagName.toString().toLowerCase();
                            // if an input or textarea element
                            if (getTagName === 'input' || getTagName === 'textarea') {
                                inputElm[i].value = iconClassName;
                            }
                            // else any of element
                            else {
                                inputElm[i].innerHTML = iconClassName;
                            }

                        }
                        // each input value off

                        // each preview on
                        for (let i = 0; i < previewElm.length; i++) {
                            previewElm[i].className = iconClassName;
                        }
                        // each preview off

                        // callback on
                        if (theCallback) {
                            theCallback();
                        }
                        // callback off

                        removeIpElement(400);
                    }, false);
                }
                // add listeners each off

            }
            // each icon click listener off

            // first icons listeners
            eachIconEventListener('first');

        };
        // IconPicker: Append Library to Body off

// IconPicker: Process the already set iconlist & AppendTo Body on
        const processIconListSetting = function (jsonIconList, buttonShowAll, buttonCancel, searchPlaceholder, borderRadius, inputElement, previewElement, theCallback) {

            // modal element
            const ipElement = document.getElementById('IconPickerModal');

            // if modal element doesn't exist on document send XMLHttpRequest
            if ( ! ipElement) {
                appendIconListToBody(jsonIconList, buttonShowAll, buttonCancel, searchPlaceholder, borderRadius, inputElement, previewElement, theCallback);
            }
        };

        // IconPicker: Get Library from JSON and AppendTo Body on
        const getIconListXmlHttpRequest = function (jsonUrl, buttonShowAll, buttonCancel, searchPlaceholder, borderRadius, inputElement, previewElement, theCallback) {

            // if chrome browser
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                // check the protocol
                if (window.location.protocol.indexOf('http') <= -1) {
                    ipConsoleLog('Chrome Browser blocked this request by CORS policy.');
                    return false;
                }
            }

            // modal element
            const ipElement = document.getElementById('IconPickerModal');

            // if modal element doesn't exist on document send XMLHttpRequest
            if ( ! ipElement) {
                const xmlHttp = new XMLHttpRequest();
                xmlHttp.open('GET', jsonUrl, true);
                xmlHttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xmlHttp.send();
                xmlHttp.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status === 200) { // success
                            const data = this.responseText;
                            appendIconListToBody(data, buttonShowAll, buttonCancel, searchPlaceholder, borderRadius, inputElement, previewElement, theCallback);
                        } else {
                            ipConsoleError('XMLHttpRequest Failed.');
                        }
                    }
                };
            }
        };
// IconPicker: Console Error Function on
        const ipConsoleError = function (errorMessage) {
            return console.error('%c IconPicker (Error) ', 'padding:2px;border-radius:20px;color:#fff;background:#f44336', '\n' + errorMessage);
        }
        // IconPicker: Console Error Function off

        // IconPicker: Console Log Function on
        const ipConsoleLog = function (errorMessage) {
            return console.log('%c IconPicker (Info) ', 'padding:2px;border-radius:20px;color:#fff;background:#00bcd4', '\n' + errorMessage);
        }
        // IconPicker: Console Log Function off

        // IconPicker: Check The Arguments For Proceed on
        if (arguments && arguments.length <= 2) {

            // query selector
            const ipButtons = document.querySelectorAll(theButton);

            // if button exist on the document
            if (ipButtons && ipButtons.length > 0) {
                for (let i = 0; i < ipButtons.length; i++) {

                    // IconPicker: Button Listeners -> Send XMLHttpRequest on
                    let ipButton = ipButtons[i];
                    ipButton.addEventListener('click', function () {
                        const jsonIconList = ipNewOptions.jsonIconList;
                        const jsonUrl = ipNewOptions.jsonUrl;
                        const inputElement = this.dataset.iconpickerInput;
                        const previewElement = this.dataset.iconpickerPreview;
                        let showAllButton = ipNewOptions.showAllButton;
                        if (!showAllButton || (showAllButton && showAllButton.length < 1)) {
                            showAllButton = ipDefaultOptions.showAllButton;
                        }
                        let cancelButton = ipNewOptions.cancelButton;
                        if (!cancelButton || (cancelButton && cancelButton.length < 1)) {
                            cancelButton = ipDefaultOptions.cancelButton;
                        }
                        let searchPlaceholder = ipNewOptions.searchPlaceholder;
                        if (!searchPlaceholder || (searchPlaceholder && searchPlaceholder.length < 1)) {
                            searchPlaceholder = ipDefaultOptions.searchPlaceholder;
                        }
                        let borderRadius = ipNewOptions.borderRadius;
                        if (!borderRadius || (borderRadius && borderRadius.length < 1)) {
                            borderRadius = ipDefaultOptions.borderRadius;
                        }

                       // check the json url and json icon list on
                        if ( ! jsonUrl && ! jsonIconList) {
                            ipConsoleError('You have to set the path of IconPicker JSON file to "jsonUrl" option or init the plugin with the appropriate "jsonIconList"');
                            return false;
                        }
                        // check the json url and json icon list off

                        // check the input on
                        const checkInput = document.querySelectorAll(inputElement);
                        if (checkInput.length <= 0) {
                            ipConsoleError('You must define your Input element with it\'s ID or Class Name to your Button element data attribute. \n\nExample: \ndata-iconpicker-input="#MyIconInput" or \ndata-iconpicker-input=".my-icon-input" \n\nVisit to learn how: ' + ipGithubUrl);
                            return false;
                        }
                        // check the input off

                        // check the preview icon on
                        const checkPreviewIcon = document.querySelectorAll(previewElement);
                        if (checkPreviewIcon.length <= 0) {
                            ipConsoleLog('You can define your Preview Icon element with it\'s ID or Class Name to your Button element data attribute. \n\nExample: \ndata-iconpicker-preview="i#MyIconElement" or \ndata-iconpicker-preview="i.my-icon-element" \n\nVisit to learn how: ' + ipGithubUrl);
                        }
                        // check the preview icon off

                        // check the callback on
                        if ( ! theCallback && typeof theCallback !== 'function') {
                            theCallback = undefined;
                        }
                        // check the callback off

                        if(jsonIconList) {
                            processIconListSetting(jsonIconList, showAllButton, cancelButton, searchPlaceholder, borderRadius, inputElement, previewElement, theCallback);
                        } else {
                            getIconListXmlHttpRequest(jsonUrl, showAllButton, cancelButton, searchPlaceholder, borderRadius, inputElement, previewElement, theCallback);
                        }

                    });
                    // IconPicker: Button Listeners -> Send XMLHttpRequest off

                }
            }
            // not exist
            else {
                ipConsoleError('You called the IconPicker with "' + theButton + '" selector, but there is no such element on the document.');
            }

        } else if (arguments && arguments.length > 2) {
            ipConsoleError('More parameters than allowed.');
            return false;
        } else {
            ipConsoleError('You have to call the IconPicker with an Element(Button or etc.) Class or ID. \n\nYou can also find the other required data attributes in the Documentation. \n\nVisit: ' + ipGithubUrl);
            return false;
        }
        // IconPicker: Check The Arguments For Proceed off
        // IconPicker: Get Library from JSON and AppendTo Body off
        // IconPicker: Process the already set iconlist & AppendTo Body on
    },
}
// IconPicker: Main off