const username = document.getElementById('username');
const password = document.getElementById('password');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

const login = async (username,password) => {
    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })

        if (response.ok) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            const data = await response.json();
            console.log(data); 
            window.location.href = '/Front-End/FrontEnd-Main-Menu.html';
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Login Error:', error);
        alert('Invalid login credentials.');
    }
}


loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
});

loginBtn.addEventListener('click', ()=>{
    const usernameValue = username.value;
    const passwordValue = password.value;
    login(usernameValue,passwordValue);
})

// registerBtn.addEventListener('click', ()=>{
//     const usernameValue = username.value;
//     const passwordValue = password.value;
//     register(usernameValue,passwordValue);
// })