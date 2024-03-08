let data = []
await fetch('data.json').then((response) => response.json()).then((json) => {
    data = json.user
    sessionStorage.setItem("users", JSON.stringify(data))
})