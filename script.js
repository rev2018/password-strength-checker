const password = document.getElementById("pw")
const strengthFill = document.getElementById("strength-fill")
const strengthText = document.getElementById("strength-text")
const entropyText = document.getElementById("entropy")
const crackText = document.getElementById("crack")
const warningText = document.getElementById("warning")
const lengthText = document.getElementById("length")

const toggle = document.getElementById("toggle")
const generate = document.getElementById("generate")
const copy = document.getElementById("copy")
const darkToggle = document.getElementById("dark-toggle")

const reqLength = document.getElementById("req-length")
const reqUpper = document.getElementById("req-upper")
const reqLower = document.getElementById("req-lower")
const reqNumber = document.getElementById("req-number")
const reqSpecial = document.getElementById("req-special")

const commonPasswords = [
"123456","password","12345678","qwerty","abc123","111111","123123"
]

password.addEventListener("input",checkStrength)

function checkStrength(){

let value = password.value
let score = 0

lengthText.textContent = "Length: " + value.length + " characters"

/* Requirement checks */

if(value.length>=8){
score++
reqLength.classList.add("valid")
reqLength.classList.remove("invalid")
}else{
reqLength.classList.add("invalid")
reqLength.classList.remove("valid")
}

if(/[A-Z]/.test(value)){
score++
reqUpper.classList.add("valid")
reqUpper.classList.remove("invalid")
}else{
reqUpper.classList.add("invalid")
reqUpper.classList.remove("valid")
}

if(/[a-z]/.test(value)){
score++
reqLower.classList.add("valid")
reqLower.classList.remove("invalid")
}else{
reqLower.classList.add("invalid")
reqLower.classList.remove("valid")
}

if(/[0-9]/.test(value)){
score++
reqNumber.classList.add("valid")
reqNumber.classList.remove("invalid")
}else{
reqNumber.classList.add("invalid")
reqNumber.classList.remove("valid")
}

if(/[^A-Za-z0-9]/.test(value)){
score++
reqSpecial.classList.add("valid")
reqSpecial.classList.remove("invalid")
}else{
reqSpecial.classList.add("invalid")
reqSpecial.classList.remove("valid")
}

/* Strength meter */

if(score<=2){
strengthFill.style.width="33%"
strengthFill.style.background="red"
strengthText.textContent="Weak Password"
}
else if(score<=4){
strengthFill.style.width="66%"
strengthFill.style.background="orange"
strengthText.textContent="Medium Password"
}
else{
strengthFill.style.width="100%"
strengthFill.style.background="limegreen"
strengthText.textContent="Strong Password"
}

calculateEntropy(value)
checkCommon(value)

}

function calculateEntropy(pass){

let charset = 0

if(/[a-z]/.test(pass)) charset += 26
if(/[A-Z]/.test(pass)) charset += 26
if(/[0-9]/.test(pass)) charset += 10
if(/[^A-Za-z0-9]/.test(pass)) charset += 32

let entropy = Math.round(pass.length * Math.log2(charset || 1))

entropyText.textContent = "Entropy: " + entropy + " bits"

let guesses = Math.pow(2,entropy)
let seconds = guesses / 1000000000

let timeText = ""

if(seconds < 60){
timeText = "seconds"
}
else if(seconds < 3600){
timeText = Math.floor(seconds/60) + " minutes"
}
else if(seconds < 86400){
timeText = Math.floor(seconds/3600) + " hours"
}
else if(seconds < 31536000){
timeText = Math.floor(seconds/86400) + " days"
}
else if(seconds < 3153600000){
timeText = Math.floor(seconds/31536000) + " years"
}
else{
timeText = "centuries"
}

crackText.textContent = "Estimated crack time: " + timeText

}

function checkCommon(pass){

if(commonPasswords.includes(pass)){
warningText.textContent="⚠ This password is commonly used"
warningText.style.color="red"
}
else{
warningText.textContent=""
}

}

/* Show / hide password */

toggle.addEventListener("click",function(){

if(password.type==="password"){
password.type="text"
toggle.textContent="Hide"
}
else{
password.type="password"
toggle.textContent="Show"
}

})

/* Password generator */

generate.addEventListener("click",function(){

let chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
let pass=""

for(let i=0;i<12;i++){
pass += chars[Math.floor(Math.random()*chars.length)]
}

password.value = pass
checkStrength()

})

/* Copy button with notification */

copy.addEventListener("click",function(){

if(password.value === ""){
alert("Enter or generate a password first")
return
}

navigator.clipboard.writeText(password.value)

let note = document.createElement("div")
note.textContent = "Password copied"
note.style.position = "fixed"
note.style.bottom = "30px"
note.style.left = "50%"
note.style.transform = "translateX(-50%)"
note.style.background = "#381932"
note.style.color = "#FFF3E6"
note.style.padding = "10px 18px"
note.style.borderRadius = "8px"
note.style.fontSize = "14px"
note.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)"
note.style.zIndex = "999"

document.body.appendChild(note)

setTimeout(()=>{
note.remove()
},1500)

})

/* Dark mode */

darkToggle.addEventListener("click",function(){

document.body.classList.toggle("dark")

if(document.body.classList.contains("dark")){
darkToggle.textContent="🌚"
}
else{
darkToggle.textContent="🌞"
}

})