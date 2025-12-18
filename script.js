alert("Welcome to the Calculator App!");

/* ELEMENTS */
const home = document.getElementById("home");
const basicCalc = document.getElementById("basicCalc");
const sciCalc = document.getElementById("sciCalc");
const themeToggle = document.getElementById("themeToggle");

/* =========================
   OPEN CALCULATORS
   ========================= */
openBasic.onclick = () => {
  home.style.display = "none";
  basicCalc.classList.remove("hidden");
  sciCalc.classList.add("hidden");
  history.pushState({ page: "basic" }, "", "#basic");
};

openScientific.onclick = () => {
  home.style.display = "none";
  sciCalc.classList.remove("hidden");
  basicCalc.classList.add("hidden");
  history.pushState({ page: "scientific" }, "", "#scientific");
};

/* =========================
   BACK BUTTON (HOME)
   ========================= */
document.querySelectorAll(".back-btn").forEach(btn => {
  btn.onclick = () => history.back();
});

/* =========================
   BROWSER BACK ARROW
   ========================= */
window.addEventListener("popstate", () => {
  basicCalc.classList.add("hidden");
  sciCalc.classList.add("hidden");
  home.style.display = "flex";
});

/* =========================
   THEME TOGGLE (FIXED)
   ========================= */
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  // icon switch (optional but nice)
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
};

/* =========================
   CALCULATOR LOGIC
   ========================= */
function setupCalc(calcId, displayId) {
  const calc = document.getElementById(calcId);
  const display = document.getElementById(displayId);

  calc.querySelectorAll(".buttons button").forEach(btn => {
    btn.onclick = () => {
      const v = btn.textContent;

      if (v === "AC") {
        display.value = "";
      }
      else if (v === "DEL") {
        display.value = display.value.slice(0, -1);
      }
      else if (v === "=") {
        try {
          display.value = eval(
            display.value
              .replace(/×/g, "*")
              .replace(/÷/g, "/")
              .replace(/−/g, "-")
              .replace(/\^/g, "**")
          );
        } catch {
          display.value = "Error";
        }
      }
      else if (["sin","cos","tan"].includes(v)) {
        display.value = sciTrig(v, display.value);
      }
      else if (v === "x²") {
        display.value = Math.pow(Number(display.value) || 0, 2);
      }
      else if (v === "x³") {
        display.value = Math.pow(Number(display.value) || 0, 3);
      }
      else if (v === "π") {
        display.value += Math.PI;
      }
      else if (v === "!") {
        let n = parseInt(display.value);
        if (isNaN(n) || n < 0) display.value = "Error";
        else {
          let f = 1;
          for (let i = 1; i <= n; i++) f *= i;
          display.value = f;
        }
      }
      else if (v === "abs") {
        display.value = Math.abs(Number(display.value) || 0);
      }
      else if (v === "√") {
        display.value = Math.sqrt(Number(display.value) || 0);
      }
      else if (v === "log") {
        display.value = Math.log10(Number(display.value) || 0);
      }
      else if (v === "ln") {
        display.value = Math.log(Number(display.value) || 0);
      }
      else {
        display.value += v;
      }
    };
  });
}

/* INIT CALCULATORS */
setupCalc("basicCalc", "basicDisplay");
setupCalc("sciCalc", "sciDisplay");

/* =========================
   KEYBOARD SUPPORT
   ========================= */
document.addEventListener("keydown", (e) => {
  const display =
    !sciCalc.classList.contains("hidden") ? sciDisplay :
    !basicCalc.classList.contains("hidden") ? basicDisplay :
    null;

  if (!display) return;

  if (!isNaN(e.key)) display.value += e.key;
  else if (e.key === ".") display.value += ".";
  else if (e.key === "+") display.value += "+";
  else if (e.key === "-") display.value += "−";
  else if (e.key === "*") display.value += "×";
  else if (e.key === "/") display.value += "÷";
  else if (e.key === "Enter") {
    e.preventDefault();
    document.querySelector(".equal").click();
  }
  else if (e.key === "Backspace") {
    display.value = display.value.slice(0, -1);
  }
  else if (e.key === "Escape") {
    display.value = "";
  }
});

/* =========================
   SCIENTIFIC MODES
   ========================= */
let mode = "DEG";

function toggleMode() {
  mode = mode === "DEG" ? "RAD" : "DEG";
  modeBtn.textContent = mode;
}

function switchTab(tab) {
  document.querySelectorAll(".sci-tab").forEach(t => t.classList.add("hidden"));
  document.getElementById("tab-" + tab).classList.remove("hidden");
}

function sciTrig(fn, value) {
  let x = parseFloat(value) || 0;
  if (mode === "DEG") x = x * Math.PI / 180;

  if (fn === "sin") return Math.sin(x);
  if (fn === "cos") return Math.cos(x);
  if (fn === "tan") return Math.tan(x);
}
