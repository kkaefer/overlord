$(function() {
    $('.meta .show a').click(function() {
        $(this).closest('.test-success, .test-failure').toggleClass('collapsed');
    }).click();
});
