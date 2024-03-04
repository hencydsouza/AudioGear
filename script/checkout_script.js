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
let total_discount = 0

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
                let discount = data[i].discount || 0
                let discountedPrice = discount ? data[i].price - Math.ceil((data[i].price * discount) / 100) : 0
                total_discount += discountedPrice ? discountedPrice * cart[key] : data[i].price * cart[key];
                // console.log(key)
                // orderSummary.innerHTML += `<li class="list-group-item d-flex justify-content-between"><span><span>${cart[key]} x</span> ${data[i].title}</span><span>&#8377; ${data[i].price.toLocaleString('en-IN')}</span> <span>&#8377; ${data[i].price*cart[key]}</span></li>`
                orderSummary.innerHTML += `<li class="list-group-item d-flex justify-content-between"><span><span>${cart[key]} x</span> ${data[i].title}</span> 
                    ${discountedPrice ?
                        `<span><s style="color: rgb(68,68,68);"><span>&#8377; ${data[i].price * cart[key]}</span></s><span style="color: green;"> &#8377; ${discountedPrice * cart[key]}</span></span>`
                        : `<span>&#8377; ${data[i].price * cart[key]}</span>`}
                    
                </li>`

                total += data[i].price * cart[key]
            }
        }
    }
    // console.log(total)
    // if (total_discount)
    //     total_discount = total - total_discount
    // console.log(total_discount)
    if (!total_discount)
        document.getElementById('total').innerHTML = `&#8377; ${total.toLocaleString('en-IN')}`
    else
        document.getElementById('total').innerHTML = `<span class="d-flex flex-column"><s>&#8377; ${total.toLocaleString('en-IN')}</s> <span style="color: green;"> &#8377; ${total_discount.toLocaleString('en-IN')}</span></span>`
}

function cartCounter() {
    const counterEle = document.getElementById('cart-counter')
    let count = 0
    for (let i = 0; i < Object.keys(cart).length; i++) {
        count += cart[Object.keys(cart)[i]]
    }
    // console.log(count)
    count ? counterEle.innerHTML = count : counterEle.innerHTML = ''
}

function loadData() {
    let data = JSON.parse(localStorage.getItem("cart"))
    return data ? data : {}
}

function startup() {
    cart = loadData()
    renderSummary()
    cartCounter()
}
startup()