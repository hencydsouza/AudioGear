const productEl = document.getElementById('products')
const searchBtn = document.getElementsByClassName('searchBtn')
let data = []
let user = {
    products: []
}

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
                    <p class="price">&#8377; ${renderData[i].price}</p>
                    <div class="rating"><i class="bi bi-star-fill"></i> ${renderData[i].rating} (${renderData[i].ratingCount})</div>
                    <a id="addBtn" class="btn btn-primary"><i class="bi bi-cart-plus"></i> Add to Cart</a>
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
    console.log(user)
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
    const id = Number.parseInt(parent.getAttribute('id'))
    user.products.push(id)
    // console.log(parent.getAttribute('id'))
}

function test() {
    console.log('clicked')
}

// cart button toggler
const navToggler = document.getElementById('navbar-toggler-button')
navToggler.addEventListener("click", () => {
    // console.log(navToggler.getAttribute('aria-expanded'))
    if (navToggler.getAttribute('aria-expanded') === 'true') {
        document.getElementById('cart-icon').style.display = 'none'
    } else if (navToggler.getAttribute('aria-expanded') === 'false') {
        document.getElementById('cart-icon').style.display = 'block'
    }
})

function startup() {
    renderProducts(data)
}

startup()