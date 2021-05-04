import React from 'react'
import hamburger from 'images/food/hamburger.jpeg'
import plums from 'images/food/plums.jpeg'
import tomatoes from 'images/food/tomatoes.jpeg'
import carrots from 'images/food/carrots.jpeg'

export const servings = [
    {id: 1, date: '27/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaisse', people_served:305},
    {id: 2, date: '27/01/2021', meal: 'Lunch', recipe: 'Beef Stew', people_served: 247},
    {id: 3, date: '27/01/2021', meal: 'Dinner', recipe: 'Macaroni Cheese', people_served: 298},
    {id: 4, date: '27/01/2021', meal: 'Breakfast', recipe: 'Bacon & Eggs', people_served: 324},
    {id: 5, date: '27/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 312},
    {id: 6, date: '27/01/2021', meal: 'Dinner', recipe: 'Lasagne', people_served: 214},
    {id: 7, date: '27/01/2021', meal: 'Dinner', recipe: 'Chicken Curry', people_served: 378},
    {id: 8, date: '27/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 412},
    {id: 9, date: '27/01/2021', meal: 'Dinner', recipe: 'Lentil Dal', people_served: 219},
    {id: 10, date: '27/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 356},
    {id: 11, date: '27/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 289},
    {id: 12, date: '27/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 276},
    {id: 13, date: '27/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 254},
    {id: 14, date: '27/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 319},
    {id: 15, date: '28/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 312},
    {id: 16, date: '28/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 314},
    {id: 17, date: '29/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 216},
    {id: 18, date: '29/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 317},
    {id: 19, date: '30/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 368},
    {id: 20, date: '30/01/2021', meal: 'Dinner', recipe: 'Spaghetti Bolognaise', people_served: 399},
]

export const beneficiaries = [
  {id: 1, photo: <img src="https://randomuser.me/api/portraits/women/59.jpg" width={100}/>, name: "Maria Green", last_meal: '27/01/2021', total_meals: 23, meals_last_7_days: 8},
  {id: 2, photo: <img src="https://randomuser.me/api/portraits/men/23.jpg" width={100}/>, name: "Peter White" , last_meal: '27/01/2021', total_meals: 17, meals_last_7_days: 0},
  {id: 3, photo: <img src="https://randomuser.me/api/portraits/women/15.jpg" width={100}/>, name: "Lucia Black", last_meal: '27/01/2021', total_meals: 12, meals_last_7_days: 1},
  {id: 4, photo: <img src="https://randomuser.me/api/portraits/women/17.jpg" width={100}/>, name: "Charlotte Grey", last_meal: '27/01/2021', total_meals: 7, meals_last_7_days: 7},
  {id: 5, photo: <img src="https://randomuser.me/api/portraits/men/38.jpg" width={100}/>, name: "Edward Pink", last_meal: '27/01/2021', total_meals: 8, meals_last_7_days: 3},
  {id: 6, photo: <img src="https://randomuser.me/api/portraits/men/7.jpg" width={100}/>, name: "Sam Brown", last_meal: '27/01/2021', total_meals: 16, meals_last_7_days: 4},
  {id: 7, photo: <img src="https://randomuser.me/api/portraits/women/18.jpg" width={100}/>, name: "Twyla Yellow", last_meal: '27/01/2021', total_meals: 98, meals_last_7_days: 5},
  {id: 8, photo: <img src="https://randomuser.me/api/portraits/women/57.jpg" width={100}/>, name: "Alexis Rose", last_meal: '27/01/2021', total_meals: 34, meals_last_7_days: 6},
  {id: 9, photo: <img src="https://randomuser.me/api/portraits/men/23.jpg" width={100}/>, name: "David Orange", last_meal: '27/01/2021', total_meals: 54, meals_last_7_days: 1},
  {id: 10, photo: <img src="https://randomuser.me/api/portraits/women/16.jpg" width={100}/>, name: "Richard Green", last_meal: '27/01/2021', total_meals: 13, meals_last_7_days: 2},
]

export const cartProducts = [
  {id: 1, photo: <img src={hamburger} width={50}/>, name: "Hamburgers", qty: 3},
  {id: 2, photo: <img src={plums} width={50}/>, name: "Plums", qty: 5},
  {id: 3, photo: <img src={tomatoes} width={50}/>, name: "Tomatoes", qty: 7},
  {id: 4, photo: <img src={carrots} width={50}/>, name: "Carrots", qty: 2},
]
