const byuiCourse = {
  code: "WDD231",
  name: "Web Frontend Development I",
  sections: [
    {
      sectionNumber: 1,
      enrolled: 88,
      instructor: "Brother Bingham",
    },
    {
      sectionNumber: 2,
      enrolled: 81,
      instructor: "Sister Shultz",
    },
    {
      sectionNumber: 3,
      enrolled: 95,
      instructor: "Sister Smith",
    },
  ],
  changeEnrollment: function (sectionNumber, add = true) {
  const idx = this.sections.findIndex(s => s.sectionNumber == sectionNumber);
  if (idx >= 0) {
    this.sections[idx].enrolled += add ? 1 : -1;
  }
}
};




export default byuiCourse;