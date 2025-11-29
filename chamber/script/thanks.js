const businessInfo = new URLSearchParams(window.location.search);
console.log(businessInfo);

// Retrieve the timestamp string
const rawTimestamp = businessInfo.get("time-stamp");

// Format the timestamp for display (e.g., "Saturday, 29 November, 2025 at 19:05:00 GMT")
let formattedTimestamp = '';
if (rawTimestamp) {
    try {
        const date = new Date(rawTimestamp);
        formattedTimestamp = date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    } catch (e) {
        // Fallback if date parsing fails
        formattedTimestamp = 'at an unknown time.';
    }
}


document.querySelector("#results").innerHTML = `
    <p>
        Business Registration for <strong>${businessInfo.get("org-name")}</strong>, 
        ${businessInfo.get("org-description")}. 
        Registration was done by the ${businessInfo.get("org-title")}, 
        <strong>${businessInfo.get("fname")} ${businessInfo.get("lname")}</strong>. 
        The email address used for registration is ${businessInfo.get("email")} 
        and your mobile number is ${businessInfo.get("telephone")}. 
    </p>
    <p>
        Welcome to the <strong>${businessInfo.get("membership")} level</strong> family.
    </p>
    <p class="timestamp-display">
        Your registration was submitted on: <strong>${formattedTimestamp}</strong>.
    </p>
`;