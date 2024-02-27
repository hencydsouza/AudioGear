const totalEle = document.getElementsByClassName('price')[0]
// console.log(totalEle.textContent)

const navToggler = document.getElementById('navbar-toggler-button')
navToggler.addEventListener("click", () => {
    if (navToggler.getAttribute('aria-expanded') === 'true') {
        document.getElementById('cart-icon').classList.add('d-none')
    } else if (navToggler.getAttribute('aria-expanded') === 'false') {
        document.getElementById('cart-icon').classList.remove('d-none')
    }
})

let data = []
let cart = {}
let total = 0

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
                            <p class="m-0 price text-start"> &#8377; ${cartArr[i].price.toLocaleString('en-IN')}</p>

                        </div>

                        <div class="pe-lg-3 mt-auto mb-auto">
                            <div class="btn-group" id=${cartArr[i].id}>
                                <button id="decrementBtn" class="btn btn-primary px-1 py-1 p-md-2 ${cart[cartArr[i].id]==1? 'red-bg': ''}"><i
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

    // console.log(total)
    if (!total) {
        document.getElementsByClassName('total')[0].classList.add('d-none')
        document.getElementsByClassName('empty-msg')[0].classList.remove('d-none')
    }

    totalEle.innerHTML = `&#8377; ${total.toLocaleString('en-IN')}`
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
            cartCounter()
        })
    }
}

function incrementItem(id, ele) {
    const displayEle = ele.parentElement.children[1]
    ele.parentElement.children[0].classList.remove('red-bg')
    // console.log(displayEle)
    cart[id] += 1
    // console.log(data[id-1].price)
    total+=data[id-1].price

    displayEle.innerHTML = `&nbsp;${cart[id]}&nbsp;`
    saveData(cart)
}

function decrementItem(id, ele) {
    const displayEle = ele.parentElement.children[1]
    // console.log(ele.parentElement.children[0])
    if (cart[id] >= 2) {
        cart[id] -= 1

        total -= data[id-1].price
        if(cart[id]==1)
            ele.parentElement.children[0].classList.add('red-bg')
    } else if (cart[id] == 1) {
        delete cart[id]
        saveData(cart)
        // cartCounter()
        startup()
        // renderCartItems(data)
        location.reload()
    }
    displayEle.innerHTML = `&nbsp;${cart[id]}&nbsp;`
    saveData(cart)
}

function cartCounter() {
    const counterEle = document.getElementById('cart-counter')
    let count = 0
    for (let i = 0; i < Object.keys(cart).length; i++) {
        count += cart[Object.keys(cart)[i]]
    }
    // console.log(count)
    count ? counterEle.innerHTML = count : counterEle.innerHTML = ''

    totalEle.innerHTML = `&#8377; ${total.toLocaleString('en-IN')}`
    // console.log(document.getElementsByClassName('price')[0])
    // console.log(totalEle)
}

function saveData(data) {
    localStorage.setItem("cart", JSON.stringify(data))
}

function loadData() {
    let data = JSON.parse(localStorage.getItem("cart"))
    return data ? data : {}
}

function startup() {
    cart = loadData()
    cartCounter()
    renderCartItems(data)
}

startup()