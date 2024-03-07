const totalEle = document.getElementsByClassName('price')[0]
// console.log(totalEle.textContent)

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

let data = []
let cart = {}
let inventory = {}
let total = 0
let total_discount = 0

await fetch('data.json').then((response) => response.json()).then((json) => {
    data = json.data
})

// console.log(data)
const cartContainer = document.getElementById('cart-container-inner')
function renderCartItems(cartArr) {
    cartContainer.innerHTML = ''
    for (let i = 0; i < cartArr.length; i++) {
        // console.log(Object.keys(cart))
        if (Object.keys(cart).includes(cartArr[i].id.toString())) {
            let key = cartArr[i].id
            if (cart[key] > 0) {
                let discount = cartArr[i].discount || 0
                let discountedPrice = discount ? cartArr[i].price - Math.ceil((cartArr[i].price * discount) / 100) : 0
                // console.log(discount,discountedPrice)
                total_discount += discountedPrice ? discountedPrice * cart[key] : cartArr[i].price * cart[key];
                // console.log(total_discount)
                cartContainer.innerHTML +=
                    `<div class="card my-4">
                        <div class="row g-0">
                            <div class="col-md-4 p-2">
                                <img src="${cartArr[i].url}" class="img-fluid rounded-start w-25 mt-2"
                                    alt="...">
                            </div>
                            <div class="col-md-8 px-2 px-md-0 d-flex">
                                <div class="card-body d-flex justify-content-between">
                                    <div class="mt-auto mb-auto">
                                        <h5 class="card-title text-start">${cartArr[i].title}</h5>
                                        <p class="card-text text-start"><small class="text-body-secondary">${cartArr[i].type}</small>
                                        </p>
                                        <p class="m-0 price text-start">
                                        ${discount ?
                        `<span id="discount">` + discount + "% off </span> <s>&#8377; " + cartArr[i].price + `</s> &#8377; ` + discountedPrice.toLocaleString('en-IN')
                        : "&#8377;" + cartArr[i].price.toLocaleString('en-IN')
                    }

                                    </div>

                                    <div class="pe-lg-3 mt-auto mb-auto">
                                        <div class="btn-group" id=${cartArr[i].id}>
                                            <button id="decrementBtn" class="btn btn-primary px-1 py-1 p-md-2 ${cart[cartArr[i].id] == 1 ? 'red-bg' : ''}"><i
                                                    class="bi bi-dash-lg"></i></button>
                                            <div href="#" class="btn btn-outline-primary px-2 px-md-2 py-md-2 py-1">
                                                &nbsp;${cart[cartArr[i].id]}&nbsp;</div>
                                            <button id="incrementBtn" class="btn btn-primary px-1 py-1 p-md-2"><i
                                                    class="bi bi-plus-lg"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                total += cartArr[i].price * cart[key]

            }
        }

    }

    // if (total_discount)
    //     total_discount = total - total_discount
    // console.log(total_discount)

    if (!total) {
        document.getElementsByClassName('total')[0].classList.add('d-none')
        document.getElementsByClassName('empty-msg')[0].classList.remove('d-none')
    }


    if ((total_discount == total) || total_discount == 0)
        totalEle.innerHTML = `&#8377; ${total.toLocaleString('en-IN')}`
    else
        totalEle.innerHTML = `<span class="d-flex"><s style="color: rgb(68,68,68);" class="me-2">&#8377; ${total.toLocaleString('en-IN')}</s><span style="color: green;"> &#8377; ${total_discount.toLocaleString('en-IN')}</span></span>`
    // console.log(totalEle)

    const decrementBtn = document.querySelectorAll('#decrementBtn')
    const incrementBtn = document.querySelectorAll('#incrementBtn')
    for (let i = 0; i < decrementBtn.length; i++) {
        const id = decrementBtn[i].parentElement.getAttribute('id')
        decrementBtn[i].addEventListener('click', () => {
            decrementItem(id, decrementBtn[i])
            cartCounter()
        })
        incrementBtn[i].addEventListener('click', () => {
            incrementItem(id, incrementBtn[i])
            // cartCounter()
        })
    }
}

function incrementItem(id, ele) {
    if (inventory[id] != 0) {
        const displayEle = ele.parentElement.children[1]
        ele.parentElement.children[0].classList.remove('red-bg')
        // console.log(displayEle)
        cart[id] += 1
        // console.log(data[id-1].price)

        total += data[id - 1].price
        inventor [id] -= 1

        displayEle.innerHTML = `&nbsp;${cart[id]}&nbsp;`
        saveData(cart)
        location.reload()
    } else {
        document.getElementById('alert').classList.remove('d-none')
    }
}

function decrementItem(id, ele) {
    const displayEle = ele.parentElement.children[1]
    // console.log(ele.parentElement.children[0])
    if (cart[id] >= 2) {
        cart[id] -= 1
        inventory[id] += 1

        total -= data[id - 1].price
        if (cart[id] == 1)
            ele.parentElement.children[0].classList.add('red-bg')
    } else if (cart[id] == 1) {
        delete cart[id]
        inventory[id] += 1
        saveData(cart)
        // cartCounter()
        startup()
        // renderCartItems(data)
        location.reload()
    }
    displayEle.innerHTML = `&nbsp;${cart[id]}&nbsp;`
    saveData(cart)
    location.reload()
}

function cartCounter() {
    const counterEle = document.getElementById('cart-counter')
    let count = 0
    total_discount = 0
    for (let i = 0; i < Object.keys(cart).length; i++) {
        count += cart[Object.keys(cart)[i]]
    }
    // console.log(count)
    count ? counterEle.innerHTML = count : counterEle.innerHTML = ''

    totalEle.innerHTML = `&#8377; ${total.toLocaleString('en-IN')}`
    // console.log(totalEle)
    // console.log(document.getElementsByClassName('price')[0])
    // console.log(totalEle)
}

function loadInventory() {
    inventory = loadData("inventory")
    // for(let i=0;i<data.length;i++){
    //     if(!inventory.hasOwnProperty(data[i].id))
    //         inventory[data[i].id] = data[i].inventory
    // }
    console.log(inventory)
}

function saveData(data) {
    localStorage.setItem("cart", JSON.stringify(data))
    localStorage.setItem("inventory", JSON.stringify(inventory))
}

function loadData(name) {
    let data = JSON.parse(localStorage.getItem(name))
    return data ? data : {}
}

function startup() {
    cart = loadData("cart")
    loadInventory()
    cartCounter()
    renderCartItems(data)
}

startup()