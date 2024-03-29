const mainEl = document.getElementById('main')

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

let data = {}
let cart = {}
let inventory = {}
let id

function display() {
    let discount = data.discount || 0
    let discountedPrice = discount ? data.price - Math.ceil((data.price * discount) / 100) : 0
    mainEl.innerHTML = `
    <div class="card mb-3 text-start" id="info" style="font-family: Sora;">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${data.url}" class="img-fluid rounded-start my-3" alt="...">
            </div>
            <div class="col-md-8">
            <div class="card-body">
                <h6 class="brand">${data.title.split('-')[0]}</h6>
                <h5 class="card-title">${data.title}</h5>
                <p class="card-text">${data.type}</p>
                <p class="card-text my-2" style="text-align: justify;">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet mauris sed erat sodales rhoncus et ac massa. Mauris blandit pellentesque elementum. Integer feugiat lectus non risus viverra, a pulvinar nulla eleifend. Vestibulum diam sapien, mattis quis mattis id, mattis quis turpis. Duis dictum ante quam, nec pretium sem elementum sit amet. In aliquet et ante in egestas.
                </p>
                ${discount ?
            `<span id="discountedPrice">&#8377; ` + discountedPrice.toLocaleString('en-IN') + "</span> <s>&#8377; " + data.price + `</s> ` + `<span id="discount">` + discount + "% off</span>"
            : "&#8377;" + data.price.toLocaleString('en-IN')
        }
                <div class="rating"><i class="bi bi-star-fill"></i> ${data.rating} (${data.ratingCount})</div>
                <a id="addBtn" class="btn btn-primary ${Object.keys(cart).includes(data.id.toString()) ? "d-none" : ''} ${inventory[data.id] == 0 ? 'disabled' : ''}"><i class="bi bi-cart-plus"></i> Add to Cart</a>
                <a id="editBtn" href="cart.html" class="btn btn-primary ${Object.keys(cart).includes(data.id.toString()) ? "" : 'd-none'}"><i class="bi bi-eye"></i> View Cart</a>
                <a id="removeBtn" class="btn btn-primary ${Object.keys(cart).includes(data.id.toString()) ? "" : 'd-none'}"><i class="bi bi-cart-dash"></i> Remove</a>
                
            </div>
            </div>
        </div>
    </div>`

    const addBtn = document.querySelectorAll('#addBtn')
    for (let i = 0; i < addBtn.length; i++) {
        addBtn[i].addEventListener('click', () => {
            addToCart(addBtn[i])
        })
    }

    const removeBtn = document.querySelectorAll('#removeBtn')
    for (let i = 0; i < removeBtn.length; i++) {
        removeBtn[i].addEventListener('click', () => {
            const id = data.id
            inventory[id] += cart[id]
            delete cart[id]
            saveData(cart)
            cartCounter()
            display()
        })
    }
}

function addToCart(e) {
    if (check_login()) {
        const parent = e.parentElement.parentElement
        const removeBtn = parent.querySelector('#removeBtn')
        const editBtn = parent.querySelector('#editBtn')
        const id = Number.parseInt(data.id)

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
            saveData(cart)
            // console.log(parent.getAttribute('id'))
        }
    } else {
        alert('You are not logged in!')
        window.location = "login.html"
    }
}

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

function loadData(name) {
    let data = JSON.parse(localStorage.getItem(name))
    return data ? data : {}
}

function saveData(data) {
    localStorage.setItem("cart", JSON.stringify(data))
    localStorage.setItem("inventory", JSON.stringify(inventory))
}

function check_login() {
    if (loadData("logged-in") === true) {
        return true
    } else {
        return false
    }
}

async function startup() {
    cart = loadData("cart")
    await fetch('data.json').then((response) => response.json()).then((json) => {
        data = json.data[loadData("info") - 1]
    })
    // console.log(data)
    loadInventory()
    display()
    cartCounter()
}

startup()