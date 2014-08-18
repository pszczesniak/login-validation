(function (loginForm) {
    "use strict";
    function Loginform(password) {
        this.password = password || "";
    };
    loginForm.Loginform = Loginform;
    Loginform.prototype = {
        enoughRegex: /^.{6,}$/,
        numbers: /\d+/,
        lowerCaseCharacters: /[a-z]+/,
        upperCaseCharacters: /[A-Z]+/,
        rfc2822email: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/,
        passwordErrorsArray: [],
        emailErrorsArray: [],
        passwordState: false,
        emailState: false,
        checkPasswordEmpty: function (password) {
            if (password.length === 0 || !password.trim()) {
                this.passwordErrorsArray.push("Hasło nie może być puste.");
                return false;
            }
            return true;
        },
        checkPasswordLength: function (password) {
            if (false === this.enoughRegex.test(password)) {
                this.passwordErrorsArray.push("Hasło zbyt krótkie - minimum 6 znaków.");
                return false;
            }
            return true;
        },
        checkPasswordContainsNumber: function (password) {
            if (!password.match(this.numbers)) {
                this.passwordErrorsArray.push("Hasło musi zawierać przynajniej jedną cyfrę.");
                return false;
            }
            return true;
        },
        checkPasswordContainsSmallLetter: function (password) {
            if (!password.match(this.lowerCaseCharacters)) {
                this.passwordErrorsArray.push("Hasło musi zawierać przynajniej jedną małą literę.");
                return false;
            }
            return true;
        },
        checkPasswordContainsBigLetter: function (password) {
            if (!password.match(this.upperCaseCharacters)) {
                this.passwordErrorsArray.push("Hasło musi zawierać przynajniej jedną dużą literę.");
                return false;
            }
            return true;
        },
        validatePassword: function (password) {
            this.passwordErrorsArray = [];
            if (!this.checkPasswordEmpty(password)) {
                this.passwordState = false;
            } else if (!this.checkPasswordLength(password)) {
                this.passwordState = false;
            } else {
                var numCheck = this.checkPasswordContainsNumber(password),
                    smallLetterCheck = this.checkPasswordContainsSmallLetter(password),
                    bigCLetterheck = this.checkPasswordContainsBigLetter(password);
                this.passwordState = (numCheck && smallLetterCheck && bigCLetterheck);
                return this.passwordState;
            }
            return this.passwordState;
        },
        checkEmailEmpty: function (email) {
            if (email.length === 0 || !email.trim()) {
                this.emailErrorsArray.push("E-mail nie może być pusty.");
                return false;
            }
            return true;
        },
        checkCorrectEmail: function (email) {
            if (false === this.rfc2822email.test(email)) {
                this.emailErrorsArray.push("Wprowadzony adres nie jest poprawnym adresem e-mail.");
                return false;
            }
            return true;
        },
        validateEmail: function (email) {
            this.emailErrorsArray = [];
            if (!this.checkEmailEmpty(email)) {
                this.emailState = false;
            } else if (false === this.checkCorrectEmail(email)) {
                this.emailState = false;
            } else {
                this.emailState = true;
            }
            return this.emailState;
        },
        removeMessages: function (msgType) {
            var MsgDiv = document.getElementById(msgType + "-messages");
            if (MsgDiv) {
                MsgDiv.parentNode.removeChild(MsgDiv);
            }
        },
        showErrors: function () {
            this.removeMessages('error');
            var concatedErrorsArray = this.emailErrorsArray.concat(this.passwordErrorsArray);
            if (concatedErrorsArray.length !== 0) {
                var divErrorMsg = document.createElement('div'),
                    ul = document.createElement('ul'),
                    form = document.querySelector('form'),
                    li = document.createElement('li'),
                    i = 0;
                divErrorMsg.setAttribute('id', 'error-messages');
                form.insertBefore(divErrorMsg, form.firstChild);
                divErrorMsg.appendChild(ul);
                for (i = 0; i < concatedErrorsArray.length; i++) {
                    li = document.createElement('li');
                    ul.appendChild(li);
                    li.innerHTML = li.innerHTML + concatedErrorsArray[i];
                }
            }
        },
        ajaxRequest: function (email, password, action, callback) {
            var loginData = {email: email, password: password},
                req = new XMLHttpRequest();
            req.open('POST', action, true);
            req.responseType = "text";
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            req.onreadystatechange = function () {
                if (req.readyState === 4) {
                    callback(req.status);
                }
            };
            req.send(JSON.stringify(loginData));
        },
        showResponse: function (status) {
            var responseMessages = {201: "logowanie poprawne", 400: "niepoprawne dane", 401: "niepoprawne login lub hasło", 500: "błąd usługi"};
            if (responseMessages[status]) {
                var parentMessageElement = 'form';
                if (status === 200) {
                    parentMessageElement = '#content';
                }
                try {
                    var divResponseMsg = document.createElement('div'),
                        span = document.createElement('span'),
                        form = document.querySelector(parentMessageElement);
                    divResponseMsg.setAttribute('id', 'response-messages');
                    form.insertBefore(divResponseMsg, form.firstChild);
                    divResponseMsg.appendChild(span);
                    span.innerHTML = responseMessages[status];
                    if (status === 200) {
                        document.querySelector('form').style.display = 'none';
                    }
                } catch(err) {
                    console.log(err.message);
                }
            }
            return responseMessages[status];
        },
        checkPasswordValidation: function (password) {
            this.validatePassword(password);
            this.showErrors();
        },
        checkEmailValidation: function (email) {
            this.validateEmail(email);
            this.showErrors();
        },
        completeAjax: function (email, password, action) {
            this.removeMessages('response');
            var resp = this.ajaxRequest(email, password, action, this.showResponse); 
            return false;
        }
    };
})(this);