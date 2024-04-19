// USER object
const user = {
    name: '',
    email: '',
    phone: ''
}

const startQuiz = async () => {
    // To start quiz, First user will fill the form
    // Collecting form data

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Validating form data
    if(!name || !email || !phone){
        toast('Please fill all the fields', 'error')
        return;
    }
    if(phone.length !== 10){
        toast('Please enter a valid phone number', 'error')
        return;
    }
    if(!emailValidation(email)){
        toast('Please enter a valid email', 'error')
        return;
    }
    // If all the data is valid, start the quiz
    // Store the user details in an global object user
    user.name = name;
    user.email = email;
    user.phone = phone;


    // Make API call to fetch the questions (GET at /api/quiz)
    const url = '/api/quiz';
    const res = await fetch(url);
    const quiz = await res.json();

    // quiz is an array of questions
    const parentQuestions = document.querySelector('.questions');
    quiz.forEach((ques, idx) => {
        const question = generateQuestionHTML(ques, idx);
        parentQuestions.innerHTML += question;
    })

    // Hide the form
    const form = document.querySelector('#user-info');
    form.classList.add('hidden');
    // Show the questions
    const quizSection = document.querySelector('#quiz');
    toast('Quiz Started', 'success')
    quizSection.classList.remove('hidden');
    return;
}

// On click of Submit Button
const submitQuiz = async () => {
    // Collecting the answers
    // answer is an array of strings of selected options, empty string if not selected
    const answers = [];
    for(let i=1; i<=10; i++){
        const radios = document.querySelectorAll(`input[name=q${i}]`);
        let ans = '';
        radios.forEach(radio => {
            if(radio.checked){
                ans = radio.value;
            }
        })
        answers.push(ans);
    }
    // Make API call to submit the quiz (POST at /api/quiz)
    // This API will give us the result JSON
    const url = '/api/quiz';
    const data = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        answers
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    // Show the result
    const resultSection = document.querySelector("#results")
    const resultHTML = generateResult(result)
    resultSection.innerHTML = resultHTML;
    toast("Results Generated", "success")
    resultSection.classList.remove('hidden')
    resultSection.scrollIntoView({behavior: 'smooth'})
}

// Function to start toaster
const toast = (message, status) => {
    // Show toaster
    const toaster = document.querySelector('.toaster')
    const toast = document.querySelector('.toast')
    toast.innerText = message
    // Remove the class hidden
    toaster.classList.remove('hidden')
    if(status === 'error'){
        toast.classList.add('colorRed')
    }
    else if(status === 'success'){
        toast.classList.add('colorGreen')
    }
    else{
        toast.classList.add('colorBlue')
    }
    // After 3 secs add the class hidden
    setTimeout(() => {
        toaster.classList.add('hidden')
    }, 3000)
    return;
}

// Function to validate email
const emailValidation = (email) => {
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
    return emailRegex.test(email)
}

// Function to generate HTML for each question
const generateQuestionHTML = (ques, idx) => {
    const qTxt = ques.question;
    const options = {
        a: ques.a,
        b: ques.b,
        c: ques.c,
        d: ques.d
    }
    const question = `
        <div id="q${idx+1}">
            <h3>Question ${idx+1}</h3>
            <div class="ques">
                <p>${qTxt}</p>
                <div class="options">
                    <label>
                        <input type="radio" name="q${idx+1}" value="a">
                        ${options.a}
                    </label>
                    <label>
                        <input type="radio" name="q${idx+1}" value="b">
                        ${options.b}
                    </label>
                    <label>
                        <input type="radio" name="q${idx+1}" value="c">
                        ${options.c}
                    </label>
                    <label>
                        <input type="radio" name="q${idx+1}" value="d">
                        ${options.d}
                    </label>
                </div>
                <div class="btns">
                    <button onclick="cancel(${idx+1})" class="colorGreen">Cancel</button>
                    <button onclick="next(${idx+1})" class="colorBlue" ${(idx+1) == 10 ? 'disabled' : ''}>Save and Next</button>
                </div>
            </div>
        </div>
    `
    return question;
}

// Function to generate HTML for result
const generateResult = (res) => {
    const user = res.user;
    const score = res.score;
    const quizResult = res.quizResult;
    const correctAnswers = quizResult.correctAnswers;
    const wrongAnswers = quizResult.wrongAnswers;
    const unAttempted = quizResult.unAttempted;
    const color = colorChooser(score);

    const resultHTML = `
        <div class="res_user">
            <h2>User Details</h2>
            <div class="detail">
                <div>
                    <label for="name">Name:</label>
                    <span id="res_name">${user?.name}</span>
                </div>
                <div>
                    <label for="email">Email:</label>
                    <span id="res_email">${user?.email}</span>
                </div>
                <div>
                    <label for="phone">Phone:</label>
                    <span id="res_phone">${user?.phone}</span>
                </div>
            </div>
        </div>

        <div class="res_score ${color}">
            <div id="score">${score}</div>
        </div>

        <div class="user_answers">
            <div class="correct_answers">
                <h2>Correct Answers</h2>
                <ul id="correct_answers">
                    ${correctAnswers.map((ans, idx) => {
                        return `<li class="colorGreen" onclick="next(${ans})">Question ${ans+1}</li>`
                    })}
                </ul>
            </div>
            <div class="wrong_answers">
                <h2>Wrong Answers</h2>
                <ul id="wrong_answers">
                    ${wrongAnswers.map((ans, idx) => {
                        return `<li class="colorRed" onclick="next(${ans})">Question ${ans+1}</li>`
                    })}
                </ul>
            </div>
            <div class="unattempted_answers">
                <h2>Unattempted Answers</h2>
                <ul id="unattempted_answers">
                    ${unAttempted.map((ans, idx) => {
                        return `<li class="colorYellow" onclick="next(${ans})">Question ${ans+1}</li>`
                    })}
                </ul>
            </div>
        </div>
    `
    return resultHTML;
}

// Cancel button to deselect the selected radio
const cancel = (idx) => {
    const radios = document.querySelectorAll(`input[name=q${idx}]`);
    radios.forEach(radio => {
        radio.checked = false;
    })
}

// Next button to scrollIntoView the next question
const next = (idx) => {
    const nextQ = document.getElementById(`q${(idx+1)}`);
    nextQ.scrollIntoView({behavior: 'smooth'});
}

// Function to choose color based on score
const colorChooser = (score) => {
    if(score >= 80){
        return 'colorGreen'
    }
    else if(score >= 50){
        return 'colorBlue'
    }
    else{
        return 'colorRed'
    }
}