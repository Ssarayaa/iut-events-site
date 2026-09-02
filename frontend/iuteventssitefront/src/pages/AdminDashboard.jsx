import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatChart from '../components/StatChart';
import { PlusCircle, Edit, Trash2, Check, BarChart3, ListOrdered, Upload, X, Plus } from 'lucide-react';

export default function AdminDashboard({ events, user, onCreateEvent, onUpdateEvent, onDeleteEvent }) {
    const [chartKey, setChartKey] = useState(0);
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/groups').then(r => setGroups(r.data)).catch(() => { });
        axios.get('http://localhost:8080/api/users').then(r => setUsers(r.data)).catch(() => { });
    }, []);

    useEffect(() => { setChartKey(prev => prev + 1); }, [events]);

    // ───── États formulaire CRÉATION ─────
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [heureDebut, setHeureDebut] = useState('');
    const [heureFin, setHeureFin] = useState('');
    const [lieu, setLieu] = useState('');
    const [categorie, setCategorie] = useState('Conférence');
    const [budgetPrevu, setBudgetPrevu] = useState('');
    const [budgetReel, setBudgetReel] = useState('');
    const [ressourcesMaterielles, setRessourcesMaterielles] = useState('');
    const [problemesRencontres, setProblemesRencontres] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [groupeId, setGroupeId] = useState('');
    const [referentId, setReferentId] = useState('');

    // ───── États formulaire MODIFICATION ─────
    const [editingEventId, setEditingEventId] = useState(null);
    const [editTitre, setEditTitre] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editDateDebut, setEditDateDebut] = useState('');
    const [editDateFin, setEditDateFin] = useState('');
    const [editHeureDebut, setEditHeureDebut] = useState('');
    const [editHeureFin, setEditHeureFin] = useState('');
    const [editLieu, setEditLieu] = useState('');
    const [editCategorie, setEditCategorie] = useState('Conférence');
    const [editBudgetPrevu, setEditBudgetPrevu] = useState('');
    const [editBudgetReel, setEditBudgetReel] = useState('');
    const [editRessourcesMaterielles, setEditRessourcesMaterielles] = useState('');
    const [editProblemesRencontres, setEditProblemesRencontres] = useState('');
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState('');
    const [editGroupeId, setEditGroupeId] = useState('');
    const [editReferentId, setEditReferentId] = useState('');

    // ───── Ressources matérielles ─────
    const [resourcesMap, setResourcesMap] = useState({});
    const [expandedResourceEventId, setExpandedResourceEventId] = useState(null);
    const [newResNom, setNewResNom] = useState('');
    const [newResQte, setNewResQte] = useState('');
    const [newResCout, setNewResCout] = useState('');
    const [editingResourceId, setEditingResourceId] = useState(null);
    const [editResNom, setEditResNom] = useState('');
    const [editResQte, setEditResQte] = useState('');
    const [editResCout, setEditResCout] = useState('');

    const loadResources = (eventId) => {
        axios.get(`http://localhost:8080/api/resources/event/${eventId}`)
            .then(r => setResourcesMap(prev => ({ ...prev, [eventId]: r.data })))
            .catch(() => { });
    };

    const toggleResources = (eventId) => {
        if (expandedResourceEventId === eventId) {
            setExpandedResourceEventId(null);
        } else {
            setExpandedResourceEventId(eventId);
            loadResources(eventId);
        }
        setNewResNom(''); setNewResQte(''); setNewResCout('');
        setEditingResourceId(null);
    };

    const handleAddResource = (eventId) => {
        if (!newResNom || !newResQte || !newResCout) return;
        axios.post('http://localhost:8080/api/resources', {
            eventId, nom: newResNom,
            quantite: parseInt(newResQte),
            coutUnitaire: parseFloat(newResCout)
        }).then(() => {
            loadResources(eventId);
            setNewResNom(''); setNewResQte(''); setNewResCout('');
        }).catch(() => alert("Erreur lors de l'ajout"));
    };

    const startEditResource = (res) => {
        setEditingResourceId(res.id);
        setEditResNom(res.nom);
        setEditResQte(res.quantite.toString());
        setEditResCout(res.coutUnitaire.toString());
    };

    const handleUpdateResource = (eventId) => {
        axios.put(`http://localhost:8080/api/resources/${editingResourceId}`, {
            nom: editResNom, quantite: parseInt(editResQte), coutUnitaire: parseFloat(editResCout)
        }).then(() => {
            loadResources(eventId);
            setEditingResourceId(null);
        }).catch(() => alert('Erreur lors de la modification'));
    };

    const handleDeleteResource = (eventId, resourceId) => {
        if (!window.confirm('Supprimer cette ressource ?')) return;
        axios.delete(`http://localhost:8080/api/resources/${resourceId}`)
            .then(() => loadResources(eventId))
            .catch(() => alert('Erreur lors de la suppression'));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImageFile(file); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result); r.readAsDataURL(file); }
    };
    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setEditImageFile(file); const r = new FileReader(); r.onloadend = () => setEditImagePreview(r.result); r.readAsDataURL(file); }
    };

    const handleSubmitCreate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const eventData = {
            titre, description, dateDebut, dateFin,
            heureDebut: heureDebut ? heureDebut + ':00' : null,
            heureFin: heureFin ? heureFin + ':00' : null,
            lieu, categorie,
            budgetPrevu: budgetPrevu ? parseFloat(budgetPrevu) : 0,
            budgetReel: budgetReel ? parseFloat(budgetReel) : 0,
            ressourcesMaterielles, problemesRencontres,
            groupe: groupeId ? { id: parseInt(groupeId) } : null,
            referent: referentId ? { id: parseInt(referentId) } : null,
        };
        formData.append('event', new Blob([JSON.stringify(eventData)], { type: 'application/json' }));
        if (imageFile) formData.append('image', imageFile);
        onCreateEvent(formData);
        setTitre(''); setDescription(''); setDateDebut(''); setDateFin('');
        setHeureDebut(''); setHeureFin(''); setLieu(''); setBudgetPrevu('');
        setBudgetReel(''); setRessourcesMaterielles(''); setProblemesRencontres('');
        setImageFile(null); setImagePreview(''); setGroupeId(''); setReferentId('');
    };

    const startEdit = (event) => {
        setEditingEventId(event.id);
        setEditTitre(event.titre || '');
        setEditDescription(event.description || '');
        setEditDateDebut(event.dateDebut || '');
        setEditDateFin(event.dateFin || '');
        setEditHeureDebut(event.heureDebut ? event.heureDebut.substring(0, 5) : '');
        setEditHeureFin(event.heureFin ? event.heureFin.substring(0, 5) : '');
        setEditLieu(event.lieu || '');
        setEditCategorie(event.categorie || 'Conférence');
        setEditBudgetPrevu(event.budgetPrevu || '');
        setEditBudgetReel(event.budgetReel || '');
        setEditRessourcesMaterielles(event.ressourcesMaterielles || '');
        setEditProblemesRencontres(event.problemesRencontres || '');
        setEditImagePreview(event.imageUrl ? `http://localhost:8080${event.imageUrl}` : '');
        setEditImageFile(null);
        setEditGroupeId(event.groupe?.id?.toString() || '');
        setEditReferentId(event.referent?.id?.toString() || '');
    };

    const handleSubmitUpdate = (e, id) => {
        e.preventDefault();
        const formData = new FormData();
        const eventData = {
            titre: editTitre, description: editDescription,
            dateDebut: editDateDebut, dateFin: editDateFin,
            heureDebut: editHeureDebut ? editHeureDebut + ':00' : null,
            heureFin: editHeureFin ? editHeureFin + ':00' : null,
            lieu: editLieu, categorie: editCategorie,
            budgetPrevu: editBudgetPrevu ? parseFloat(editBudgetPrevu) : 0,
            budgetReel: editBudgetReel ? parseFloat(editBudgetReel) : 0,
            ressourcesMaterielles: editRessourcesMaterielles,
            problemesRencontres: editProblemesRencontres,
            groupe: editGroupeId ? { id: parseInt(editGroupeId) } : null,
            referent: editReferentId ? { id: parseInt(editReferentId) } : null,
        };
        formData.append('event', new Blob([JSON.stringify(eventData)], { type: 'application/json' }));
        if (editImageFile) formData.append('image', editImageFile);
        onUpdateEvent(id, formData);
        setEditingEventId(null);
    };

    const validEvents = Array.isArray(events) ? events : [];

    const enseignants = users.filter(u => {
        const r = u.role?.toUpperCase().trim();
        return r === 'ENSEIGNANT' || r === 'REFERENT' || r === 'ADMIN';
    });

    // ── styles communs ──
    const inputStyle = {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid var(--line)',
        width: '100%',
        backgroundColor: '#fff',
        color: 'var(--ink)',
        fontSize: '0.9rem',
    };
    const inputSmStyle = {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid var(--line)',
        width: '100%',
        backgroundColor: '#fff',
        color: 'var(--ink)',
        fontSize: '0.85rem',
    };

    const roleLabel = user?.role === 'ADMIN' ? 'Administrateur' : 'Enseignant';

    return (
        <div className="admin-page" style={{ padding: '40px clamp(16px, 4vw, 60px)', minHeight: '80vh' }}>
            <h2 style={{ color: 'var(--navy)', marginBottom: '30px', fontSize: '2rem' }}>
                Espace Sécurisé — {roleLabel}
            </h2>

            {/* ── GRAPHIQUES ── */}
            <section className="admin-section" style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <BarChart3 color="var(--gold)" size={24} />
                    <h3 style={{ margin: 0, color: 'var(--ink)' }}>Statistiques d'audience</h3>
                </div>
                <div style={{ height: '320px', width: '100%' }}>
                    <StatChart key={chartKey} events={validEvents} />
                </div>
            </section>

            <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}>

                {/* ── FORMULAIRE CRÉATION ── */}
                <section className="admin-section" style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <PlusCircle color="var(--navy)" size={20} />
                        <h3 style={{ margin: 0, color: 'var(--ink)' }}>Ajouter un événement</h3>
                    </div>
                    <form onSubmit={handleSubmitCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <input type="text" placeholder="Titre" value={titre} onChange={e => setTitre(e.target.value)} required style={inputStyle} />
                        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ ...inputStyle, height: '80px', fontFamily: 'inherit' }} />

                        <div className="admin-form-row" style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>Date de Début</label>
                                <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required style={{ ...inputStyle, marginTop: '4px' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>Date de Fin</label>
                                <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} required style={{ ...inputStyle, marginTop: '4px' }} />
                            </div>
                        </div>

                        <div className="admin-form-row" style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>Heure de début</label>
                                <input type="time" value={heureDebut} onChange={e => setHeureDebut(e.target.value)} required style={{ ...inputStyle, marginTop: '4px' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>Heure de fin</label>
                                <input type="time" value={heureFin} onChange={e => setHeureFin(e.target.value)} style={{ ...inputStyle, marginTop: '4px' }} />
                            </div>
                        </div>

                        <input type="text" placeholder="Lieu" value={lieu} onChange={e => setLieu(e.target.value)} required style={inputStyle} />

                        <select value={categorie} onChange={e => setCategorie(e.target.value)} style={inputStyle}>
                            <option value="Conférence">Conférence</option>
                            <option value="Événement">Événement</option>
                            <option value="Séminaire">Séminaire</option>
                            <option value="Sortie">Sortie</option>
                            <option value="Autre">Autre</option>
                        </select>

                        <div className="admin-form-row" style={{ display: 'flex', gap: '10px' }}>
                            <input type="number" placeholder="Budget prévu (€)" value={budgetPrevu} onChange={e => setBudgetPrevu(e.target.value)} style={inputStyle} />
                            <input type="number" placeholder="Budget réel (€)" value={budgetReel} onChange={e => setBudgetReel(e.target.value)} style={inputStyle} />
                        </div>

                        {/* ── CORRECTION SELECT GROUPE : fond blanc + texte foncé pour que les options soient lisibles ── */}
                        <select
                            value={groupeId}
                            onChange={e => setGroupeId(e.target.value)}
                            style={{ ...inputStyle, backgroundColor: '#fff', color: groupeId ? 'var(--ink)' : 'var(--slate)' }}
                        >
                            <option value="">— Groupe / Promotion —</option>
                            {groups.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
                        </select>

                        <select
                            value={referentId}
                            onChange={e => setReferentId(e.target.value)}
                            style={{ ...inputStyle, backgroundColor: '#fff', color: referentId ? 'var(--ink)' : 'var(--slate)' }}
                        >
                            <option value="">— Enseignant référent —</option>
                            {enseignants.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.prenom} {u.nom} (Enseignant)
                                </option>
                            ))}
                        </select>

                        <textarea placeholder="Ressources matérielles" value={ressourcesMaterielles} onChange={e => setRessourcesMaterielles(e.target.value)} style={{ ...inputStyle, height: '60px', fontFamily: 'inherit' }} />
                        <textarea placeholder="Problèmes rencontrés" value={problemesRencontres} onChange={e => setProblemesRencontres(e.target.value)} style={{ ...inputStyle, height: '60px', fontFamily: 'inherit' }} />

                        <div style={{ border: '2px dashed var(--line)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                            <label style={{ cursor: 'pointer', color: 'var(--slate)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Upload size={16} /> {imageFile ? imageFile.name : 'Image (optionnelle)'}
                                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                            </label>
                            {imagePreview && <img src={imagePreview} alt="Aperçu" style={{ width: '100%', marginTop: '8px', borderRadius: '6px', maxHeight: '120px', objectFit: 'cover' }} />}
                        </div>

                        <button type="submit" style={{ padding: '12px', backgroundColor: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <PlusCircle size={16} /> Publier l'événement
                        </button>
                    </form>
                </section>

                {/* ── LISTE DES ÉVÉNEMENTS ── */}
                <section className="admin-section" style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <ListOrdered color="var(--navy)" size={20} />
                        <h3 style={{ margin: 0, color: 'var(--ink)' }}>Événements ({validEvents.length})</h3>
                    </div>

                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--line)', color: 'var(--slate)', textAlign: 'left' }}>
                                <th style={{ padding: '10px 12px' }}>Événement</th>
                                <th style={{ padding: '10px 12px' }}>Date</th>
                                {/* ── COLONNE PARTICIPANTS + RESSOURCES côte à côte ── */}
                                <th style={{ padding: '10px 12px' }}>Participants</th>
                                <th style={{ padding: '10px 12px' }}>Ressources</th>
                                <th style={{ padding: '10px 12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {validEvents.map(event => {
                                const isEditing = editingEventId === event.id;
                                const isResourceOpen = expandedResourceEventId === event.id;
                                const resources = resourcesMap[event.id] ?? [];
                                const totalRessources = resources.reduce((s, r) => s + r.quantite * r.coutUnitaire, 0);

                                return (
                                    <React.Fragment key={event.id}>
                                        <tr style={{ borderBottom: '1px solid var(--bg-soft)', verticalAlign: 'top' }}>
                                            {/* Événement */}
                                            <td data-label="Événement" style={{ padding: '12px' }}>
                                                <div style={{ fontWeight: '600', color: 'var(--navy)' }}>{event.titre}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--slate)', marginTop: '2px' }}>{event.categorie}</div>
                                                {event.referent && (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--gold-deep)', marginTop: '2px' }}>
                                                        Référent : {event.referent.prenom} {event.referent.nom}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Date */}
                                            <td data-label="Date" style={{ padding: '12px', color: 'var(--slate)', fontSize: '0.85rem' }}>
                                                {event.dateDebut}
                                            </td>

                                            {/* Participants — badge visible directement */}
                                            <td data-label="Participants" style={{ padding: '12px' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                    backgroundColor: 'var(--bg-soft)', padding: '4px 10px',
                                                    borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700',
                                                    color: 'var(--navy)'
                                                }}>
                                                    👥 {event.participations?.length ?? 0}
                                                </span>
                                            </td>

                                            {/* ── RESSOURCES — nouvelle colonne dédiée ── */}
                                            <td data-label="Ressources" style={{ padding: '12px' }}>
                                                <button
                                                    onClick={() => toggleResources(event.id)}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                        background: isResourceOpen ? 'var(--gold-pale)' : 'var(--bg-soft)',
                                                        border: `1px solid ${isResourceOpen ? 'var(--gold)' : 'var(--line)'}`,
                                                        borderRadius: '8px', padding: '5px 10px',
                                                        cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600',
                                                        color: isResourceOpen ? 'var(--gold-deep)' : 'var(--slate)',
                                                        transition: 'all 0.15s'
                                                    }}
                                                >
                                                    📦 {isResourceOpen ? 'Fermer' : (resources.length > 0 ? `${resources.length} item(s)` : 'Gérer')}
                                                </button>
                                                {/* Affiche le total si les ressources sont chargées */}
                                                {resources.length > 0 && !isResourceOpen && (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--gold-deep)', marginTop: '4px', fontWeight: '600' }}>
                                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalRessources)}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td data-label="Actions" className="actions-cell" style={{ padding: '12px' }}>
                                                <div className="actions" style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                                                    <button onClick={() => isEditing ? setEditingEventId(null) : startEdit(event)}
                                                        style={{ background: 'none', border: 'none', color: 'var(--navy-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: '600' }}>
                                                        <Edit size={14} /> {isEditing ? 'Annuler' : 'Modifier'}
                                                    </button>
                                                    {onDeleteEvent && (
                                                        <button onClick={() => onDeleteEvent(event.id)}
                                                            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: '600' }}>
                                                            <Trash2 size={14} /> Supprimer
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>

                                        {/* ── FORMULAIRE MODIFICATION ── */}
                                        {isEditing && (
                                            <tr>
                                                <td colSpan="5" style={{ backgroundColor: 'var(--paper)', padding: '16px', borderBottom: '1px solid var(--line)' }}>
                                                    <form onSubmit={(e) => handleSubmitUpdate(e, event.id)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        <input type="text" value={editTitre} onChange={e => setEditTitre(e.target.value)} required placeholder="Titre" style={inputSmStyle} />
                                                        <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} required placeholder="Description" style={{ ...inputSmStyle, height: '70px', fontFamily: 'inherit' }} />

                                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                            <div style={{ flex: 1, minWidth: '130px' }}>
                                                                <label style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>Début</label>
                                                                <input type="date" value={editDateDebut} onChange={e => setEditDateDebut(e.target.value)} style={{ ...inputSmStyle, marginTop: '3px' }} />
                                                            </div>
                                                            <div style={{ flex: 1, minWidth: '130px' }}>
                                                                <label style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>Fin</label>
                                                                <input type="date" value={editDateFin} onChange={e => setEditDateFin(e.target.value)} style={{ ...inputSmStyle, marginTop: '3px' }} />
                                                            </div>
                                                            <div style={{ flex: 1, minWidth: '100px' }}>
                                                                <label style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>H. début</label>
                                                                <input type="time" value={editHeureDebut} onChange={e => setEditHeureDebut(e.target.value)} style={{ ...inputSmStyle, marginTop: '3px' }} />
                                                            </div>
                                                            <div style={{ flex: 1, minWidth: '100px' }}>
                                                                <label style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>H. fin</label>
                                                                <input type="time" value={editHeureFin} onChange={e => setEditHeureFin(e.target.value)} style={{ ...inputSmStyle, marginTop: '3px' }} />
                                                            </div>
                                                        </div>

                                                        <input type="text" value={editLieu} onChange={e => setEditLieu(e.target.value)} placeholder="Lieu" style={inputSmStyle} />

                                                        <select value={editCategorie} onChange={e => setEditCategorie(e.target.value)} style={inputSmStyle}>
                                                            <option value="Conférence">Conférence</option>
                                                            <option value="Événement">Événement</option>
                                                            <option value="Séminaire">Séminaire</option>
                                                            <option value="Sortie">Sortie</option>
                                                            <option value="Autre">Autre</option>
                                                        </select>

                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <input type="number" value={editBudgetPrevu} onChange={e => setEditBudgetPrevu(e.target.value)} placeholder="Budget prévu (€)" style={inputSmStyle} />
                                                            <input type="number" value={editBudgetReel} onChange={e => setEditBudgetReel(e.target.value)} placeholder="Budget réel (€)" style={inputSmStyle} />
                                                        </div>

                                                        <select value={editGroupeId} onChange={e => setEditGroupeId(e.target.value)} style={{ ...inputSmStyle, backgroundColor: '#fff', color: editGroupeId ? 'var(--ink)' : 'var(--slate)' }}>
                                                            <option value="">— Groupe / Promotion —</option>
                                                            {groups.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
                                                        </select>

                                                        <select value={editReferentId} onChange={e => setEditReferentId(e.target.value)} style={{ ...inputSmStyle, backgroundColor: '#fff', color: editReferentId ? 'var(--ink)' : 'var(--slate)' }}>
                                                            <option value="">— Enseignant référent —</option>
                                                            {enseignants.map(u => (
                                                                <option key={u.id} value={u.id}>
                                                                    {u.prenom} {u.nom} (Enseignant)
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <textarea value={editRessourcesMaterielles} onChange={e => setEditRessourcesMaterielles(e.target.value)} placeholder="Ressources matérielles" style={{ ...inputSmStyle, height: '55px', fontFamily: 'inherit' }} />
                                                        <textarea value={editProblemesRencontres} onChange={e => setEditProblemesRencontres(e.target.value)} placeholder="Problèmes rencontrés" style={{ ...inputSmStyle, height: '55px', fontFamily: 'inherit' }} />

                                                        <div style={{ border: '2px dashed var(--line)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                                                            <label style={{ cursor: 'pointer', color: 'var(--slate)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                                <Upload size={14} /> {editImageFile ? editImageFile.name : "Changer l'image (optionnel)"}
                                                                <input type="file" accept="image/*" onChange={handleEditImageChange} style={{ display: 'none' }} />
                                                            </label>
                                                            {editImagePreview && <img src={editImagePreview} alt="Aperçu" style={{ width: '100%', marginTop: '8px', borderRadius: '6px', maxHeight: '100px', objectFit: 'cover' }} />}
                                                        </div>

                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                                <Check size={15} /> Enregistrer
                                                            </button>
                                                            <button type="button" onClick={() => setEditingEventId(null)} style={{ padding: '10px 16px', backgroundColor: 'var(--bg-soft)', color: 'var(--slate)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                                                <X size={15} />
                                                            </button>
                                                        </div>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}

                                        {/* ── PANNEAU RESSOURCES ── */}
                                        {isResourceOpen && !isEditing && (
                                            <tr>
                                                <td colSpan="5" style={{ backgroundColor: 'var(--paper)', padding: '0 12px 16px 12px', borderBottom: '1px solid var(--line)' }}>
                                                    <div style={{ borderTop: '1px dashed var(--line)', paddingTop: '12px' }}>
                                                        <strong style={{ fontSize: '0.85rem', color: 'var(--navy)' }}>Ressources matérielles de « {event.titre} »</strong>

                                                        {resources.length === 0 ? (
                                                            <p style={{ color: 'var(--slate-light)', fontStyle: 'italic', fontSize: '0.82rem', margin: '8px 0' }}>Aucune ressource enregistrée.</p>
                                                        ) : (
                                                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', fontSize: '0.85rem' }}>
                                                                <thead>
                                                                    <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--slate)' }}>
                                                                        <th style={{ padding: '6px', textAlign: 'left' }}>Nom</th>
                                                                        <th style={{ padding: '6px', textAlign: 'right' }}>Qté</th>
                                                                        <th style={{ padding: '6px', textAlign: 'right' }}>Coût unit. (€)</th>
                                                                        <th style={{ padding: '6px', textAlign: 'right' }}>Total (€)</th>
                                                                        <th style={{ padding: '6px' }}></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {resources.map(res => (
                                                                        <tr key={res.id} style={{ borderBottom: '1px solid var(--bg-soft)' }}>
                                                                            {editingResourceId === res.id ? (
                                                                                <>
                                                                                    <td style={{ padding: '6px' }}><input value={editResNom} onChange={e => setEditResNom(e.target.value)} style={{ ...inputSmStyle, width: '100%' }} /></td>
                                                                                    <td style={{ padding: '6px' }}><input type="number" value={editResQte} onChange={e => setEditResQte(e.target.value)} style={{ ...inputSmStyle, width: '70px', textAlign: 'right' }} /></td>
                                                                                    <td style={{ padding: '6px' }}><input type="number" step="0.01" value={editResCout} onChange={e => setEditResCout(e.target.value)} style={{ ...inputSmStyle, width: '80px', textAlign: 'right' }} /></td>
                                                                                    <td style={{ padding: '6px', textAlign: 'right', color: 'var(--navy)', fontWeight: '600' }}>
                                                                                        {(parseFloat(editResQte || 0) * parseFloat(editResCout || 0)).toFixed(2)}
                                                                                    </td>
                                                                                    <td style={{ padding: '6px', display: 'flex', gap: '6px' }}>
                                                                                        <button onClick={() => handleUpdateResource(event.id)} style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer' }}><Check size={16} /></button>
                                                                                        <button onClick={() => setEditingResourceId(null)} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer' }}><X size={16} /></button>
                                                                                    </td>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <td style={{ padding: '6px' }}>{res.nom}</td>
                                                                                    <td style={{ padding: '6px', textAlign: 'right' }}>{res.quantite}</td>
                                                                                    <td style={{ padding: '6px', textAlign: 'right' }}>{res.coutUnitaire}</td>
                                                                                    <td style={{ padding: '6px', textAlign: 'right', color: 'var(--navy)', fontWeight: '600' }}>{(res.quantite * res.coutUnitaire).toFixed(2)}</td>
                                                                                    <td style={{ padding: '6px', display: 'flex', gap: '6px' }}>
                                                                                        <button onClick={() => startEditResource(res)} style={{ background: 'none', border: 'none', color: 'var(--navy-light)', cursor: 'pointer' }}><Edit size={15} /></button>
                                                                                        <button onClick={() => handleDeleteResource(event.id, res.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={15} /></button>
                                                                                    </td>
                                                                                </>
                                                                            )}
                                                                        </tr>
                                                                    ))}
                                                                    <tr style={{ borderTop: '2px solid var(--line)', fontWeight: '700', color: 'var(--navy)' }}>
                                                                        <td colSpan="3" style={{ padding: '6px', textAlign: 'right' }}>Total</td>
                                                                        <td style={{ padding: '6px', textAlign: 'right' }}>{resources.reduce((s, r) => s + r.quantite * r.coutUnitaire, 0).toFixed(2)} €</td>
                                                                        <td />
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        )}

                                                        {/* Formulaire ajout ressource */}
                                                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                                            <div>
                                                                <span style={{ fontSize: '0.72rem', color: 'var(--slate)', display: 'block', marginBottom: '3px' }}>Nom</span>
                                                                <input value={newResNom} onChange={e => setNewResNom(e.target.value)} placeholder="Ex : Vidéoprojecteur" style={{ ...inputSmStyle, width: '180px' }} />
                                                            </div>
                                                            <div>
                                                                <span style={{ fontSize: '0.72rem', color: 'var(--slate)', display: 'block', marginBottom: '3px' }}>Quantité</span>
                                                                <input type="number" value={newResQte} onChange={e => setNewResQte(e.target.value)} placeholder="1" style={{ ...inputSmStyle, width: '70px' }} />
                                                            </div>
                                                            <div>
                                                                <span style={{ fontSize: '0.72rem', color: 'var(--slate)', display: 'block', marginBottom: '3px' }}>Coût unit. (€)</span>
                                                                <input type="number" step="0.01" value={newResCout} onChange={e => setNewResCout(e.target.value)} placeholder="0.00" style={{ ...inputSmStyle, width: '90px' }} />
                                                            </div>
                                                            <button onClick={() => handleAddResource(event.id)}
                                                                style={{ padding: '8px 14px', backgroundColor: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <Plus size={14} /> Ajouter
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}
