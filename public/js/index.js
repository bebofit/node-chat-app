var socket = io();
socket.on('connect',function(){
    console.log('COnnnected to server');
    // socket.emit('createMessage',{
    //     to:'lol',
    //     text: 'hey',
    //     from: 'cabo'
    // }, function(){
    //     console.log('got it');
    // })
})
socket.on('disconnect', function(){
    console.log('disconnected from server');
})
socket.on('newMessage',function (msg) {
    console.log('new Message',msg);
    var li = jQuery('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);

    jQuery('#messages').append(li);
})

socket.on('newLocationMessage',function (msg) {
    console.log('new location Message',msg);
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${msg.from}: `);
    a.attr('href', msg.url)
    li.append(a);
    jQuery('#messages').append(li);
})

var messageTextBox = jQuery('[name=message]')
jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        to:'lol',
        text: messageTextBox.val(),
        from: 'User'
    }, function(){
        console.log('got it');
        messageTextBox.val('')
    })
})

var locationButton = jQuery('#sendlocation');
locationButton.on('click',function(){
    if(!navigator.geolocation)
    {
        return alert('Geolocation not supported by browser')
    }
    locationButton.attr('disabled', 'disabled').text('Sending location.....')
    navigator.geolocation.getCurrentPosition(function( pos){
        console.log(pos);
        locationButton.removeAttr('disabled').text('Send Location')
        socket.emit('createLocationMessage',{
            lat: pos.coords.latitude,
            long: pos.coords.longitude
        });
    }, function (){
        locationButton.removeAttr('disabled').text('Send Location')
        alert('Unable to fetch Location')
    })
})

