const input = document.querySelector('#selected');
const button = document.querySelector('#addBtn');
const list = document.querySelector('#list');

button.addEventListener('click', function() {
    if (input.value.trim() === '') {
        alert('Please enter a product and quantity!');
        input.focus();
        return;
    }

    const choosenItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    choosenItem.textContent = input.value;
    deleteButton.textContent = 'X';
    choosenItem.append(deleteButton);
    list.append(choosenItem);

    list.classList.add('selected-items');
    deleteButton.classList.add('delete-btn');

    deleteButton.addEventListener('click', function() {
        choosenItem.remove();
        input.focus();
    })

    input.value = '';
    input.focus();
})
