export default function validator(field, value, obj) {

    let fieldErrors = obj;
    let firstNameValid = this.state.firstNameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let nicknameValid = this.state.nicknameValid;
    switch (field){
        case 'firstname':
            firstNameValid = value.length > 1;
            fieldErrors.firstname = firstNameValid ? '' : field + ' is too short';
        break;

        case 'email':
            emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            fieldErrors.email = emailValid ? '' : field + ' is not valid';
        break;

        case 'nickname':
            nicknameValid = value.length > 3 && value.match(/^[0-9_a-z-]+$/i);
            fieldErrors.nickname = nicknameValid ? '' : field + ' is not valid';

        break;

        case 'surname':
            fieldErrors.surname = value.length > 1 || value.length === 0? '' : field + ' is too short';
        break;

        case 'password':
            passwordValid = value.length > 6;
            fieldErrors.password =  passwordValid ? '' : field + ' is too short';
        break;

        default:
        break;
    }
    this.setState({formErrors: fieldErrors,
                firstNameValid: firstNameValid,
                passwordValid: passwordValid,
                nicknameValid: nicknameValid,
                emailValid: emailValid}, validForm);

}

function validForm() {
    this.setState({isFormValid: this.state.firstNameValid &&
                                this.state.emailValid &&
                                this.state.passwordValid &&
                                this.state.nicknameValid});
}
