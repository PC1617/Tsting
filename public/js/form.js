// form loading animation

const form = [...document.querySelector('.form').children];

form.forEach((item, i) => {
    setTimeout(() => {
        item.style.opacity = 1;
    }, i*100);
})

window.onload = () => {
    if(sessionStorage.name){
        location.href = '/';
    }
}

// form validation

const name = document.querySelector('.name') || null;
const username = document.querySelector('.username');
const password = document.querySelector('.password');
const submitBtn = document.querySelector('.submit-btn');

if(name == null){ // means login page is open
    submitBtn.addEventListener('click', () => {

        fetch('/login-user',{
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        })
        // .then(res => res.json())
        .then(data => {
          console.log(data);
            if(data=="CredentialsAreValid") {
              console.log("Here");
              // window.navigate("Noice");

              // fetch('/NoiceData',{
              //   method: 'post',
              //   headers: new Headers({'Content-Type': 'application/json'})
              // })

            }
        })

    })
} else{ // means register page is open

    submitBtn.addEventListener('click', () => {
        fetch('/register-user', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                name: name.value,
                password: password.value
                // email: email.value,
            })
        })
        .then(res => res.json())

    })

}

const validateData = (data) => {
    if(!data.name){
        alertBox(data);
    } else{
        sessionStorage.name = data.name;
        location.href = '/';
    }
}

const alertBox = (data) => {
    const alertContainer = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    alertMsg.innerHTML = data;

    alertContainer.style.top = `5%`;
    setTimeout(() => {
        alertContainer.style.top = null;
    }, 5000);
}
