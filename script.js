const productEl = document.getElementById('products')
const searchBtn = document.getElementsByClassName('searchBtn')
let data = []
let cart = {}

await fetch('data.json').then((response) => response.json()).then((json) => {
    data = json.data
})

function renderProducts(renderData) {
    productEl.innerHTML = ''
    for (let i = 0; i < renderData.length; i++) {
        productEl.innerHTML +=
            `<div class="col-6 col-sm-6 col-lg-4 col-xl-3">
            <div class="card" id="${renderData[i].id}">
                <img src="${renderData[i].url}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${renderData[i].title}</h5>
                    <p class="card-text">${renderData[i].type}</p>
                    <p class="price">&#8377; ${renderData[i].price.toLocaleString('en-IN')}</p>
                    <div class="rating"><i class="bi bi-star-fill"></i> ${renderData[i].rating} (${renderData[i].ratingCount})</div>
                    <a id="addBtn" class="btn btn-primary ${Object.keys(cart).includes(renderData[i].id.toString()) ? "d-none" : ''}"><i class="bi bi-cart-plus"></i> Add to Cart</a>
                    <a id="editBtn" href="cart.html" class="btn btn-primary ${Object.keys(cart).includes(renderData[i].id.toString()) ? "" : 'd-none'}"><i class="bi bi-pen"></i> Edit</a>
                    <a id="removeBtn" class="btn btn-primary ${Object.keys(cart).includes(renderData[i].id.toString()) ? "" : 'd-none'}"><i class="bi bi-cart-dash"></i> Remove</a>
                </div>
            </div>
        </div>`
    }

    const addBtn = document.querySelectorAll('#addBtn')
    for (let i = 0; i < addBtn.length; i++) {
        addBtn[i].addEventListener('click', () => {
            addToCart(addBtn[i])
        })
    }

    const removeBtn = document.querySelectorAll('#removeBtn')
    for(let i=0;i<removeBtn.length;i++){
        removeBtn[i].addEventListener('click',()=>{
            const id = removeBtn[i].parentElement.parentElement.getAttribute('id')
            delete cart[id]
            saveData(cart)
            renderProducts(data)
        })
    }


    cartCounter()
}

for (let i = 0; i < searchBtn.length; i++) {
    searchBtn[i].addEventListener('click', () => {
        const searchBox = searchBtn[i].parentElement.firstElementChild
        const value = searchBox.value.toLowerCase()
        searchBox.value = ''
        let newData = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].title.toLowerCase().includes(value)) {
                newData.push(data[i])
            }
        }
        renderProducts(newData)
    })
}

function addToCart(e) {
    const parent = e.parentElement.parentElement
    const removeBtn = parent.querySelector('#removeBtn')
    const editBtn = parent.querySelector('#editBtn')

    removeBtn.classList.remove('d-none')
    editBtn.classList.remove('d-none')
    e.classList.add('d-none')
    const id = Number.parseInt(parent.getAttribute('id'))
    // user.products.push(id)
    if (cart[id]) {
        cart[id] += 1
    } else {
        cart[id] = 1
    }
    cartCounter()
    saveData(cart)
    // console.log(parent.getAttribute('id'))
}

// cart button toggler
const navToggler = document.getElementById('navbar-toggler-button')
navToggler.addEventListener("click", () => {
    // console.log(navToggler.getAttribute('aria-expanded'))
    if (navToggler.getAttribute('aria-expanded') === 'true') {
        document.getElementById('cart-icon').classList.add('d-none')
    } else if (navToggler.getAttribute('aria-expanded') === 'false') {
        document.getElementById('cart-icon').classList.remove('d-none')
    }
})

function cartCounter() {
    const counterEle = document.getElementById('cart-counter')
    let count = 0
    for (let i = 0; i < Object.keys(cart).length; i++) {
        count += cart[Object.keys(cart)[i]]
    }
    if (count)
        counterEle.innerHTML = count
}

function saveData(data) {
    localStorage.setItem("cart", JSON.stringify(data))
}

function loadData() {
    return JSON.parse(localStorage.getItem("cart"))
}

function startup() {
    cart = loadData()
    renderProducts(data)
    cartCounter()
}

startup()