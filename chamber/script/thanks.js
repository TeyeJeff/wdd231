const businessInfo = new URLSearchParams(window.location.search);
console.log(businessInfo);


document.querySelector("#results").innerHTML = `<p>Business Registration for ${businessInfo.get("org-name")}, ${businessInfo.get("org-description")}. Registration was done by the ${businessInfo.get("org-title")}, ${businessInfo.get("fname")} ${businessInfo.get("lname")}. The email address used for registration is ${businessInfo.get("email")} and your mobile number is ${businessInfo.get("telephone")}. 
Welcome to the ${businessInfo.get("membership")} level family.</p>`