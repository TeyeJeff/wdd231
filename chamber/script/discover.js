import { places } from "../data/places.mjs";


const placesContainer = document.getElementById('places-container');

places.forEach(place => {
    // Create the main card article element
    const card = document.createElement('article');
    card.classList.add('discover-card');
    
    // Create the image figure
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = place.image_url;
    image.alt = `Image of ${place.title}`;
    image.loading = 'lazy'; // Improve performance
    figure.appendChild(image);
    
    // Create the title
    const title = document.createElement('h2');
    title.textContent = place.title;
    
    // Create the focus/category tag
    const focusP = document.createElement('p');
    focusP.classList.add('focus-tag');
    focusP.textContent = `Focus: ${place.focus}`;
    
    // Create the address
    const address = document.createElement('address');
    address.textContent = place.address;
    
    // Create the description
    const descriptionP = document.createElement('p');
    descriptionP.textContent = place.description;
    
    // Create the cost/fee info
    const costP = document.createElement('p');
    costP.classList.add('cost-info');
    costP.textContent = `Entry/Cost: ${place.cost}`;
    
    // Create the "learn more" button
    const button = document.createElement('button');
    button.textContent = 'Learn More';
    button.classList.add('learn-more-btn');
    
    // Assemble the card
    card.appendChild(title);
    card.appendChild(figure);
    card.appendChild(address);
    card.appendChild(focusP);
    card.appendChild(descriptionP);
    card.appendChild(costP);
    card.appendChild(button);
    
    // Append the card to the container
    placesContainer.appendChild(card);
});