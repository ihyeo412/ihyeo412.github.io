/* Uses the existing Firebase Auth instance; recovery emails stay in Auth. */
(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'modal'; dialog.id = 'password-recovery-modal';
  dialog.innerHTML = `<form class="modal-box">
    <div class="modal-head"><h3 id="recovery-title"></h3><button type="button" class="close-btn" aria-label="닫기">×</button></div>
    <p id="recovery-help"></p>
    <div class="form-grid">
      <label class="full"><span>이메일</span><input id="recovery-email" type="email" required autocomplete="email" placeholder="받을 수 있는 실제 이메일"></label>
      <label class="full" id="recovery-password-label"><span>현재 비밀번호</span><input id="recovery-password" type="password" autocomplete="current-password"></label>
    </div>
    <p id="recovery-status" role="status" aria-live="polite" style="white-space:pre-line"></p>
    <div class="modal-foot"><button type="button" class="btn btn-ghost btn-sm" id="recovery-cancel">닫기</button><button type="submit" class="btn btn-solid btn-sm" id="recovery-send"></button></div>
  </form>`;
  document.body.append(dialog);
  const form = dialog.querySelector('form'), email = dialog.querySelector('#recovery-email');
  const password = dialog.querySelector('#recovery-password'), status = dialog.querySelector('#recovery-status');
  const submit = dialog.querySelector('#recovery-send');
  let connecting = false, busy = false;
  const realEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !value.toLowerCase().endsWith('.invalid');
  function open(connect) {
    if (busy) return;
    connecting = connect;
    form.reset(); status.textContent = ''; submit.disabled = false;
    dialog.querySelector('#recovery-title').textContent = connect ? '비밀번호 복구용 이메일 연결' : '비밀번호 재설정';
    dialog.querySelector('#recovery-help').textContent = connect
      ? '이메일의 확인 링크를 눌러야 연결이 완료됩니다. 완료 후에는 닉네임 대신 이 이메일로 로그인하세요. 닉네임과 회원 등급, 기존 글은 그대로 유지됩니다.'
      : '계정에 연결한 이메일로 재설정 링크를 요청하세요. 아직 이메일을 연결하지 않았다면, 비밀번호를 기억할 때 로그인 후 [이메일 연결]을 해 주세요. 이미 비밀번호를 잊었다면 운영진에게 본인 확인을 요청해 주세요.';
    dialog.querySelector('#recovery-password-label').hidden = !connect;
    password.required = connect; password.disabled = !connect;
    submit.textContent = connect ? '이메일 확인 링크 보내기' : '재설정 링크 보내기';
    if (connect && auth.currentUser && realEmail(auth.currentUser.email || '')) email.value = auth.currentUser.email;
    document.getElementById('auth-modal').close();
    dialog.showModal(); email.focus();
  }
  window.openPasswordRecovery = () => open(false);
  window.openRecoveryEmail = () => {
    if (!auth.currentUser) { window.openAuthModal(false); return; }
    open(true);
  };
  dialog.querySelector('.close-btn').onclick = () => dialog.close();
  dialog.querySelector('#recovery-cancel').onclick = () => dialog.close();
  dialog.addEventListener('close', () => { password.value = ''; });
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (busy) return;
    const address = email.value.trim();
    if (!realEmail(address)) { status.textContent = '메일을 받을 수 있는 실제 이메일을 입력해 주세요.'; return; }
    busy = true; submit.disabled = true; status.textContent = '요청하는 중…';
    const mode = connecting;
    try {
      auth.languageCode = 'ko';
      if (mode) {
        const user = auth.currentUser;
        if (!user) throw {code: 'auth/requires-recent-login'};
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, password.value);
        await user.reauthenticateWithCredential(credential);
        await user.verifyBeforeUpdateEmail(address);
        password.value = '';
        status.textContent = '확인 이메일을 보냈습니다. 스팸함도 확인해 주세요. 이메일의 링크에서 연결을 완료한 다음, 이 이메일로 다시 로그인하세요.';
      } else {
        try { await auth.sendPasswordResetEmail(address); }
        catch (error) { if (error.code !== 'auth/user-not-found') throw error; }
        status.textContent = '연결된 계정이 있으면 재설정 이메일이 발송됩니다. 받은 편지함과 스팸함을 확인해 주세요.';
      }
    } catch (error) {
      status.textContent = error.code === 'auth/too-many-requests'
        ? '요청이 많습니다. 잠시 후 다시 시도해 주세요.'
        : mode && ['auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials'].includes(error.code)
          ? '현재 비밀번호가 일치하지 않습니다.'
          : mode && error.code === 'auth/email-already-in-use'
            ? '이 이메일은 다른 계정에서 사용 중입니다. 다른 이메일을 입력해 주세요.'
            : error.code === 'auth/requires-recent-login'
              ? '다시 로그인한 후 이메일을 연결해 주세요.'
              : '요청하지 못했습니다. 이메일과 연결 상태를 확인한 뒤 다시 시도해 주세요.';
    } finally { password.value = ''; busy = false; submit.disabled = false; }
  });
})();
