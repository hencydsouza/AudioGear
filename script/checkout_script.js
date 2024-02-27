const navToggler = document.getElementById('navbar-toggler-button')
navToggler.addEventListener("click", () => {
    if (navToggler.getAttribute('aria-expanded') === 'true') {
        document.getElementById('cart-icon').classList.add('d-none')
    } else if (navToggler.getAttribute('aria-expanded') === 'false') {
        document.getElementById('cart-icon').classList.remove('d-none')
    }
})

let cart = {}
let data = []

let total = 0

await fetch('data.json').then((response) => response.json()).then((json) => {
    data = json.data
})

const orderSummary = document.getElementById('order-summary')

function renderSummary() {
    orderSummary.innerHTML = ''
    for (let i = 0; i < data.length; i++) {
        if (Object.keys(cart).includes(data[i].id.toString())) {
            let key = data[i].id

            if (cart[key] > 0) {
                // console.log(key)
                orderSummary.innerHTML += `<li class="list-group-item d-flex justify-content-between"><span><span>${cart[key]} x</span> ${data[i].title}</span><span>&#8377; ${data[i].price.toLocaleString('en-IN')}</span></li>`

                total += data[i].price * cart[key]
            }
        }
    }
    // console.log(total)
    document.getElementById('total').innerHTML = `&#8377; ${total.toLocaleString('en-IN')}`
}

function cartCounter() {
    const counterEle = document.getElementById('cart-counter')
    let count = 0
    for (let i = 0; i < Object.keys(cart).length; i++) {
        count += cart[Object.keys(cart)[i]]
    }
    // console.log(count)
    if (count)
        counterEle.innerHTML = count

    totalEle.innerHTML = `&#8377; ${total.toLocaleString('en-IN')}`
    // console.log(totalEle)
}

function loadData() {
    return JSON.parse(localStorage.getItem("cart"))
}

function startup() {
    cart = loadData()
    renderSummary()
    cartCounter()
}
startup()