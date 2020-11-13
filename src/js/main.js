"use strict"


let questionBoxs = document.querySelectorAll('.item');
let pics = document.querySelectorAll('.pic');

for (let questionBox of questionBoxs) {
  questionBox.onclick = function () {
    if (questionBox.classList.contains('right')) {
      questionBox.style.backgroundColor = 'green';
    } else {
      questionBox.style.backgroundColor = 'red';
    }
  }
}

for (let pic of pics) {
  pic.onclick = function () {
    if (pic) {
      this.classList.add('transparent');
      this.style.border = 'none';
    } else {
      pic.style.backgroundColor = '#fff';
    }
  }
}






