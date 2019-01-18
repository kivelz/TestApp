document.getElementById('loginbtnn').addEventListener('click', loginwithFacebook, true)

function loginwithFacebook(e) {
    e.preventDefault()
    FB.login( response => {
        const {authResponse: {accessToken, userID}} = response
        console.log(response)
        fetch('login-with-facebook' ,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({accessToken, userID})
        }).then(res=> {
            console.log(res)
        })

        FB.api('/me', function(response){
            console.log(JSON.stringify(response))
        })
    }, { scope: 'public_profile, email'})
        return false


}

