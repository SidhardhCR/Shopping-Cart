
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

changeQuantity = (cartId, proId, count, userId) => {

    $.ajax({
        url: '/change-quantity',
        data: {
            cart: cartId,
            product: proId,
            count: count,
            quantity: $(`#${proId}`).html(),
            user: userId
        },
        method: 'post',
        success: (response) => {
            console.log(response)
            if (response.remove) {
                location.reload()

            } else {
                let newQuantity = parseInt($(`#${proId}`).html()) + count
                $(`#${proId}`).html(newQuantity)
                $('#total-value').html(response.total)
            }


        }
    })

}