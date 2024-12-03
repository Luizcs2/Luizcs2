const storedUsername = localStorage.getItem("username");
var storedPassword = localStorage.getItem("password");

const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const dobInput = document.getElementById('dob');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const showPasswordCheckbox = document.getElementById('showPassword');


showPasswordCheckbox.addEventListener('change', function () {
    // If the checkbox is checked, show the password; otherwise, hide it
    passwordInput.type = this.checked ? 'text' : 'password';
});

const getProfile = async(username) => {
    if (username == "") {
        firstNameInput.value = "data.firstName";
        lastNameInput.value = "data.lastName";
        emailInput.value = "data.email";
        dobInput.value = "data.dob";
        weightInput.value = "data.weight";
        heightInput.value = "data.height";
        usernameInput.value = "storedUsername";
        passwordInput.value = "storedPassword";
    } else {
        try {
            const response = await fetch(`http://localhost:8080/getprofile/${username}`,{
                method: 'GET',
                headers : {
                    'Content-Type': 'application/json',
                },
            })
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
    
                firstNameInput.value = data.firstName;
                lastNameInput.value = data.lastName;
                emailInput.value = data.email;
                dobInput.value = data.dob;
                weightInput.value = data.weight;
                heightInput.value = data.height;
                usernameInput.value = storedUsername;
                passwordInput.value = storedPassword;
            } else {
                console.log(`Error retrieving user: ${response.status}`)
            }
        } catch (error) {
            console.error("Error getting profile");
        }
    }
}

function submitForm() {  
    const formData = new FormData(document.getElementById('userForm'));

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

    storedPassword = formData.get('password');
    console.log('First Name:', user.firstName);
    console.log('Last Name:', user.lastName);
    console.log('Email:', user.email);
    console.log('Date of Birth:', user.dob);
    console.log('Weight:', user.weight);
    console.log('Height:', user.height);
    console.log('Username:', user.username);
    console.log('Password:', user.password);
    update(user);
}

const update = async(userObject) =>{
    // const { newPassword } = userObject;
    try {
        const response = await fetch('http://localhost:8080/updateProfile', {
            method: 'PUT',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userObject)
        });

        if (response.ok) {
            localStorage.setItem("password", storedPassword)
            console.log('User updated successfully');
            alert("Profile updated!");
            location.reload();
        } else {
            console.error('Error updating user:', response.status);
        }
    } catch (error) {
        console.error(`server error updating user: ${error}`)
    }
}

window.addEventListener('DOMContentLoaded', ()=>{
    getProfile(storedUsername);
})