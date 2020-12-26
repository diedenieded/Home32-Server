const socket = io(window.location.origin + ':80');

$('#currentBrightness').html($('#ledBrightness').val());

$('#ledBrightness').on('input', () => {
    $('#currentBrightness').html($('#ledBrightness').val());
    socket.emit('setLedBrightness', {
        mqttTopic: mqttTopic,
        brightness: $('#ledBrightness').val()
    });
});

$(() => {
    $('#configure').on('click', () => {
        window.location.href += '/configure';
    });
});


console.log('id');