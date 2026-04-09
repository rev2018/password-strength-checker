/* ─── Element refs ─────────────────────────────────────── */
const password     = document.getElementById("pw")
const strengthFill = document.getElementById("strength-fill")
const strengthBadge= document.getElementById("strength-badge")
const entropyVal   = document.getElementById("entropy-val")
const crackVal     = document.getElementById("crack-val")
const scoreVal     = document.getElementById("score-val")
const warningText  = document.getElementById("warning")
const lengthText   = document.getElementById("length")

const toggle       = document.getElementById("toggle")
const eyeOpen      = document.getElementById("eye-open")
const eyeClosed    = document.getElementById("eye-closed")
const generate     = document.getElementById("generate")
const copyBtn      = document.getElementById("copy")
const copyIcon     = document.getElementById("copy-icon")
const checkIcon    = document.getElementById("check-icon")
const copyText     = document.getElementById("copy-text")
const darkToggle   = document.getElementById("dark-toggle")

const reqLength    = document.getElementById("req-length")
const reqUpper     = document.getElementById("req-upper")
const reqLower     = document.getElementById("req-lower")
const reqNumber    = document.getElementById("req-number")
const reqSpecial   = document.getElementById("req-special")

const compUpper    = document.getElementById("comp-upper")
const compLower    = document.getElementById("comp-lower")
const compNum      = document.getElementById("comp-num")
const compSpec     = document.getElementById("comp-spec")

const genLength    = document.getElementById("gen-length")
const genLengthVal = document.getElementById("gen-length-val")
const optUpper     = document.getElementById("opt-upper")
const optLower     = document.getElementById("opt-lower")
const optNum       = document.getElementById("opt-num")
const optSpec      = document.getElementById("opt-spec")

const historyList  = document.getElementById("history-list")

/* ─── State ────────────────────────────────────────────── */
const commonPasswords = [
  "123456","password","12345678","qwerty","abc123",
  "111111","123123","letmein","iloveyou","monkey"
]

let generatedHistory = []

/* ─── Slider live value ────────────────────────────────── */
genLength.addEventListener("input", () => {
  genLengthVal.textContent = genLength.value
})

/* ─── Main analysis ────────────────────────────────────── */
password.addEventListener("input", checkStrength)

function checkStrength() {
  const val = password.value
  let score = 0

  lengthText.textContent = val.length + " character" + (val.length === 1 ? "" : "s")

  // Requirements
  setReq(reqLength,  val.length >= 8)          && score++
  setReq(reqUpper,   /[A-Z]/.test(val))        && score++
  setReq(reqLower,   /[a-z]/.test(val))        && score++
  setReq(reqNumber,  /[0-9]/.test(val))        && score++
  setReq(reqSpecial, /[^A-Za-z0-9]/.test(val)) && score++

  // Score display
  scoreVal.textContent = score

  // Strength bar
  const levels = [
    { pct: "0%",   cls: "",       label: "—",      color: "transparent" },
    { pct: "20%",  cls: "weak",   label: "Weak",   color: "var(--weak)"   },
    { pct: "40%",  cls: "weak",   label: "Weak",   color: "var(--weak)"   },
    { pct: "60%",  cls: "fair",   label: "Fair",   color: "var(--fair)"   },
    { pct: "80%",  cls: "good",   label: "Good",   color: "var(--good)"   },
    { pct: "100%", cls: "strong", label: "Strong", color: "var(--strong)" }
  ]
  const lv = val.length === 0 ? levels[0] : levels[score]
  strengthFill.style.width      = lv.pct
  strengthFill.style.background = lv.color
  strengthBadge.className       = "strength-badge " + lv.cls
  strengthBadge.textContent     = lv.label

  updateComposition(val)
  calculateEntropy(val)
  checkCommon(val)
}

function setReq(el, valid) {
  el.classList.toggle("valid",   valid)
  el.classList.toggle("invalid", !valid)
  return valid
}

/* ─── Composition bar ──────────────────────────────────── */
function updateComposition(val) {
  if (!val.length) {
    [compUpper, compLower, compNum, compSpec].forEach(s => s.style.width = "0%")
    return
  }
  const upper = (val.match(/[A-Z]/g) || []).length
  const lower = (val.match(/[a-z]/g) || []).length
  const num   = (val.match(/[0-9]/g) || []).length
  const spec  = (val.match(/[^A-Za-z0-9]/g) || []).length
  const total = val.length

  compUpper.style.width = (upper / total * 100).toFixed(1) + "%"
  compLower.style.width = (lower / total * 100).toFixed(1) + "%"
  compNum.style.width   = (num   / total * 100).toFixed(1) + "%"
  compSpec.style.width  = (spec  / total * 100).toFixed(1) + "%"
}

