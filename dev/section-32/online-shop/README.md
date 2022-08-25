# Online Shop Application Plan

## What We'll Build

- Front End
  - HTML, CSS, JS
- Backend
  - Node, Express, MongoDB

### Two Sites

- Customer Sites
  - View Products
  - Add to Shopping Cart
- Admin Sites
  - Maintain Products

## Key Pages (Views)

Customer & Admin Sites

### Accessible to Both

Sign up & Login

Both need to login.

Customer can browse products & add items to cart without signing in. **To continue to purchase, customer must be signed in.**

### Customer Views

#### View All Products

should not have to be logged in to browse products.
Should not have ot be logged in to add product to cart.

#### Product Details

#### Shopping Cart

- add to cart
- view cart
- make modifications to cart
  - edit items in cart
  - increase/decrease quantity of items

#### All Orders For Customer

view orders placed

No maintenance of these orders for a customer that I saw. Will not implement order editing for regular users at this time.

#### Pages after placing an Order

- Error
- Success
- Failure

### Admin Views

#### Dashboard

#### Product Pages

- View existing Products
- Add new Products
- Update Existing Products
- Delete Products

#### Orders Page

- View all Orders placed by All Users
- Update an Order placed by a User.
  - Update status - ex when shipped can update to fulfilled.

## Data Entities (Models)

### User

- Email
- Password
- isAdmin flag - admin or reg customer
- name
- address

### Product

- Name
- Summary
- Price
- image
- Description

### Cart

- items
- total price
- number of items

#### Storage of Cart data

Should not be on file in a database.

The cart should exist only as part of session data.

A user can convert the cart to an Order by signing in and purchasing the items in the cart.

When a user signs in and purchases the cart - that is when the cart data gets written to the order collection.

### Order

- User data
- Products / cart data
- date
- status
