class AuthCtrl {
  constructor(User, $state, toastr) {
    'ngInject';

    this._User = User;
    this._$state = $state;
    this._toastr = toastr;

    this.title = $state.current.title;
    this.authType = $state.current.name.replace('app.', '');
	
	this.$onInit = function() {
		this.title = 'Sign in';
	}

  }

  submitForm() {
    this.isSubmitting = true;

    this._User.attemptAuth(this.authType, this.formData).then(
      (res) => {
        this._$state.go('baseLogin.list');
      },
      (err) => {
        this.isSubmitting = false;
        this.errors = err.data.errors;
        this._toastr.error('An error occurred while login.', '');
      }
    )
  }
}

export default {
	controller: AuthCtrl,
	templateUrl: 'components/auth/auth.html'
};
