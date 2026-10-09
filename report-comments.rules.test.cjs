const {initializeTestEnvironment, assertSucceeds, assertFails} = require('@firebase/rules-unit-testing');
const {doc, collection, getDoc, getDocs, setDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp, Timestamp} = require('firebase/firestore');
const fs = require('node:fs');
let env, passed=0;
async function check(name, action) { await action(); console.log('PASS '+name); passed++; }
async function seed(path,data) { await env.withSecurityRulesDisabled(c=>setDoc(doc(c.firestore(),path),data)); }
async function resetRate(uid) { await seed('commentRateLimits/'+uid,{lastWriteAt:Timestamp.fromMillis(Date.now()-120000),reportId:'public',commentId:'seed'}); }
function body(uid,extra={}) {return {authorUid:uid,authorName:uid,body:'첫 줄\n둘째 줄',createdAt:serverTimestamp(),updatedAt:serverTimestamp(),hidden:false,deleted:false,...extra};}
function post(db,uid,id,extra={}) {const batch=writeBatch(db);batch.set(doc(db,'reports/public/comments/'+id),body(uid,extra));batch.set(doc(db,'commentRateLimits/'+uid),{lastWriteAt:serverTimestamp(),reportId:'public',commentId:id});return batch.commit();}
function edit(db,uid,id,text) {const batch=writeBatch(db);batch.update(doc(db,'reports/public/comments/'+id),{body:text,updatedAt:serverTimestamp()});batch.set(doc(db,'commentRateLimits/'+uid),{lastWriteAt:serverTimestamp(),reportId:'public',commentId:id});return batch.commit();}
(async()=>{
 env=await initializeTestEnvironment({projectId:'demo-ihiker-comments',firestore:{host:'127.0.0.1',port:8088,rules:fs.readFileSync('firestore.rules','utf8')}});
 const anon=env.unauthenticatedContext().firestore();
 const member=env.authenticatedContext('member').firestore(), regular=env.authenticatedContext('regular').firestore();
 const other=env.authenticatedContext('other').firestore(), admin=env.authenticatedContext('admin').firestore();
 for(const uid of ['member','regular','other','admin']) await seed('users/'+uid,{nickname:uid,role:uid==='admin'?'admin':'member'});
 await seed('members/reg',{name:'regular',ownerUid:'regular',status:'regular'});
 await seed('reports/public',{title:'공개',visibility:'all'});await seed('reports/private',{title:'전용',visibility:'regular'});
 await check('anonymous read denied',()=>assertFails(getDocs(collection(anon,'reports/public/comments'))));
 await check('anonymous write denied',()=>assertFails(post(anon,'member','anonymous')));
 await check('new member public read allowed',()=>assertSucceeds(getDocs(collection(member,'reports/public/comments'))));
 await check('new member private read denied',()=>assertFails(getDocs(collection(member,'reports/private/comments'))));
 await check('regular member pointer accepted',()=>assertSucceeds(setDoc(doc(regular,'commentMemberships/regular'),{memberId:'reg'})));
 await check('other member pointer rejected',()=>assertFails(setDoc(doc(other,'commentMemberships/other'),{memberId:'reg'})));
 await check('regular private read allowed',()=>assertSucceeds(getDocs(collection(regular,'reports/private/comments'))));
 await check('admin private read allowed',()=>assertSucceeds(getDocs(collection(admin,'reports/private/comments'))));
 await check('nickname impersonation denied',()=>assertFails(updateDoc(doc(member,'users/member'),{nickname:'regular'})));
 await check('role escalation denied',()=>assertFails(updateDoc(doc(member,'users/member'),{role:'admin'})));
 await check('member rename denied',()=>assertFails(updateDoc(doc(regular,'members/reg'),{name:'other'})));
 await check('member owner transfer denied',()=>assertFails(updateDoc(doc(regular,'members/reg'),{ownerUid:'other'})));
 await check('direct unthrottled create denied',()=>assertFails(setDoc(doc(member,'reports/public/comments/direct'),body('member'))));
 await check('atomic multiline comment accepted',()=>assertSucceeds(post(member,'member','first')));
 await check('repeat create denied',()=>assertFails(post(member,'member','too-soon')));
 await check('cooldown edit denied',()=>assertFails(edit(member,'member','first','수정')));
 await check('rate delete denied',()=>assertFails(deleteDoc(doc(member,'commentRateLimits/member'))));
 await resetRate('member');
 await check('own edit after cooldown allowed',()=>assertSucceeds(edit(member,'member','first','수정 완료')));
 await resetRate('other');
 await check('other author edit denied',()=>assertFails(edit(other,'other','first','타인 수정')));
 await check('other author deletion denied',()=>assertFails(updateDoc(doc(other,'reports/public/comments/first'),{deleted:true,body:'',updatedAt:serverTimestamp()})));
 await resetRate('member');
 await check('oversize rejected',()=>assertFails(post(member,'member','oversize',{body:'a'.repeat(2001)})));
 await check('whitespace rejected',()=>assertFails(post(member,'member','whitespace',{body:' \n\t '})));
 await check('author spoof rejected',()=>assertFails(post(member,'member','spoof',{authorName:'admin'})));
 await check('unexpected field rejected',()=>assertFails(post(member,'member','extra',{role:'admin'})));
 await check('admin hide allowed',()=>assertSucceeds(updateDoc(doc(admin,'reports/public/comments/first'),{hidden:true,updatedAt:serverTimestamp()})));
 await check('hidden author edit denied',()=>assertFails(edit(member,'member','first','숨김 우회')));
 await check('admin restore allowed',()=>assertSucceeds(updateDoc(doc(admin,'reports/public/comments/first'),{hidden:false,updatedAt:serverTimestamp()})));
 await check('own delete allowed',()=>assertSucceeds(updateDoc(doc(member,'reports/public/comments/first'),{deleted:true,body:'',updatedAt:serverTimestamp()})));
 await check('deleted resurrection denied',()=>assertFails(updateDoc(doc(member,'reports/public/comments/first'),{deleted:false,body:'복원',updatedAt:serverTimestamp()})));
 await check('hard delete denied',()=>assertFails(deleteDoc(doc(admin,'reports/public/comments/first'))));
 await seed('members/reg',{name:'regular',ownerUid:'regular',status:'three'});
 await check('demoted member read denied',()=>assertFails(getDocs(collection(regular,'reports/private/comments'))));
 console.log(`RESULT ${passed} security checks passed`);
})().catch(err=>{console.error(err);process.exitCode=1}).finally(async()=>{if(env)await env.cleanup()});
