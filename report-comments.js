/* Firebase compat SDK and the existing session/helpers are provided by index.html. */
(() => {
  let active = null;
  const emojis = ['❤️', '👍', '😊', '👏', '🎉', '⛰️'];
  const stamp = () => firebase.firestore.FieldValue.serverTimestamp();
  const message = err => err.code === 'permission-denied'
    ? '댓글 권한을 확인하지 못했습니다. 관리자에게 문의해 주세요.'
    : '저장하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.';
  const canManage = row => row.authorUid === getCurrentUid() || isAdmin();
  const dateText = value => value && value.toDate
    ? value.toDate().toLocaleString('ko-KR') : '저장 중…';

  window.stopReportComments = () => {
    if (active && active.unsubscribe) active.unsubscribe();
    if (active) active.reactions.forEach(entry => entry.unsubscribe());
    if (active) active.section.remove();
    active = null;
  };

  // A verifiable pointer lets rules look up the existing randomly keyed member
  // record. The rules check the member's CURRENT grade on every request.
  async function prepareMembership() {
    if (isAdmin()) return;
    const member = membersState.find(m => m.name === getCurrentUser() && m.status === 'regular');
    if (member) await db.collection('commentMemberships').doc(getCurrentUid()).set({memberId: member.id});
  }

  window.mountReportComments = async report => {
    window.stopReportComments();
    const section = document.createElement('section');
    section.className = 'detail-card report-comments';
    section.setAttribute('aria-label', '산행 후기 댓글');
    section.innerHTML = `<h3>댓글</h3>
      <p>이 후기를 볼 수 있는 로그인 회원이 댓글을 작성할 수 있습니다. 광고·도배는 삭제될 수 있습니다.</p>
      <div class="comments-status" role="status" aria-live="polite">댓글을 불러오는 중…</div>
      <div class="comments-list"></div>
      <button type="button" class="btn btn-ghost btn-sm comments-more" hidden>이전 댓글 더 보기</button>
      <form class="comments-form">
        <label for="report-comment-body">${escapeHtml(getCurrentUser())}님의 댓글</label>
        <textarea id="report-comment-body" rows="3" maxlength="2000" required placeholder="산행에 대한 이야기를 남겨 주세요 (최대 2,000자)."></textarea>
        <div class="comment-honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
        <button type="submit" class="btn btn-solid btn-sm" disabled>댓글 등록</button>
      </form>`;
    document.querySelectorAll('.report-comments').forEach(el => el.remove());
    document.getElementById('report-detail-view').append(section);
    const ctx = {reportId: report.id, uid: getCurrentUid(), section, rows: [], limit: 50, ready: false, reactions: new Map()};
    active = ctx;
    const status = section.querySelector('.comments-status');
    const submit = section.querySelector('[type="submit"]');
    const collection = db.collection('reports').doc(report.id).collection('comments');
    const form = section.querySelector('form');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (active !== ctx || !ctx.ready || ctx.busy) return;
      if (form.elements.website.value) return;
      const body = form.querySelector('textarea').value.trim();
      if (!body || body.length > 2000) { status.textContent = '댓글을 1~2,000자로 입력해 주세요.'; return; }
      const liveReport = reportsState.find(r => r.id === ctx.reportId);
      if (!liveReport || ctx.uid !== getCurrentUid() || !canReadReport(liveReport, getCurrentUser())) return;
      ctx.busy = true;
      submit.disabled = true;
      status.textContent = '댓글을 저장하는 중…';
      try {
        const ref = collection.doc();
        const rateRef = db.collection('commentRateLimits').doc(ctx.uid);
        await db.runTransaction(async transaction => {
          const rate = await transaction.get(rateRef);
          if (rate.exists && rate.data().lastWriteAt && Date.now() - rate.data().lastWriteAt.toMillis() < 60000) {
            throw {code: 'comment-rate-limit'};
          }
          transaction.set(ref, {
            authorUid: ctx.uid, authorName: getCurrentUser(), body,
            createdAt: stamp(), updatedAt: stamp(), hidden: false, deleted: false
          });
          transaction.set(rateRef, {lastWriteAt: stamp(), reportId: ctx.reportId, commentId: ref.id});
        });
        if (active === ctx) { form.reset(); status.textContent = '댓글이 등록되었습니다.'; }
      } catch (err) {
        if (active === ctx) status.textContent = err.code === 'comment-rate-limit'
          ? '도배 방지를 위해 댓글 등록·수정 후 1분 뒤 다시 등록해 주세요.' : message(err);
      } finally {
        ctx.busy = false;
        if (active === ctx) submit.disabled = !ctx.ready;
      }
    });

    async function updateRow(row, change, rateLimited = false) {
      if (active !== ctx || ctx.busy || !canManage(row)) return;
      ctx.busy = true;
      submit.disabled = true;
      try {
        const ref = collection.doc(row.id);
        if (rateLimited) {
          const rateRef = db.collection('commentRateLimits').doc(ctx.uid);
          await db.runTransaction(async transaction => {
            const rate = await transaction.get(rateRef);
            if (rate.exists && rate.data().lastWriteAt && Date.now() - rate.data().lastWriteAt.toMillis() < 60000) throw {code: 'comment-rate-limit'};
            transaction.update(ref, {...change, updatedAt: stamp()});
            transaction.set(rateRef, {lastWriteAt: stamp(), reportId: ctx.reportId, commentId: ref.id});
          });
        } else await ref.update({...change, updatedAt: stamp()});
        if (active === ctx) status.textContent = '댓글을 변경했습니다.';
      } catch (err) {
        if (active === ctx) status.textContent = err.code === 'comment-rate-limit'
          ? '댓글 등록·수정 후 1분 뒤 다시 수정해 주세요.' : message(err);
      } finally {
        ctx.busy = false;
        if (active === ctx) submit.disabled = !ctx.ready;
      }
    }

    function reactionBar(row) {
      const bar = document.createElement('div');
      bar.className = 'comment-reactions';
      bar.setAttribute('aria-label', '댓글 이모티콘 반응');
      let entry = ctx.reactions.get(row.id);
      if (!entry) {
        entry = {docs: [], ready: false, busy: false};
        ctx.reactions.set(row.id, entry);
        entry.unsubscribe = collection.doc(row.id).collection('reactions').onSnapshot(snapshot => {
          if (active !== ctx) return;
          entry.docs = snapshot.docs.map(doc => ({uid: doc.id, ...doc.data()}));
          entry.ready = true;
          if (entry.paint) entry.paint();
        }, () => {
          entry.ready = false;
          if (entry.paint) entry.paint();
          if (active === ctx) status.textContent = '반응을 불러오지 못했습니다. 연결과 열람 권한을 확인해 주세요.';
        });
      }
      const picker = document.createElement('div');
      picker.className = 'reaction-picker'; picker.hidden = true;
      picker.setAttribute('aria-label', '이모티콘 선택');
      async function toggle(emoji) {
        if (active !== ctx || !entry.ready || entry.busy) return;
        entry.busy = true; entry.paint();
        try {
          const ref = collection.doc(row.id).collection('reactions').doc(ctx.uid);
          await db.runTransaction(async transaction => {
            const previous = await transaction.get(ref);
            const selected = previous.exists ? previous.data().emojis : [];
            const next = selected.includes(emoji) ? selected.filter(value => value !== emoji) : [...selected, emoji];
            transaction.set(ref, {emojis: next, updatedAt: stamp()});
          });
          picker.hidden = true;
          if (active === ctx) status.textContent = '반응을 변경했습니다.';
        } catch (err) { if (active === ctx) status.textContent = message(err); }
        finally { entry.busy = false; if (active === ctx) entry.paint(); }
      }
      entry.paint = () => {
        const expanded = !picker.hidden;
        bar.replaceChildren(); picker.replaceChildren();
        const mine = entry.docs.find(doc => doc.uid === ctx.uid)?.emojis || [];
        const makeButton = (emoji, count, inPicker) => {
          const button = document.createElement('button');
          button.type = 'button'; button.className = 'reaction-button';
          button.textContent = inPicker ? emoji : `${emoji} ${count}`;
          button.setAttribute('aria-label', `${emoji} 반응${inPicker ? '' : ' '+count+'개'}`);
          button.setAttribute('aria-pressed', String(mine.includes(emoji)));
          button.disabled = !entry.ready || entry.busy;
          button.addEventListener('click', () => toggle(emoji));
          return button;
        };
        emojis.forEach(emoji => {
          const count = entry.docs.filter(doc => doc.emojis.includes(emoji)).length;
          if (emoji === '❤️' || count) bar.append(makeButton(emoji, count, false));
          picker.append(makeButton(emoji, count, true));
        });
        const add = document.createElement('button');
        add.type = 'button'; add.className = 'reaction-button'; add.textContent = '😊 +';
        add.setAttribute('aria-label', '이모티콘 반응 추가');
        add.setAttribute('aria-expanded', String(expanded));
        add.disabled = !entry.ready || entry.busy;
        add.addEventListener('click', () => {
          picker.hidden = !picker.hidden; add.setAttribute('aria-expanded', String(!picker.hidden));
          if (!picker.hidden) picker.querySelector('button').focus();
        });
        picker.onkeydown = event => {
          if (event.key === 'Escape') { picker.hidden = true; add.setAttribute('aria-expanded', 'false'); add.focus(); }
        };
        bar.append(add, picker); picker.hidden = !expanded;
      };
      entry.paint();
      return bar;
    }

    function render() {
      const list = section.querySelector('.comments-list');
      list.replaceChildren();
      if (!ctx.rows.length) list.textContent = '아직 댓글이 없습니다. 첫 댓글을 남겨 주세요!';
      [...ctx.rows].reverse().forEach(row => {
        const article = document.createElement('article');
        article.className = 'comment-item';
        const meta = document.createElement('p');
        meta.className = 'comment-meta';
        meta.textContent = `${row.authorName} · ${dateText(row.createdAt)}`;
        article.append(meta);
        const body = document.createElement('p');
        body.className = 'comment-body';
        body.textContent = row.deleted ? '삭제된 댓글입니다.' : row.hidden ? '관리자가 숨긴 댓글입니다.' : row.body;
        article.append(body);
        const actions = document.createElement('div');
        actions.className = 'comment-actions';
        function button(label, handler) {
          const el = document.createElement('button');
          el.type = 'button'; el.className = 'btn btn-ghost btn-sm'; el.textContent = label;
          el.addEventListener('click', handler); actions.append(el);
        }
        if (!row.deleted && !row.hidden && row.authorUid === ctx.uid) button('수정', () => {
          const editor = document.createElement('textarea');
          editor.maxLength = 2000; editor.rows = 3; editor.value = row.body;
          editor.setAttribute('aria-label', '댓글 수정');
          body.replaceWith(editor); actions.replaceChildren();
          button('저장', () => {
            const text = editor.value.trim();
            if (!text || text.length > 2000) { status.textContent = '댓글을 1~2,000자로 입력해 주세요.'; return; }
            updateRow(row, {body: text}, true);
          });
          button('취소', render); editor.focus();
        });
        if (!row.deleted && canManage(row)) button('삭제', () => {
          if (confirm('이 댓글을 삭제하시겠습니까?')) updateRow(row, {body: '', deleted: true});
        });
        if (!row.deleted && isAdmin()) button(row.hidden ? '다시 표시' : '숨기기', () => updateRow(row, {hidden: !row.hidden}));
        if (!row.deleted && !row.hidden) article.append(reactionBar(row));
        article.append(actions); list.append(article);
      });
    }

    function subscribe() {
      if (ctx.unsubscribe) ctx.unsubscribe();
      ctx.unsubscribe = collection.orderBy('createdAt', 'desc').limit(ctx.limit).onSnapshot(snapshot => {
        if (active !== ctx) return;
        ctx.rows = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const visibleIds = new Set(ctx.rows.filter(row => !row.hidden && !row.deleted).map(row => row.id));
        ctx.reactions.forEach((entry, id) => {
          if (!visibleIds.has(id)) { entry.unsubscribe(); ctx.reactions.delete(id); }
        });
        ctx.ready = true; submit.disabled = !!ctx.busy;
        section.querySelector('.comments-more').hidden = snapshot.size < ctx.limit;
        render();
        if (!ctx.busy) status.textContent = `댓글 ${ctx.rows.length}개${snapshot.size === ctx.limit ? ' (최근 댓글)' : ''}`;
      }, err => {
        if (active !== ctx) return;
        ctx.ready = false; submit.disabled = true;
        section.querySelector('.comments-list').replaceChildren();
        status.textContent = message(err);
      });
    }
    section.querySelector('.comments-more').addEventListener('click', () => { ctx.limit += 50; subscribe(); });
    try {
      if (!isReportPublic(report)) await prepareMembership();
      if (active === ctx) subscribe();
    } catch (err) { if (active === ctx) status.textContent = message(err); }
  };

  // Tear down listeners and private content when navigating or revoking access.
  const detail = document.getElementById('report-detail-view');
  new MutationObserver(() => {
    if (active && detail.style.display !== 'block') {
      active.section.remove(); window.stopReportComments();
    }
  }).observe(detail, {attributes: true, attributeFilter: ['style']});
  window.validateReportComments = () => {
    if (!active) return;
    const report = reportsState.find(row => row.id === active.reportId);
    if (!report || active.uid !== getCurrentUid() || !canReadReport(report, getCurrentUser())) {
      active.section.remove(); window.stopReportComments(); showMainView();
    }
  };
})();
