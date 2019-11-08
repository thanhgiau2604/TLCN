$('#chat-box').hide()

$('#chat').click(function() {
  $(this).fadeOut(500)
  $('#chat-box').fadeIn(500)
})

$('.fa.fa-close').click(function() {
  $('#chat-box').fadeOut(500)
  $('#chat').fadeIn(500)
})

$('form').submit(function(event) {
  event.preventDefault()
  var msg = $('#message').val()
  $('#message').val('')
  $('#messages').append($('<li>').html(msg))
  $('#chat-messages').animate({
    scrollTop: $('#chat-messages').get(0).scrollHeight
  }, 250)
})