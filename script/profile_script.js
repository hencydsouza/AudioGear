document.getElementById('logout-btn').addEventListener("click", () => {
    localStorage.removeItem("cart")
    localStorage.removeItem("user-key")
    localStorage.removeItem("info")
    localStorage.setItem("logged-in", false)
    window.location = "index.html"
})

let cart = {}
let data = {}

await fetch('data.json').then((response) => response.json()).then((json) => {
    data = json.user[localStorage.getItem("user-key")]
    // console.log(data)
})

function renderData(data) {
    document.getElementById('username').innerHTML = data.first + " " + data.last
    document.getElementById('user-details').innerHTML = `
    <li class="list-group-item bg-transparent">
        <div class="list-title">First Name</div>
        <div class="list-data">${data.first}</div>
    </li>
    <li class="list-group-item bg-transparent">
        <div class="list-title">Last Name</div>
        <div class="list-data">${data.last}</div>
    </li>
    <li class="list-group-item bg-transparent">
        <div class="list-title">Email</div>
        <div class="list-data">${data.email}</div>
    </li>
    <li class="list-group-item bg-transparent">
        <div class="list-title">Phone No.</div>
        <div class="list-data">${data.phno}</div>
    </li>
    <li class="list-group-item bg-transparent">
        <div class="list-title">Address</div>
        <div class="list-data">${data.address}, ${data.state}, ${data.zip}</div>
    </li>
    `
}

function cartCounter() {
    const counterEle = document.getElementById('cart-counter')
    let count = 0
    for (let i = 0; i < Object.keys(cart).length; i++) {
        count += cart[Object.keys(cart)[i]]
    }
    count ? counterEle.innerHTML = count : counterEle.innerHTML = ''
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
    // console.log(check_login())
    if (!check_login()) {
        // alert("Please Login to Proceed!")
        window.location = "index.html"
    } else {
        renderData(data)
        cart = loadData("cart")
        cartCounter()

        // d-lg-none
    }
}

startup()