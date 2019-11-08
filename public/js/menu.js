$(function(){
	$(window).scroll(function(){
    cur = $('html, body').scrollTop();
    if (cur > 200 ){
      $('.thanhmenu').addClass('sticky')
    } else $('.thanhmenu').removeClass('sticky');
   })
});