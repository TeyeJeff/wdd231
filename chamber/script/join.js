document.getElementById("time-stamp").value = new Date().toISOString(); // NEW: Captures precise time for submission

// Select ALL buttons with the class 'open-button'
const openButtons = document.querySelectorAll(".open-button");

// Select ALL buttons with the class 'close-button'
const closeButtons = document.querySelectorAll(".close-button");


// --- Open Dialog Logic ---
openButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Get the specific dialog ID from the button's 'data-dialog-id' attribute
        const dialogId = button.getAttribute("data-dialog-id");
        const dialog = document.getElementById(dialogId);
        
        if (dialog) {
            dialog.showModal();
        }
    });
});

// --- Close Dialog Logic ---
closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Find the closest parent <dialog> element and close it
        const dialog = button.closest("dialog");
        if (dialog) {
            dialog.close();
        }
    });
});