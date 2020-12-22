$(() => {
    $('#add_device').on('click', () => {
        location.href = '/devices/add';
    });

    $('#discover_device').on('click', () => {
        location.href = '/devices/discovery';
    });

    $('.configure').on('click', (target) => {
        location.href = '/devices/' + target.currentTarget.id + '/configure/';
    });

    $('.delete').on('click', (target) => {
        location.href = '/devices/' + target.currentTarget.id + '/delete/';
    });
});