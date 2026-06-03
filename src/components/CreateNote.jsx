import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { noteService } from '../services/noteService';
import { MdColorLens, MdOutlineAddAlert, MdArchive } from 'react-icons/md';

const CreateNote = ({ currentView, onNoteCreated }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [note, setNote] = useState({ title: '', description: '', color: '#ffffff' });
    const wrapperRef = useRef(null);

    const handleSaveAndClose = async () => {
        if (isExpanded) {
            if (note.title.trim() || note.description.trim()) {
                try {
                    let finalNote = { ...note };
                    if (currentView === 'archive') {
                        finalNote.archived = true;
                    } else if (currentView === 'reminders') {
                        const tomorrow = new Date(Date.now() + 86400000);
                        finalNote.reminderDate = tomorrow.toISOString().split('.')[0];
                    }
                    const newNote = await noteService.createNote(finalNote);
                    onNoteCreated(newNote);
                } catch (error) {
                    console.error("Failed to create note", error);
                }
            }
            setNote({ title: '', description: '', color: '#ffffff' });
            setIsExpanded(false);
        }
    };

    const handleDiscard = () => {
        setNote({ title: '', description: '', color: '#ffffff' });
        setIsExpanded(false);
    };

    // Handle clicking outside to collapse and save
    useEffect(() => {
        const handleClickOutside = async (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                handleSaveAndClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded, note, onNoteCreated]);

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    return (
        <div ref={wrapperRef} className="create-note-wrapper mx-auto mb-4" style={{ maxWidth: '600px' }}>
            <Card className="shadow-sm" style={{ backgroundColor: note.color, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <Card.Body className="p-2">
                    {isExpanded && (
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={note.title}
                            onChange={handleChange}
                            className="border-0 fw-bold mb-2 bg-transparent"
                            style={{ boxShadow: 'none' }}
                        />
                    )}
                    <Form.Control
                        as="textarea"
                        name="description"
                        placeholder="Take a note..."
                        value={note.description}
                        onChange={handleChange}
                        onClick={() => setIsExpanded(true)}
                        className="border-0 bg-transparent"
                        style={{ boxShadow: 'none', resize: 'none', overflow: 'hidden' }}
                        rows={isExpanded ? 3 : 1}
                    />
                    
                    {isExpanded && (
                        <div className="d-flex justify-content-between align-items-center mt-2 px-2 text-muted">
                            <div className="toolbar-icons d-flex gap-3">
                                {/* Placeholders for Phase 3 Icons */}
                                <span title="Remind me" style={{cursor: 'pointer'}}>🔔</span>
                                <span title="Collaborator" style={{cursor: 'pointer'}}>👤</span>
                                <span title="Change color" style={{cursor: 'pointer'}}>🎨</span>
                                <span title="Archive" style={{cursor: 'pointer'}}>📥</span>
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="outline-danger" size="sm" onClick={handleDiscard} className="fw-bold border-0">
                                    Close
                                </Button>
                                <Button variant="primary" size="sm" onClick={handleSaveAndClose} className="fw-bold px-4">
                                    Save
                                </Button>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default CreateNote;
