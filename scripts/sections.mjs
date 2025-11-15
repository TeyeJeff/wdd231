
export function setSectionSelection(sections) {
  const sectionSelect = document.querySelector("#sectionNumber");

  sectionSelect.innerHTML = '<option value="0" disabled selected>--</option>';

  sections.forEach(section => {
    const opt = document.createElement("option");
    opt.value = section.sectionNumber;
    opt.textContent = section.sectionNumber;
    sectionSelect.appendChild(opt);
  });
}