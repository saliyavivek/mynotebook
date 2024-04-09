(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

let row = document.getElementById("all-notes-row");
let allNotes = row.children;
let colors = [
  "#87baf5",
  "#aa87f5",
  "#f0864a",
  "#8ac3a3",
  "#f674ad",
  "#c56cf0",
  "#ff4d4d",
  "#b2bce9",
  "#36a770",
  "#ffd300",
];

for (note of allNotes) {
  // var x = Math.floor(Math.random() * 256);
  // var y = Math.floor(Math.random() * 256);
  // var z = Math.floor(Math.random() * 256);
  // var bgColor = "rgb(" + x + "," + y + "," + z + ")";

  // note.children[1].style.background = bgColor;

  let randomIndex = Math.floor(Math.random() * 10);
  let randomColor = colors[randomIndex];
  note.children[1].style.background = randomColor;
}

for (let i = 0; i < allNotes.length; i++) {
  let note = allNotes[i].children[0];
  note.addEventListener("mouseover", () => {
    let hoverColor = allNotes[i].children[1].style.background;
    note.style.background = hoverColor;
  });
  note.addEventListener("mouseout", () => {
    hoverColor = "#fff";
    note.style.background = hoverColor;
  });
}

// function checkState() {
//   let chkbox = document.getElementsByClassName("switch-edit");
//   if (chkbox[0].checked == false) {
//     chkbox[0].checked = true;
//   } else {
//     chkbox[0].checked = false;
//   }
//   console.log(chkbox);
// }

function getDemoCred() {
  let email = document.getElementsByClassName("login-email-demo")[0];
  let password = document.getElementsByClassName("login-pass-demo")[0];

  email.value = "demo1@gmail.com";
  password.value = "demo1";
}
