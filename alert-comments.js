/* Shared comments for existing notices and infos. No document migration needed. */
(() => {
  const sessions = new Map();
  const expanded = new Set();
  const drafts = new Map();
  const keyFor = (source, id) => `${source}/${id}`;
  const stamp = () => firebase.firestore.FieldValue.serverTimestamp();
  const validSource = source => source === 'notices' || source === 'infos';
  const parentExists = (source, id) =>
    (source === 'notices' ? noticesState : infosState).some(row => row.id === id);
  const target = (source, id) => document.getElementById(`alert-comments-${source}-${id}`);
  function setExpanded(box, value) {
    box.hidden = !value;
    const button = box.previousElementSibling;
    if (button) button.setAttribute('aria-expanded', String(value));
  }
  function stop(key) {
    const ctx = sessions.get(key);
    if (!ctx) return;
    const textarea = ctx.box.querySelector('.alert-comment-form textarea');
    if (textarea && ctx.uid) drafts.set(`${ctx.uid}/${key}`, textarea.value);
    if (ctx.unsubscribe) ctx.unsubscribe();
    sessions.delete(key);
  }
  window.stopAlertComments = source => {
    [...sessions.keys()].forEach(key => { if (key.startsWith(source + '/')) stop(key); });
  };
  window.restoreAlertComments = source => {
    [...expanded].forEach(key => {
      if (!key.startsWith(source + '/')) return;
      const id = key.slice(source.length + 1);
      if (!parentExists(source, id)) { expanded.delete(key); return; }
      mount(source, id);
    });
  };
  window.toggleAlertComments = (source, id) => {
    if (!validSource(source) || !parentExists(source, id)) return;
    const key = keyFor(source, id);
    const box = target(source, id);
    if (!box) return;
    if (expanded.has(key)) { expanded.delete(key); stop(key); setExpanded(box, false); }
    else { expanded.add(key); mount(source, id); }
  };
  function mount(source, id) {
    const key = keyFor(source, id);
    const box = target(source, id);
    if (!box) return;
    stop(key);
    setExpanded(box, true);
    box.className = 'alert-comments';
    box.replaceChildren();
    if (!getCurrentUid()) {
      const text = document.createElement('p'); text.textContent = '댓글을 보거나 작성하려면 로그인해 주세요.';
      const login = document.createElement('button'); login.type = 'button';
      login.className = 'btn btn-ghost btn-sm'; login.textContent = '로그인';
      login.onclick = () => openAuthModal(false);
      box.append(text, login); return;
    }
    const ctx = {box, uid: getCurrentUid(), limit: 50, busy: false};
    sessions.set(key, ctx);
    const live = () => sessions.get(key) === ctx && ctx.uid === getCurrentUid();
    const collection = db.collection(source).doc(id).collection('comments');
    const status = document.createElement('p'); status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite'); status.textContent = '댓글을 불러오는 중…';
    const list = document.createElement('div');
    const more = document.createElement('button'); more.type = 'button'; more.hidden = true;
    more.className = 'btn btn-ghost btn-sm'; more.textContent = '이전 댓글 더 보기';
    const form = document.createElement('form'); form.className = 'alert-comment-form';
    const label = document.createElement('label');
    label.textContent = `${getCurrentUser()}님의 댓글`;
    const input = document.createElement('textarea'); input.required = true; input.maxLength = 2000;
    input.placeholder = '댓글을 입력해 주세요. 웹 주소와 YouTube 링크를 붙여 넣을 수 있습니다.';
    input.value = drafts.get(`${ctx.uid}/${key}`) || '';
    input.oninput = () => drafts.set(`${ctx.uid}/${key}`, input.value);
    label.append(input);
    const submit = document.createElement('button'); submit.type = 'submit';
    submit.className = 'btn btn-solid btn-sm'; submit.textContent = '댓글 등록';
    form.append(label, submit); box.append(status, list, more, form);
    function failed(err) {
      console.error('알림글 댓글 오류:', err);
      status.textContent = err.code === 'permission-denied'
        ? '댓글 권한을 확인해 주세요. 새 댓글 기능의 Firestore 규칙 적용이 필요할 수 있습니다.'
        : '댓글을 처리하지 못했습니다. 연결을 확인하고 댓글을 닫았다가 다시 열어 주세요.';
    }
    async function write(action) {
      if (!live() || ctx.busy) return;
      ctx.busy = true; submit.disabled = true;
      try { await action(); if (live()) status.textContent = '저장했습니다.'; }
      catch (err) { if (live()) failed(err); }
      finally { ctx.busy = false; if (live()) submit.disabled = false; }
    }
    form.onsubmit = event => {
      event.preventDefault();
      const body = input.value.trim();
      if (!body || body.length > 2000) return;
      write(async () => {
        await collection.add({authorUid: ctx.uid, authorName: getCurrentUser(), body,
          createdAt: stamp(), updatedAt: stamp()});
        drafts.delete(`${ctx.uid}/${key}`);
        if (live()) input.value = '';
      });
    };
    function render(rows) {
      list.replaceChildren();
      if (!rows.length) list.textContent = '아직 댓글이 없습니다.';
      [...rows].reverse().forEach(row => {
        const article = document.createElement('article'); article.className = 'comment-item';
        const meta = document.createElement('p'); meta.className = 'comment-meta';
        const when = row.createdAt && typeof row.createdAt.toDate === 'function'
          ? row.createdAt.toDate().toLocaleString('ko-KR') : '저장 중…';
        meta.textContent = `${row.authorName || '회원'} · ${when}`;
        const body = document.createElement('div'); body.className = 'comment-body';
        body.innerHTML = renderCommentContent(row.body);
        const actions = document.createElement('div'); actions.className = 'comment-actions';
        const button = (name, handler) => {
          const el = document.createElement('button'); el.type = 'button';
          el.className = 'btn btn-ghost btn-sm'; el.textContent = name;
          el.onclick = handler; actions.append(el);
        };
        if (row.authorUid === ctx.uid) button('수정', () => {
          const editor = document.createElement('textarea'); editor.maxLength = 2000;
          editor.value = row.body; editor.setAttribute('aria-label', '댓글 수정');
          body.replaceChildren(editor); actions.replaceChildren();
          button('저장', () => {
            const value = editor.value.trim();
            if (value && value.length <= 2000) write(() => collection.doc(row.id).update({body: value, updatedAt: stamp()}));
          });
          button('취소', () => render(rows)); editor.focus();
        });
        if (row.authorUid === ctx.uid || isAdmin()) button('삭제', () => {
          if (confirm('댓글을 삭제하시겠습니까?')) write(() => collection.doc(row.id).delete());
        });
        article.append(meta, body, actions); list.append(article);
      });
    }
    function subscribe() {
      if (ctx.unsubscribe) ctx.unsubscribe();
      ctx.unsubscribe = collection.orderBy('createdAt', 'desc').limit(ctx.limit).onSnapshot(snapshot => {
        if (!live()) return;
        render(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
        more.hidden = snapshot.size < ctx.limit;
        status.textContent = `댓글 ${snapshot.size}개${snapshot.size === ctx.limit ? ' (최근 댓글)' : ''}`;
      }, err => { if (live()) { more.hidden = true; failed(err); } });
    }
    more.onclick = () => { ctx.limit += 50; subscribe(); };
    subscribe();
  }
})();
