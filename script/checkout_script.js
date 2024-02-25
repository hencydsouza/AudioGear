const navToggler = document.getElementById('navbar-toggler-button')
navToggler.addEventListener("click", () => {
    // console.log(navToggler.getAttribute('aria-expanded'))
    if (navToggler.getAttribute('aria-expanded') === 'true') {
        document.getElementById('cart-icon').style.display = 'none'
    } else if (navToggler.getAttribute('aria-expanded') === 'false') {
        document.getElementById('cart-icon').style.display = 'block'
    }
})

// function validateForm() {
//     let x = document.forms["checkout_form"]["firstName"].value;
//     if (x == "") {
//         alert("Name must be filled out");
//         return false;
//     }
// }