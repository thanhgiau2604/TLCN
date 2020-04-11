$(function(){
	$(window).scroll(function(){
    cur = $('html, body').scrollTop();
    if (cur > 200 ){
      $('.thanhmenu').addClass('sticky')
    } else $('.thanhmenu').removeClass('sticky');
   });
  //  console.log("có chạy")
  //  $(".urTextComment").each(function () {
  //   this.style.height = (this.scrollHeight+10)+'px';
});
