
addToCart = (proId) => {
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            console.log(response)
            if (response.status) {
                let count = $('#proCount').html()
                count = parseInt(count) + 1
                $('#proCount').html(count)
            }
        }
    })
}