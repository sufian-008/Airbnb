
<!-- Include Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Example Form -->
<form class="needs-validation" novalidate>
  <div class="mb-3">
    <label for="inputEmail" class="form-label">Email address</label>
    <input type="email" class="form-control" id="inputEmail" required>
    <div class="invalid-feedback">
      Please provide a valid email.
    </div>
  </div>

  <div class="mb-3">
    <label for="inputPassword" class="form-label">Password</label>
    <input type="password" class="form-control" id="inputPassword" required minlength="6">
    <div class="invalid-feedback">
      Please enter a password (minimum 6 characters).
    </div>
  </div>

  <button type="submit" class="btn btn-primary">Submit</button>
</form>

<!-- JavaScript for Bootstrap validation -->
<script>
(() => {
  'use strict';

  // Fetch all the forms with class 'needs-validation'
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over each form and apply validation logic
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      // If the form is invalid, prevent submission
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Add Bootstrap's validation style
      form.classList.add('was-validated');
    }, false);
  });
})();
</script>

<!-- Optional: Include Bootstrap JS (not required for validation itself) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>


  

