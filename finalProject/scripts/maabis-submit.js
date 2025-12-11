const contactinfo = new URLSearchParams(window.location.search);
console.log(contactinfo);


document.querySelector("#results").innerHTML = `<p> Contact Information for <strong>${contactinfo.get("name")}</strong> with email address, <strong>${contactinfo.get("email")}</strong> and your mobile number,<strong> ${contactinfo.get("phone")}.
 `


 const storageKey = "pageOpenCount";

let currentCount = parseInt(localStorage.getItem(storageKey)) || 0;

currentCount += 1;

localStorage.setItem(storageKey, currentCount);

const spanElement = document.getElementById("submissionsCount");
if (spanElement) {
    spanElement.textContent = currentCount;
}