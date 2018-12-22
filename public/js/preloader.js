$(function () { // this replaces document.ready
    $(window).on("load", function () {
        $('.preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });
});
