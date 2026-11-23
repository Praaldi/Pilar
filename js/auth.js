function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

function checkPasswordStrength(password) {
  const bars = [
    document.getElementById('strengthBar1'),
    document.getElementById('strengthBar2'),
    document.getElementById('strengthBar3'),
    document.getElementById('strengthBar4')
  ];
  const textEl = document.getElementById('strengthText');

  if (!bars[0]) return; 

  
  bars.forEach(bar => bar.className = 'password-strength-bar');

  if (password.length === 0) {
    textEl.textContent = '';
    return;
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  const levels = [
    { count: 1, cls: 'weak', text: 'Lemah - tambahkan huruf besar, angka, dan simbol' },
    { count: 2, cls: 'weak', text: 'Kurang kuat - tambahkan variasi karakter' },
    { count: 3, cls: 'medium', text: 'Cukup kuat' },
    { count: 4, cls: 'strong', text: 'Sangat kuat!' }
  ];

  const level = levels[score - 1] || levels[0];

  for (let i = 0; i < level.count; i++) {
    bars[i].classList.add(level.cls);
  }
  textEl.textContent = level.text;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAlert(elementId, message, type) {
  const alert = document.getElementById(elementId);
  if (!alert) return;

  alert.className = `auth-alert ${type}`;
  alert.innerHTML = `${type === 'success' ? '✅' : '❌'} ${message}`;
  alert.style.display = 'flex';

  
  setTimeout(() => {
    alert.style.display = 'none';
  }, 5000);
}

function showFieldError(inputId, errorId, show) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;

  if (show) {
    input.classList.add('error');
    error.classList.add('show');
  } else {
    input.classList.remove('error');
    error.classList.remove('show');
  }
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  let valid = true;

  
  if (!isValidEmail(email)) {
    showFieldError('loginEmail', 'loginEmailError', true);
    valid = false;
  } else {
    showFieldError('loginEmail', 'loginEmailError', false);
  }

  
  if (password.length < 6) {
    showFieldError('loginPassword', 'loginPasswordError', true);
    valid = false;
  } else {
    showFieldError('loginPassword', 'loginPasswordError', false);
  }

  if (!valid) return;

  
  const submitBtn = document.getElementById('loginSubmit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Memproses...';

  setTimeout(() => {
    
    const users = JSON.parse(localStorage.getItem('pilar_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      
      localStorage.setItem('pilar_session', JSON.stringify({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        loggedIn: true
      }));

      showAlert('loginAlert', `Selamat datang kembali, ${user.firstName}!`, 'success');

      
      setTimeout(() => {
        const role = user.role;
        if (role === 'admin') {
          window.location.href = 'dashboard-admin.html';
        } else if (role === 'lembaga') {
          window.location.href = 'dashboard-lembaga.html';
        } else {
          
          window.location.href = 'dashboard-siswa.html';
        }
      }, 1500);
    } else {
      showAlert('loginAlert', 'Email atau kata sandi tidak valid.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Masuk';
    }
  }, 1200);
}

function handleRegister(event) {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const role = document.getElementById('userRole').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const agreeTerms = document.getElementById('agreeTerms').checked;

  let valid = true;

  
  if (!isValidEmail(email)) {
    showFieldError('registerEmail', 'registerEmailError', true);
    valid = false;
  } else {
    showFieldError('registerEmail', 'registerEmailError', false);
  }

  
  if (password !== confirmPassword) {
    showFieldError('confirmPassword', 'confirmPasswordError', true);
    valid = false;
  } else {
    showFieldError('confirmPassword', 'confirmPasswordError', false);
  }

  
  if (password.length < 8) {
    showAlert('registerAlert', 'Kata sandi minimal 8 karakter.', 'error');
    valid = false;
  }

  
  if (!agreeTerms) {
    showAlert('registerAlert', 'Anda harus menyetujui syarat & ketentuan.', 'error');
    valid = false;
  }

  if (!valid) return;

  
  const submitBtn = document.getElementById('registerSubmit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Mendaftarkan...';

  setTimeout(() => {
    
    const users = JSON.parse(localStorage.getItem('pilar_users') || '[]');
    const exists = users.find(u => u.email === email);

    if (exists) {
      showAlert('registerAlert', 'Email sudah terdaftar. Silakan gunakan email lain.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Buat Akun';
      return;
    }

    
    users.push({
      firstName,
      lastName,
      email,
      role,
      password,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('pilar_users', JSON.stringify(users));

    showAlert('registerAlert', 'Akun berhasil dibuat! Mengalihkan ke halaman login...', 'success');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  }, 1500);
}

function socialLogin(provider) {
  showAlert(
    document.getElementById('loginAlert') ? 'loginAlert' : 'registerAlert',
    `Login dengan ${provider.charAt(0).toUpperCase() + provider.slice(1)} belum tersedia saat ini.`,
    'error'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  
  const loginEmail = document.getElementById('loginEmail');
  if (loginEmail) {
    loginEmail.addEventListener('blur', function () {
      showFieldError('loginEmail', 'loginEmailError', !isValidEmail(this.value) && this.value.length > 0);
    });
    loginEmail.addEventListener('input', function () {
      if (isValidEmail(this.value)) {
        showFieldError('loginEmail', 'loginEmailError', false);
      }
    });
  }

  
  const registerEmail = document.getElementById('registerEmail');
  if (registerEmail) {
    registerEmail.addEventListener('blur', function () {
      showFieldError('registerEmail', 'registerEmailError', !isValidEmail(this.value) && this.value.length > 0);
    });
    registerEmail.addEventListener('input', function () {
      if (isValidEmail(this.value)) {
        showFieldError('registerEmail', 'registerEmailError', false);
      }
    });
  }

  const confirmPassword = document.getElementById('confirmPassword');
  if (confirmPassword) {
    confirmPassword.addEventListener('input', function () {
      const password = document.getElementById('registerPassword').value;
      showFieldError('confirmPassword', 'confirmPasswordError',
        this.value.length > 0 && this.value !== password
      );
    });
  }
});

console.log('PILAR - Auth module loaded successfully');
