const socket = io(window.location.origin + ':80');

$('#submit').on('click', () => {
    console.log($('#mqtt_topic').val());
    socket.emit('confirm_device_pairing', $('#mqtt_topic').val());
});