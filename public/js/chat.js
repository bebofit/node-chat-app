var socket = io();

function ScrollToBottom() {
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect',function(){
    console.log('COnnnected to server');
    var params = jQuery.deparam(window.location.search);
    socket.emit('join',params, function(err){
        if(err)
        {
            alert(err)
            window.location.href = '/';
        }
        else
        {
            console.log('No error');
        }
    })
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
socket.on('updateUserList', function(users){
    console.log('Users List', users);
    var ol = jQuery('<ol></ol>')
    users.forEach(function(user){
        ol.append(jQuery('<li> </li>').text(user))
    });
    jQuery('#users').html(ol)
})
socket.on('newMessage',function (msg) {
    var template = jQuery('#message-template').html();
    var formatedTime = moment(msg.createdAt).format('h:mm a');
    var html = Mustache.render(template,{
        text: msg.text,
        from: msg.from,
        createdAt: formatedTime
    });

    jQuery('#messages').append(html);
    ScrollToBottom();
})

socket.on('newLocationMessage',function (msg) {
    var template = jQuery('#location-message-template').html();
    var formatedTime = moment(msg.createdAt).format('h:mm a');
    var html = Mustache.render(template,{
        url: msg.url,
        from: msg.from,
        createdAt: formatedTime
    });

    jQuery('#messages').append(html);
    ScrollToBottom();
})

var messageTextBox = jQuery('[name=message]')
jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        text: messageTextBox.val()
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

