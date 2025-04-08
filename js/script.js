$(document).ready(function(){
    $('nav a').on('click', function() {
        //Current class assignment
        $('nav li.current').removeClass('current');
        $(this).parent().addClass('current');

        //Set heading text
        $('h1#heading').text($(this).text());

        //Get & filter link text
        var category = $(this).text().toLowerCase().replace(' ', '-');

        //Remove hidden class if 'referenciánink' is selected
        if(category == 'referenciáink') {
            $('ul#gallery li:hidden').fadeIn('slow').removeClass('hidden');
        } else {
            $('ul#gallery li').each(function() {
                if(!$(this).hasClass(category)) {
                    $(this).hide().addClass('hidden');
                } else {
                    $(this).fadeIn('slow').removeClass('hidden');
                }
          });
        }
        //Stop link behaviour
        return false;
    });
});