/* ─── Entropy & crack time ─────────────────────────────── */
function calculateEntropy(pass) {
  if (!pass.length) {
    entropyVal.textContent = "—"
    crackVal.textContent   = "—"
    return
  }

  let charset = 0
  if (/[a-z]/.test(pass)) charset += 26
  if (/[A-Z]/.test(pass)) charset += 26
  if (/[0-9]/.test(pass)) charset += 10
  if (/[^A-Za-z0-9]/.test(pass)) charset += 32

  const entropy = Math.round(pass.length * Math.log2(charset || 1))
  entropyVal.textContent = entropy

  const guesses = Math.pow(2, entropy)
  const seconds = guesses / 1e9  // assume 1B guesses/sec

  let timeText
  if      (seconds < 1)          timeText = "instant"
  else if (seconds < 60)         timeText = Math.round(seconds) + "s"
  else if (seconds < 3600)       timeText = Math.round(seconds / 60) + " min"
  else if (seconds < 86400)      timeText = Math.round(seconds / 3600) + " hr"
  else if (seconds < 31536000)   timeText = Math.round(seconds / 86400) + " days"
  else if (seconds < 3.15e10)    timeText = Math.round(seconds / 31536000) + " yr"
  else if (seconds < 3.15e13)    timeText = Math.round(seconds / 3.15e10) + "k yr"
  else                           timeText = "centuries"

  crackVal.textContent = timeText
}

/* ─── Common password check ────────────────────────────── */
function checkCommon(pass) {
  warningText.textContent = commonPasswords.includes(pass.toLowerCase())
    ? "⚠ Commonly used password"
    : ""
}

/* ─── Show / hide toggle ───────────────────────────────── */
toggle.addEventListener("click", () => {
  const isHidden = password.type === "password"
  password.type    = isHidden ? "text" : "password"
  eyeOpen.style.display   = isHidden ? "none"  : ""
  eyeClosed.style.display = isHidden ? ""      : "none"
})

/* ─── Generate ─────────────────────────────────────────── */
generate.addEventListener("click", () => {
  const len     = parseInt(genLength.value)
  let charset   = ""
  if (optUpper.checked) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  if (optLower.checked) charset += "abcdefghijklmnopqrstuvwxyz"
  if (optNum.checked)   charset += "0123456789"
  if (optSpec.checked)  charset += "!@#$%^&*()-_=+[]{}|;:,.<>?"

  if (!charset) { alert("Select at least one character type"); return }

  // Use crypto.getRandomValues for better randomness
  let pass = ""
  const arr = new Uint32Array(len)
  crypto.getRandomValues(arr)
  for (let i = 0; i < len; i++) {
    pass += charset[arr[i] % charset.length]
  }

  password.value = pass
  checkStrength()
  addToHistory(pass)
})

/* ─── History ──────────────────────────────────────────── */
function addToHistory(pass) {
  generatedHistory.unshift(pass)
  if (generatedHistory.length > 5) generatedHistory.pop()
  renderHistory()
}

function renderHistory() {
  historyList.innerHTML = ""
  if (!generatedHistory.length) {
    historyList.innerHTML = '<li class="history-empty">No passwords generated yet</li>'
    return
  }
  generatedHistory.forEach(pw => {
    const li  = document.createElement("li")
    li.className = "history-entry"

    const span = document.createElement("span")
    span.className   = "history-pw"
    span.textContent = pw

    const btn = document.createElement("button")
    btn.className   = "history-copy"
    btn.textContent = "copy"
    btn.onclick = () => {
      navigator.clipboard.writeText(pw)
      btn.textContent = "✓"
      setTimeout(() => { btn.textContent = "copy" }, 1200)
    }

    li.append(span, btn)
    historyList.append(li)
  })
}

/* ─── Copy ─────────────────────────────────────────────── */
let copyTimeout
copyBtn.addEventListener("click", () => {
  if (!password.value) { alert("Enter or generate a password first"); return }

  navigator.clipboard.writeText(password.value)

  // Swap icon to checkmark
  copyIcon.style.display  = "none"
  checkIcon.style.display = ""
  copyText.textContent    = "Copied!"

  clearTimeout(copyTimeout)
  copyTimeout = setTimeout(() => {
    copyIcon.style.display  = ""
    checkIcon.style.display = "none"
    copyText.textContent    = "Copy"
  }, 1800)
})

/* ─── Dark mode ────────────────────────────────────────── */
darkToggle.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark")
  darkToggle.textContent = dark ? "🌚" : "🌞"
})
