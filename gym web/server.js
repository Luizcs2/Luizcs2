const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const axios = require('axios');
const User = require('./Login/config.js')

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  const options = {
      root: path.join(__dirname, '.'),
  };

  const fileName = 'Front-End/Front-end-Login.html';
  res.sendFile(fileName, options, function (err) {
      if (err) {
          next(err);
      } else {
          console.log('Sent:', fileName);
      }
  });
});

app.post('/register', async(req,res)=>{
  const salt = 10;
  const {
    firstName,
    lastName,
    email,
    dob,
    weight,
    height,
    username,
    password} = req.body;

  let hashedPassword = await bcrypt.hash(password,salt);

  const data = {
    firstName : firstName,
    lastName : lastName,
    email : email,
    dob : dob,
    weight : weight,
    height : height,
    username : username,
    password : hashedPassword
  }

  await User.add(data);
  console.log(`User Data: ${data.username} added`);
  res.send({message: "User Added."});
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and Password required." });
  }

  try {
    const snapshot = await User.where('username', '==', username).get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const storedPassword = doc.data().password;

      // Compare the provided password with the stored hashed password using bcrypt
      const passwordMatch = await bcrypt.compare(password, storedPassword);

      if (passwordMatch) {
        console.log('User Found');
        return res.status(200).json({ message: "User found", user: doc.data() });
      } else {
        console.log('Incorrect password');
        return res.status(401).json({ message: "Incorrect password" });
      }
    }else {
      console.log('User Not Found');
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/getprofile/:username', async(req,res)=>{
  const username = req.params.username;

  try {
    const snapshot = await User.where('username', '==', username).get();

    if(!snapshot.empty){
      const doc = snapshot.docs[0];
      res.status(200).json(doc.data());
    }else{
      console.log("profile not found!");
      res.status(404).json({error: "Profile not found"});
    }
  } catch (error) {
    console.error("Server error getting user profile", error)
  }
});

app.put('/updateProfile', async(req,res)=>{
  const salt = 10;
  const {
    firstName,
    lastName,
    email,
    dob,
    weight,
    height,
    username,
    password} = req.body;

  let hashedPassword = await bcrypt.hash(password,salt);

  const data = {
    firstName : firstName,
    lastName : lastName,
    email : email,
    dob : dob,
    weight : weight,
    height : height,
    username : username,
    password : hashedPassword
  }

  try {
    const querySnapshot = await User.where('username', '==', username).get();
    const docRef = querySnapshot.docs[0].ref;

    await docRef.update(data);
    console.log("user profile updated");
    res.status(200).json({ message: 'User Updated.' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }

})

app.get('/get-meal-plan', async (req, res) => {
  try {
    const response = await axios.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate', {
      params: {
        timeFrame: 'week',
        targetCalories: '2000'
      },
      headers: {
        'X-RapidAPI-Key': '8f35d20e94msh657f3d1a049fce1p190965jsna3f7625faf47', 
        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
      }
    });

    const formattedMealPlan = {};

    if (response.data && response.data.week) {
      Object.keys(response.data.week).forEach(day => {
        const recipes = response.data.week[day].map(recipe => {
          return {
            recipeName: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            readyInMinutes: recipe.readyInMinutes,
            sourceUrl: recipe.sourceUrl,
            servings: recipe.servings,
            id: recipe.id,
            imageType: recipe.imageType
          };
        });

        formattedMealPlan[day] = recipes;
      });
    }

    res.json(formattedMealPlan);
  } catch (error) {
    res.status(500).send('Error fetching meal plan');
  }
});


app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})
