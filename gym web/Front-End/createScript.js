const form = document.getElementById('createForm');
const registerBtn = document.getElementById('registerBtn');

function submitForm() {  
    const formData = new FormData(document.getElementById('createForm'));

    const user = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        dob: formData.get('dob'),
        weight: formData.get('weight'),
        height: formData.get('height'),
        username: formData.get('username'),
        password: formData.get('password')
    };

    console.log('First Name:', user.firstName);
    console.log('Last Name:', user.lastName);
    console.log('Email:', user.email);
    console.log('Date of Birth:', user.dob);
    console.log('Weight:', user.weight);
    console.log('Height:', user.height);
    console.log('Username:', user.username);
    console.log('Password:', user.password);
    register(user);
}

const register =  async (userObject) => {
    try {
        const { username, password } = userObject;
        const loginResponse = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })

        //makes sure user doesn't exist
        if(loginResponse.status == 404){
            const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userObject)
            })

            if (response.ok) {
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
                const data = await response.text();
                console.log(data); 
                alert('Registration successful!');
                window.location.href = '/Front-End/FrontEnd-Main-Menu.html';
            } else {
                throw new Error('Network response was not ok.');
            }
        }else{
            alert('User already exists, try \'login\' instead');
        }

    } catch (error) {
        console.error('Registration Error:', error);
        alert('Invalid registration credentials.');
    }
}

// registerBtn.addEventListener('click', ()=>{
//     submitForm();
// })
form.addEventListener('submit', (event)=>{
    event.preventDefault();
})