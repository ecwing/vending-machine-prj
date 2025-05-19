## Vending Machine Interface

A React + TypeScript application simulating a vending machine

## Setup

How to run this application locally on your machine:

1. Install dependencies

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the application

Visit the local URL shown in the terminal (http://localhost:5173) in your browser.

4. Running unit tests

To run all unit tests for the application

```bash
npm run test
```

## Features

- Deposit nickels, dimes, quarters
- Select Cola, Diet Cola, Lime Soda, or Water
- Handles change, out-of-stock, and cancellations

## Project Abstract

As stated in the provided 'Vending Machine 2025' document:

"A Vending Machine Interface

You have been hired to create the control software for a soda vending machine based on the following requirements:

- Accept coins of 5¢, 10¢, or 25¢ denominations
  (nickels, dimes, and quarters deposited by the customer)

- Allow the customer to select from these products:
  Cola (25¢), Diet Cola(35¢), Lime Soda (25¢), and Water (45¢)

- Based on the customer’s selection, dispense the product and any change as needed.

- Allow the customer to cancel their purchase prior to the selection, returning all deposited funds.

Your implementation should model these functional requirements and keep track of the internal state of the machine. On startup the machine should be initialized with 5 of each type of coin and the following drink quantities: 10xCola, 8xDiet Cola, 0xLime Soda (out of stock), and 2xWater.

To test the controller, create a UX with React for the user to issue the following commands:

CANCEL,PURCHASE
DEPOSIT,QUARTER
DEPOSIT,DIME
DEPOSIT,NICKEL
SELECT,COLA
SELECT,DIETCOLA
SELECT,LIMESODA
SELECT,WATER

The final result should be a URL or zip file with code, and instructions to execute the application.

Make the UX as user-friendly as possible."

## Technologies used

- React
  - required library to build application
- TypeScript
  - type safety across components and logic, improving code reliability and catching errors early during development
- Vite
  - A fast and modern frontend build tool used to serve and bundle the app during development and production. Enables hot module replacement (HMR) for faster iteration
- Vitest
  - Lightweight and fast testing framework compatible with Vite. Used to write and run unit tests for helper functions like calculateChange()
- ESList and Prettier
  - Enforce code quality and consistent formatting throughout the project. ESLint catches potential errors and bad practices, while Prettier handles automatic formatting
- LocalStorage
  Used to persist the state of the vending machine (e.g., inserted coins, selected product, and coin inventory) across page refreshes
- CSS3 with Media Queries
  Custom styling with responsive design considerations for different screen sizes (mobile and desktop) to improve user experienc

## Considerations

- Accessibility (semantic HTML - proper button elements instead of clickable divs, RIA attributes when needed, keyboard navigation)
- component based architecture - modular design -> atomic principles
- Modular folder structure
- Colocate files (component, styles, tests) to improve maintainability
- Separation of concerns: UI logic, business logic
- Built w/ responsive design in mind - Desktop / Mobile experiences\*
- Built w/ accessibility in mind (semantic HTML, ARIA labels and alt-text for images, keyboard navigation on interaction elements ensured)

* design decesion was made to not have elements with dynamic sizing if the viewport is manipulated dynamically as the thought process was to assume that this vending machine has two forms in desktop and mobile state.

## Assumptions:

Since there was not a 100% coverage on edge cases, a number of assumptions have been made for the vending machine logic.

What do to if there’s no more change left?
What do do

Besides the main functional requirements stated in the project abstract, the assumption is I have the liberty to make what I will of the UX. This is expanded in the next section.

## Notes

Design Notes:

## Added functionality/features:

Any feature that is not directly conflicting with the required functionality has been added as bonus QOL features or functionality to enhance the user experience. These include:

- A more robust tracking of vending machine state - ie. outside of local state - implement localStorage state to prevent machine values (coin inventory, product stock, product selection, balance and remianing balance) from resetting to initial values after a page refresh
- A user display stylized like a digital vending machine to provide user with feedback of actions - coin deposit, product selection, balance, out of stock notices, admin mode etc.
- setTime for display to go back to default for most messages
- Unique sound effects associated with the following actions:
  - dispensing coins
  - button selection
  - product dispensing
  - Refunding coins/change
  - admin mode sequence unlock
- Secret Admin mode functionality in form of secret button sequence on machine:
  - To reset coin inventory and stock back to original state
  - To zero out coin inventory and product stock
  - To toggle coin currency (images of CAN coins vs. US coins), no functionality changes other than UI
- Unique images created of products for visual appeal
- Included images of coin values in US or CAN
- Coin refund sound plays according to the number of coins refunded
- When all products are out of stock, depositing coins will be immediately refunded
- Added specific CSS to button to make it feel tactile and responsive to user actions

## User Experience testing/feedback

- To simulate real world UX/UI design process, some user exprience testing was done with some family and friends. Key data points were taken back and influenced design decesions.
  Takeaways:
- item price should always be visible not just visible in display once a product is selected
- Some cofusion with what balance represented - this would then influence the design decision to clearly state 3 seperate UI allocations for quanity.
  - Inserted coin
  - Balance of machine (accumulates the more a user deposits coins before a purchase or cancelling)
  - Balance remaining required to purchase a product

## Test cases:

Unit tests were written using Vitest for critical utility functions that control coin change calculations. Tests can be found in src/lib/calculateChange.test.ts.

Covered cases include:

- Correct change given when exact coin combination is available
- Fallback combinations (e.g. 2 dimes + 1 nickel for 25¢ when no quarters)
- Edge case: no coins available to give change
- Minimum number of coins returned (greedy algorithm check)
- Return of zero coins when amount is 0
- Failures when inventory has value but not usable combination

to run unit tests:

```bash
npm run test
```

## Manual Feature Testing

The following can be tested manually through the UI:

Coin Deposit

- Insert coins (nickel, dime, quarter) and verify balance updates correctly
- Insert coins and check that the coin inventory updates
- Try inserting coins when all products are sold out — coins should auto-refund with a sound and message.

Product Selection

- Select each product using button A–D. Message should show selected product.
- Select a product that is sold out — “Sold Out” message should appear.

Purchase Logic

- Insert exact change and purchase an item — it should reduce stock, play sound, and reset balance.
- Insert more than required — it should return appropriate change and show a “Change” message.
- Try purchasing without enough balance — you should be prompted to insert more coins.
- If machine state is at the initial state set, purchase water twice and the stock for water should be zero with UI indicating that it is 'sold out' on the product image grid as well as the display
- After setting the admin toggle to set products to zero, there should be a persisting UI message to indicate this and when attempting to deposit any coins, there should be specific UI indicating on the display that all products are sold out and a refund is provided immediately.

Cancel & Refund

- Insert coins and press Cancel — full refund should be returned and coin inventory updated.
- Try cancelling after selecting a sold-out item — refund should still trigger correctly.
- Deposit 25¢ then select Cola, then attempt to deposit any coins you should be refunded back with a message
- Deposit 5 x 25¢ then select Cola, then attempt to deposit any coins you should be refunded back only the coin that was deposited with a message

Admin Features (Secret Sequences)

- Enter 'A D A D B C B C purchase' → resets machine (coin and product inventory reset) back to initial state
- Enter 'A D A D B C B C cancel' → sets coin and product inventory to zero
- Enter 'A D A D B C B C purchase' → toggles currency display (USD ↔ CAD)

Sound Feedback

- Listen for sound effects when inserting coins, purchasing, dispensing change, and activating admin features.

Persistence

- Refresh the page after depositing coins or selecting a product — state (like balance and selected product) should persist via LocalStorage.

UI Responsiveness & Styling

- Resize the browser or test on mobile — layout should adjust.
- Check for scrolling marquee message in display screen for long messages.
- Hover and click animations should apply to buttons.
- “Sold Out” overlay appears when stock is depleted.

## Broswer testing

- Ensure application looks and reacts the same way across browsers with no limitations on functionality

# Learnings

- Testing with Vitest

## Resources:

Font: https://www.azfonts.net/fonts/digital-7/regular-270347
converting file sizes: https://squoosh.app/editor

## Stretch goals unable to complete - consider to add at a later time

- Audio on / off Toggle?
- UI indicator that the product selected is highlighted
- Still there? setTimeout to refund balance after a period of time?
- Animate coin return or show coin inventory
- Light/Dark mode switch?
- For trouble shooting and all other inquires, please contact vending machine operator/distributor @ my phone number or email address
