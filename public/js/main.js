$(() => {
    $('#add_device').on('click', () => {
        location.href = '/devices/add';
    });

    $('.configure').on('click', (target) => {
        location.href = '/devices/' + target.currentTarget.id + '/configure/';
    });

    $('.delete').on('click', (target) => {
        location.href = '/devices/' + target.currentTarget.id + '/delete/';
    });
});