$(() => {
    $('#add_device').on('click', () => {
        location.href = '/devices/add';
    });

    $('.configure').on('click', ()=> {
        location.href = '/devices/' + $('.configure').attr('id');
    });
});