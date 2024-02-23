const navToggler = document.getElementById('navbar-toggler-button')
navToggler.addEventListener("click", () => {
    // console.log(navToggler.getAttribute('aria-expanded'))
    if (navToggler.getAttribute('aria-expanded') === 'true') {
        document.getElementById('cart-icon').style.display = 'none'
    } else if (navToggler.getAttribute('aria-expanded') === 'false') {
        document.getElementById('cart-icon').style.display = 'block'
    }
})

let data = []


await fetch('data.json').then((response) => response.json()).then((json) => {
    data = json.data
})

// console.log(data)
const cartContainer = document.getElementById('cart-container-inner')
function renderCartItems(cartArr) {
    cartContainer.innerHTML = ''
    // fix length
    for (let i = 0; i < 4; i++) {
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
                            <p class="m-0 price text-start"> &#8377; ${cartArr[i].price}</p>

                        </div>

                        <div class="pe-lg-3 mt-auto mb-auto">
                            <div class="btn-group">
                                <button href="#" class="btn btn-primary px-1 py-1 p-md-2"><i
                                        class="bi bi-plus-lg"></i></button>
                                <div href="#" class="btn btn-outline-primary px-2 px-md-2 py-md-2 py-1">
                                    &nbsp;2&nbsp;</div>
                                <button href="#" class="btn btn-primary px-1 py-1 p-md-2"><i
                                        class="bi bi-dash-lg"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }
}

renderCartItems(data)