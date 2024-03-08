const navToggler = document.getElementById('navbar-toggler-button')
navToggler.addEventListener("click", () => {
    if (navToggler.getAttribute('aria-expanded') === 'true') {
        document.getElementById('cart-icon').classList.add('d-none')
        document.getElementById('cart-icon-2').classList.add('d-none')
    } else if (navToggler.getAttribute('aria-expanded') === 'false') {
        document.getElementById('cart-icon').classList.remove('d-none')
        document.getElementById('cart-icon-2').classList.remove('d-none')
    }
})

let cart = {}
let data = []
let user_details = {}

let total = 0
let total_discount = 0

await fetch('data.json').then((response) => response.json()).then((json) => {
    data = json.data
    user_details = json.user[localStorage.getItem("user-key")]
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
                        `<span><span> &#8377; ${(discountedPrice * cart[key]).toLocaleString('en-IN')}</span></span>`
                        : `<span>&#8377; ${(data[i].price * cart[key]).toLocaleString('en-IN')}</span>`}
                    
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
        document.getElementById('total').innerHTML = `<span class="d-flex flex-column"><span> &#8377; ${total_discount.toLocaleString('en-IN')}</span></span>`
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

function loadData(name) {
    let data = JSON.parse(localStorage.getItem(name))
    return data ? data : {}
}

function check_login() {
    if (loadData("logged-in") === true) {
        return true
    } else {
        return false
    }
}

function loadUSerData(){
    document.getElementById('firstName').value = user_details.first
    document.getElementById('lastName').value = user_details.last
    document.getElementById('email').value = user_details.email
    document.getElementById('phoneNo').value = user_details.phno
    document.getElementById('inputAddress').value = user_details.address
    document.getElementById('inputAddress').value = user_details.address
    document.getElementById('city').value = user_details.city
    document.getElementById('state').value = user_details.state
    document.getElementById('zip').value = user_details.zip
}


function startup() {
    cart = loadData("cart")
    renderSummary()
    cartCounter()
    loadUSerData()

    if (!check_login()) {
        // alert("Please Login to Proceed!")
        window.location = "index.html"
    }

    if(total == 0 || total_discount == 0){
        window.location = "index.html"
    }
}
startup()