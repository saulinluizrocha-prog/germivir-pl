
$(document).ready(function() {
    AOS.init({
        offset: 60
    });

    $('.js-commits__box').owlCarousel({
        loop: true,
        margin: 45,
        responsive : {
            320 : {
                items: 1
            },

            768 : {
                items: 2
            },

            960 : {
                items: 3
            }
        }
    });

    Start();
    function Start() {
        var m = 22,
            s = 0;

        if (m <= 9) {
            m = "0" + m;
        };

        var timerId = setTimeout(function tick() {
            if (s != 0) {
                s = s - 1;

                if (s <= 9) {
                    s = "0" + s;
                }
            } else {
                if (m != 0) {
                    m = m - 1;
                    s = 59;

                    if (m <= 9) {
                        m = "0" + m;
                    }
                } else {
                    return
                }
            }

            $('.form__time-count:nth-of-type(2) span:first-child').text(m);
            $('.form__time-count:last-child span:first-child').text(s);
            timerId = setTimeout(tick, 1000);
        }, 1000);
    }

    setTimeout(function() {
        $('body').addClass('loaded');
    }, 600);

    $('.pain__pulse-media').hover(function() {
        clearInterval(itervalItem);
        $('.pain__item').children('.pain__pulse').children('.pain__pulse-line').removeClass('pain__pulse-line_active');
        $('.pain__item').children('.pain__head').css('opacity', '0');
        $(this).parent().children('.pain__pulse-line').addClass('pain__pulse-line_active');
        $(this).parents('.pain__item').children('.pain__head').css('opacity', '1');
    }, function() {
        startItem();
        $('.pain__item').children('.pain__pulse').children('.pain__pulse-line').removeClass('pain__pulse-line_active');
        $('.pain__item').children('.pain__head').css('opacity', '0');
    })

    var itervalItem;
    startItem();
    function startItem() {
        itervalItem = setInterval(function() {
            var $index = randomInteger(1, 6);
            $('.pain__item').children('.pain__pulse').children('.pain__pulse-line').removeClass('pain__pulse-line_active');
            $('.pain__item').children('.pain__head').css('opacity', '0');
            $('.pain__item').eq($index).children('.pain__pulse').children('.pain__pulse-line').addClass('pain__pulse-line_active');
            $('.pain__item').eq($index).children('.pain__head').css('opacity', '1');
        }, 3000);

        function randomInteger(min, max) {
            var rand = min - 0.5 + Math.random() * (max - min + 1);
            return Math.round(rand);
        }
    }

    countAnimate();
    $(window).resize(function () {
        countAnimate ();
    });
    function countAnimate () {
        var $height = 120; /* на какой высоте будет срабатывать анимация*/
            $hWindow = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
            $csrollTop = $(window).scrollTop() + $hWindow - $height,
            $offsetTop = $('.count__body').offset().top;

        if($csrollTop >= $offsetTop) {
            $('.count__body').addClass('count__body_active');
        } else {
            $('.count__body').removeClass('count__body_active');
        };

        $(window).scroll(function () {
            $csrollTop = $(this).scrollTop() + $hWindow - $height;
            if($csrollTop >= $offsetTop) {
                $('.count__body').addClass('count__body_active');
            } else {
                $('.count__body').removeClass('count__body_active');
            }
        });
    }
});
$('.js-link').on('click', function(e){
	e.preventDefault()
	var id = $(this).attr('href')
	$('html, body').animate({
		scrollTop: $(id).offset().top
	},600)
})
 