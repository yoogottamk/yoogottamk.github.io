/*
 * This script helps me to correctly position the description
 * I show for each item on the navbar. bootstrap doesn't handle
 * this by default :(
 */

const activeDescSelector = ".nav-link:hover + .nav-desc",
    navbarHeight = 60; // px

function isCollapsed() {
    return $(window).width() < 992;
}

function willCross(elemLeftPos, elemWidth, screenWidth) {
    return elemLeftPos + elemWidth > screenWidth;
}

function init() {
    if(isCollapsed())
        return;

    $(".nav-link").hover(function() {
        let $activeDesc = $(activeDescSelector);

        // check if it's valid
        if(!$activeDesc.length)
            return;

        let elemPos = $activeDesc.offset(),
            elemWidth = $activeDesc.innerWidth(),
            screenWidth = $(window).width();

        if(willCross(elemPos.left, elemWidth, screenWidth)) {
            $activeDesc.css({ "transform": `translate(
                -${elemPos.left + elemWidth - screenWidth}px,
                -${elemPos.top - navbarHeight}px
            )`});
        }
    });
}

document.addEventListener("DOMContentLoaded", init);
