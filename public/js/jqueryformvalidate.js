$(document).ready(function () {
    $('#registerform').validate({ // initialize the plugin
        rules: {
            firstName: {
                required: true,
                minlength: 3,
                signupregex: true,
            },
            username: {
                required: true,
                minlength: 6,
                signupregex: true,
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                pwcheck: true,
                minlength: 8,
            },
            confirmationPassword: {
                required: true,
                equalTo: "#password"
            },
            terms: {
                required: true,
                
            }
        },
    });
},
$('#postEditForm').validate({
    rules: {
        'services[postcode]': {        
            zipcode: true
        }, 'services[name]': {
        required: true
    }, tags: {
        required: true
    }, 'services[description]': {
        required: true
    }, 'services[tel]': {
        required: true,
        phoneStartingWith6: true
    }, 
},
}),

$('#postRegisterForm').validate({
    rules: {
        'services[postcode]': {        
            zipcode: true
        }, 'services[name]': {
        required: true
    }, tags: {
        required: true
    }, 'services[description]': {
        required: true
    }, 'services[tel]': {
        required: true,
        phoneStartingWith6: true
    }, 'services[url]': {
        url: true,
        require: true,
    }
}
})

);
jQuery.extend(jQuery.validator.messages, {
    username: "Username needs to contain min of 6 letters",
    firstName: "This field is required",    
    equalTo: "Please check your value",
    pwcheck: "Password to contain 8 letters, 1 uppercase, 1 lowercase and a digit",
})
$.validator.addMethod("pwcheck", function(value) {
    return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
        && /[a-z]/.test(value) // has a lowercase letter
        && /\d/.test(value) // has a digit
        && /[A-Z]/.test(value) // has a uppercase
 });
 jQuery.validator.addMethod("phoneStartingWith6", function(phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, ""); 
    return this.optional(element) || phone_number.match(/^[6|8|9]\d{7,}$/);
}, "Please enter a valid Phone");

 $.validator.addMethod("signupregex", function(value, element) {
    return this.optional(element) || /^[a-z0-9\-]+$/i.test(value);
}, "Must contain only letters, numbers, or dashes.");

$.validator.addMethod("zipcode", function(value, element) {
    return this.optional(element) || /^\d{6}(?:-\d{4})?$/.test(value);
  }, "Please provide a valid zipcode.");
