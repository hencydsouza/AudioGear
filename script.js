const productEl = document.getElementById('products')
const searchBtn = document.getElementsByClassName('searchBtn')
const searchFiled = document.getElementsByClassName('searchField')
let data = []
let currentData = []
let cart = {}
let inventory = {}
let user = {}

await fetch('data.json').then((response) => response.json()).then((json) => {
    data = json.data
})

// <p class="price">&#8377; ${renderData[i].price.toLocaleString('en-IN')}</p>
function renderProducts(renderData) {
    productEl.innerHTML = ''
    for (let i = 0; i < renderData.length; i++) {
        let discount = renderData[i].discount || 0
        let discountedPrice = discount ? renderData[i].price - Math.ceil((renderData[i].price * discount) / 100) : 0
        productEl.innerHTML +=
            `<div class="col-6 col-sm-6 col-lg-4 col-xl-3 info-card">
            <div class="card position-relative shadow-sm" id="${renderData[i].id}">
                <div class="badge position-absolute card-badge" style="background-color: red; font-size: 0.75rem; top: 0.5rem; margin: 0;">${inventory[renderData[i].id] <= 3 ? inventory[renderData[i].id] == 0 ? "Out of Stock" : "Only " + inventory[renderData[i].id] + " Available" : ""}</div>
                <img src="${renderData[i].url}" class="card-img-top info-trigger" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${renderData[i].title}</h5>
                    <p class="card-text">${renderData[i].type}</p>
                    <p class="price">
                    ${discount ?
                `<span id="discount">` + discount + "% off </span> <s>&#8377; " + renderData[i].price + `</s> &#8377; ` + discountedPrice.toLocaleString('en-IN')
                : "&#8377;" + renderData[i].price.toLocaleString('en-IN')
            }
                    </p >
                    <div class="rating"><i class="bi bi-star-fill"></i> ${renderData[i].rating} (${renderData[i].ratingCount})</div>
                    <a id="addBtn" class="btn btn-primary ${Object.keys(cart).includes(renderData[i].id.toString()) ? "d-none" : ''} ${inventory[renderData[i].id] == 0 ? 'disabled' : ''}" > <i class="bi bi-cart-plus"></i> Add to Cart</a >
        <a id="editBtn" href="cart.html" class="btn btn-primary ${Object.keys(cart).includes(renderData[i].id.toString()) ? "" : 'd-none'}" > <i class="bi bi-eye"></i> View Cart</a >
            <a id="removeBtn" class="btn btn-primary ${Object.keys(cart).includes(renderData[i].id.toString()) ? "" : 'd-none'}" > <i class="bi bi-cart-dash"></i> Remove</a >
                </div >
            </div >
        </div > `
        // console.log(renderData[i].price, discount, discountedPrice)
    }

    const addBtn = document.querySelectorAll('#addBtn')
    for (let i = 0; i < addBtn.length; i++) {
        addBtn[i].addEventListener('click', () => {
            addToCart(addBtn[i])
        })
    }

    const removeBtn = document.querySelectorAll('#removeBtn')
    for (let i = 0; i < removeBtn.length; i++) {
        removeBtn[i].addEventListener('click', () => {
            const id = removeBtn[i].parentElement.parentElement.getAttribute('id')
            inventory[id] += cart[id]
            delete cart[id]
            saveData(cart)
            renderProducts(currentData)
            cartCounter()
        })
    }
    // console.log(inventory)

    const infoTrigger = document.getElementsByClassName('info-trigger')
    for (let i = 0; i < infoTrigger.length; i++) {
        infoTrigger[i].addEventListener('click', () => {
            const id = infoTrigger[i].parentElement.id
            localStorage.setItem('info', id)
            location.href = "info.html"
        })
    }

    cartCounter()
}

for (let i = 0; i < searchBtn.length; i++) {
    searchBtn[i].addEventListener('click', () => {
        search(searchBtn[i].previousElementSibling)
    })
}

for (let i = 0; i < searchFiled.length; i++) {
    searchFiled[i].addEventListener('keydown', (e) => {
        if (e.key == 'Enter')
            search(searchFiled[i])
    })
}

function search(e) {
    currentData = []
    const searchBox = e
    const value = searchBox.value.toLowerCase().trim()
    if (searchBox.value) {
        // searchBox.value = ''

        for (let i = 0; i < data.length; i++) {
            if (data[i].title.toLowerCase().includes(value)) {
                currentData.push(data[i])
            }
        }

        if (currentData.length == 0) {
            document.getElementById('products-section').classList.add('d-none')
            document.getElementById('zero-search').classList.remove('d-none')
        } else {
            document.getElementById('products-section').classList.remove('d-none')
            document.getElementById('zero-search').classList.add('d-none')
        }

        document.getElementById('products-section').classList.add('mt-3')
        document.getElementById('products-section').classList.add('mt-lg-0')
        document.getElementById('carouselExampleAutoplaying').classList.add('d-none')
        document.getElementById('search-result-counter').classList.remove('d-none')
        document.getElementById('search-result-counter').children[0].innerHTML = `Showing ${currentData.length} results for "${value}"`
        renderProducts(currentData)
    } else {
        // alert('Search box empty!')
        location.reload()
    }
}

function addToCart(e) {
    if (check_login()) {
        const parent = e.parentElement.parentElement
        const removeBtn = parent.querySelector('#removeBtn')
        const editBtn = parent.querySelector('#editBtn')
        const id = Number.parseInt(parent.getAttribute('id'))

        if (inventory[id] != 0) {
            removeBtn.classList.remove('d-none')
            editBtn.classList.remove('d-none')
            e.classList.add('d-none')
            // user.products.push(id)
            if (cart[id]) {
                cart[id] += 1
            } else {
                cart[id] = 1
            }
            inventory[id] -= 1
            cartCounter()
            renderProducts(currentData)
            saveData(cart)
            // console.log(parent.getAttribute('id'))
        }
    } else {
        alert('You are not logged in!')
        window.location = "login.html"
    }
}

// cart button toggler
const navToggler = document.getElementById('navbar-toggler-button')
navToggler.addEventListener("click", () => {
    // console.log(navToggler.getAttribute('aria-expanded'))
    if (navToggler.getAttribute('aria-expanded') === 'true') {
        document.getElementById('cart-icon').classList.add('d-none')
        document.getElementById('cart-icon-2').classList.add('d-none')
        document.getElementById('cart-icon-3').classList.add('d-none')
    } else if (navToggler.getAttribute('aria-expanded') === 'false') {
        document.getElementById('cart-icon').classList.remove('d-none')
        document.getElementById('cart-icon-2').classList.remove('d-none')
        document.getElementById('cart-icon-3').classList.remove('d-none')
    }
})

const filterEl = document.getElementById('filter-container')
for (let i = 0; i < filterEl.children.length; i++) {
    filterEl.children[i].addEventListener("click", () => {
        const filterRate = i + 1
        let filterArr = []
        for (let j = 0; j < currentData.length; j++) {
            if (Number(currentData[j].rating) >= filterRate) {
                filterArr.push(currentData[j])
            }
        }
        filterArr.sort((a, b) => {
            const ratingA = parseFloat(a.rating);
            const ratingB = parseFloat(b.rating);
            return ratingB - ratingA;
        });

        // currentData = filterArr
        renderProducts(filterArr)
    })
}

document.getElementById('cart-redirect').addEventListener("click", () => {
    if (check_login()) {
        window.location = "cart.html"
    } else {
        alert('You are not logged in!')
        window.location = "login.html"
    }
})

function cartCounter() {
    const counterEle = document.getElementById('cart-counter')
    let count = 0
    for (let i = 0; i < Object.keys(cart).length; i++) {
        count += cart[Object.keys(cart)[i]]
    }

    count ? counterEle.innerHTML = count : counterEle.innerHTML = ''
}

function loadInventory() {
    inventory = loadData("inventory")
    for (let i = 0; i < data.length; i++) {
        if (!inventory.hasOwnProperty(data[i].id))
            inventory[data[i].id] = data[i].inventory
    }
}

function saveData(data) {
    localStorage.setItem("cart", JSON.stringify(data))
    localStorage.setItem("inventory", JSON.stringify(inventory))
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

function startup() {
    cart = loadData("cart")
    currentData = data
    loadInventory()
    renderProducts(data)
    cartCounter()

    if(!check_login()){
        document.getElementById('hidden-option-3').classList.add("d-none")
        document.getElementById('login-feature-icon').classList.remove("d-lg-block")
        document.getElementById('login-icon').classList.add("d-lg-block")
    } else {
        document.getElementById('hidden-option-4').classList.add("d-none")
    }
}

startup()