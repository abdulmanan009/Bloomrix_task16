const $ = (selector) => document.querySelector(selector);
const labels = { active: 'In progress', completed: 'Completed', paused: 'On hold' };
let projects = [
  { name: 'Website redesign', category: 'Design · Web experience', owner: 'Sarah Chen', status: 'active', progress: 68, budget: 12500, due: '2026-11-28' },
  { name: 'Mobile app launch', category: 'Product · Mobile', owner: 'Marcus Johnson', status: 'active', progress: 42, budget: 24000, due: '2026-12-15' },
  { name: 'Brand guidelines', category: 'Design · Identity', owner: 'Alex Lee', status: 'completed', progress: 100, budget: 4800, due: '2026-11-05' },
  { name: 'Customer portal', category: 'Engineering · Platform', owner: 'Emily Wilson', status: 'active', progress: 24, budget: 18000, due: '2026-12-20' },
  { name: 'Marketing campaign', category: 'Marketing · Growth', owner: 'James Miller', status: 'paused', progress: 56, budget: 8200, due: '2026-11-30' },
  { name: 'Analytics integration', category: 'Engineering · Data', owner: 'Olivia Brown', status: 'completed', progress: 100, budget: 6500, due: '2026-11-02' }
];
try { const saved = JSON.parse(localStorage.getItem('workspace-projects')); if (Array.isArray(saved) && saved.every(p => typeof p.name === 'string' && typeof p.owner === 'string' && p.status in labels && Number.isFinite(p.budget) && Number.isFinite(p.progress) && !isNaN(Date.parse(p.due)))) projects = saved; } catch { /* Keep demo data if storage is unavailable. */ }
const currency = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const initials = name => name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
function node(tag, className, text) { const el = document.createElement(tag); el.className = className; if (text !== undefined) el.textContent = text; return el; }
function render() {
  $('#total-count').textContent = projects.length;
  $('#active-count').textContent = projects.filter(p => p.status === 'active').length;
  $('#completed-count').textContent = projects.filter(p => p.status === 'completed').length;
  $('#budget-count').textContent = currency(projects.reduce((sum, p) => sum + p.budget, 0));
  $('#project-count').textContent = projects.length;
  const query = $('#search').value.trim().toLowerCase();
  const filtered = projects.filter(p => `${p.name} ${p.owner}`.toLowerCase().includes(query) && ($('#status-filter').value === 'all' || p.status === $('#status-filter').value));
  if ($('#sort').value === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name));
  if ($('#sort').value === 'budget') filtered.sort((a,b) => b.budget-a.budget);
  $('#project-rows').replaceChildren(...filtered.map((p, i) => {
    const row = node('tr', 'project-row'); const title = node('td', ''); const titleWrap = node('div', 'project');
    titleWrap.append(node('span', `project__icon project__icon--${i % 3}`, p.name.slice(0,1))); const copy = node('div', 'project__copy'); copy.append(node('strong', '', p.name), node('small', '', p.category || 'Workspace · Project')); titleWrap.append(copy); title.append(titleWrap);
    const owner = node('td', ''); const ownerWrap = node('div', 'owner'); ownerWrap.append(node('span','avatar avatar--small',initials(p.owner)), node('span','',p.owner)); owner.append(ownerWrap);
    const status = node('td',''); status.append(node('span',`badge badge--${p.status}`,labels[p.status]));
    const progress = node('td',''); const progressWrap = node('div','progress'); const meter = node('progress',''); meter.max = 100; meter.value = p.progress; meter.setAttribute('aria-label',`${p.name} progress`); progressWrap.append(meter,node('span','',`${p.progress}%`)); progress.append(progressWrap);
    row.append(title,owner,status,progress,node('td','budget',currency(p.budget)),node('td','date',new Date(`${p.due}T00:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}))); return row;
  }));
  $('#empty').hidden = filtered.length > 0; $('#results').textContent = `Showing ${filtered.length} of ${projects.length} projects`;
}
['#search','#status-filter','#sort'].forEach(id => $(id).addEventListener('input',render));
$('#clear-filters').onclick = () => { $('#search').value = ''; $('#status-filter').value = 'all'; render(); };
$('#menu-toggle').onclick = () => { const open = $('#sidebar').classList.toggle('sidebar--open'); $('#menu-toggle').setAttribute('aria-expanded',open); };
document.querySelectorAll('.sidebar__link').forEach(link => link.onclick = () => { $('#sidebar').classList.remove('sidebar--open'); $('#menu-toggle').setAttribute('aria-expanded','false'); });
try { document.documentElement.dataset.theme = localStorage.getItem('workspace-theme') || 'light'; } catch {}
$('#theme-toggle').onclick = () => { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; try { localStorage.setItem('workspace-theme',theme); } catch {} };
const modal = $('#project-modal');
$('#new-project').onclick = () => { $('#form-error').textContent = ''; modal.showModal(); };
$('#close-modal').onclick = $('#cancel-modal').onclick = () => modal.close();
modal.onclick = event => { if(event.target === modal) { const r = modal.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) modal.close(); } };
$('#project-form').onsubmit = async event => {
  event.preventDefault(); const form = event.currentTarget; form.classList.add('is-validated');
  if (!form.checkValidity() || !form.elements.name.value.trim() || !form.elements.owner.value.trim()) { $('#form-error').textContent = 'Please complete all fields, use a valid budget and confirm the details.'; form.reportValidity(); return; }
  const submit = $('#submit-project'); submit.disabled = true; submit.textContent = 'Creating…';
  await new Promise(resolve => setTimeout(resolve,450));
  const data = new FormData(form); projects.unshift({name:data.get('name').trim(),owner:data.get('owner').trim(),budget:Number(data.get('budget')),due:data.get('due'),status:data.get('status'),progress:data.get('status') === 'completed' ? 100 : 0,category:'Workspace · Project'});
  let persisted = true; try { localStorage.setItem('workspace-projects',JSON.stringify(projects)); } catch { persisted = false; }
  render(); modal.close(); form.reset(); form.classList.remove('is-validated'); submit.disabled = false; submit.textContent = 'Create project';
  const activity = node('div','activity__item'); activity.append(node('span','avatar avatar--green','JD'),node('p','',`Jamie Davis created ${projects[0].name}`)); $('#activity-list').prepend(activity);
  $('#toast').textContent = persisted ? 'Project created and saved in this browser.' : 'Project created for this session. Browser storage is unavailable.'; $('#toast').hidden = false; setTimeout(() => $('#toast').hidden = true,4500);
};
$('#refresh').onclick = async () => { $('#refresh').disabled = true; $('#loading').hidden = false; $('.table-wrap').hidden = true; $('#empty').hidden = true; await new Promise(resolve => setTimeout(resolve,650)); render(); $('#loading').hidden = true; $('.table-wrap').hidden = false; $('#refresh').disabled = false; };
render();
