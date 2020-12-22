const socket = io(window.location.origin + ':80');
$('#discovered').hide();

$('#rediscover').on('click', () => {
    socket.emit('startDiscovery');
    $('#discovered').hide();
    $('#discovering').show();
    $('.list').empty();
});

socket.emit('startDiscovery');

socket.on('message', (msg) => {
    console.log(msg);
});

$(document).on('click', '.autoadd', (target) => {
    location.href = '/devices/add?deviceid=' + target.currentTarget.id + '&devicetype=' + target.currentTarget.dataset.devicetype.replace(' ', '+');
});

socket.on('discovered', (data) => {
    $('#discovering').hide();
    $('#discovered').show();
    for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        $('.list').append(
            `
            <li>
                <div class='row'>
                    <div class='col'>
                        ${data[i].device_type}
                    </div>
                    <div class='col right'>
                        <button class='autoadd outline' id='${data[i].device_id}' data-devicetype='${data[i].device_type}'>Add this device</button>
                    </div>             
                </div>
            </li>
            <hr>
            `
        );
    }
});