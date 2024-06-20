
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

changeQuantity = (cartId, proId, count) => {

    $.ajax({
        url: '/change-quantity',
        data: {
            cart: cartId,
            product: proId,
            count: count
        },
        method: 'post',
        success: (response) => {
            console.log(response.product[0].quantity)
            let quantity = response.product[0].quantity
            console.log(quantity)

            $(`#proQuantity-${proId}`).html(parseInt(quantity))

        }
    })

}