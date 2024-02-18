const express = require('express');
const User = require('../models/User');

const userRouter = express.Router();

// Get All Users
userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      message: error.message.toString(),
    });
  }
});

// Get One By ID
userRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User
    .findById(id)

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: 'No User Found',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message.toString(),
    });
  }
});

//Get User Recipes
userRouter.get('/:id/recipes', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User
    .findById(id)

    if (user) {
      const { recipes } = user;
      res.status(200).json(recipes);
    } else {
      res.status(404).json({
        message: 'No User Found',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message.toString(),
    });
  }
});

// User Save Recipe
userRouter.post('/:id/recipes', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User
    .findById(id)

    if (user) {
      const { recipe } = req.body;
      const updatedRecipes = [...user.recipes, recipe];
      const updatedUser = await User.findByIdAndUpdate(id, { ...user, recipes: updatedRecipes });
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({
        message: 'No User Found',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message.toString(),
    });
  }
});

// User Delete Saved Recipe
userRouter.delete('/:id/recipes', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User
    .findById(id)

    if (user) {
      const { recipe } = req.body;
      // Might need to use r.id !== recipe.id
      const updatedRecipes = user.recipes.filter((r) => r !== recipe);
      const updatedUser = await User.findByIdAndUpdate(id, { ...user, recipes: updatedRecipes });
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({
        message: 'No User Found',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message.toString(),
    });
  }
});

module.exports = userRouter;
