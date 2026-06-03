import React, { useState } from 'react';
import { Card, Badge, OverlayTrigger, Popover, Modal, Form, Button } from 'react-bootstrap';
import { noteService } from '../services/noteService';
import './NoteCard.scss';

const COLORS = ['#FFFFFF', '#F28B82', '#FBBC04', '#FFF475', '#CCFF90', '#A7FFEB', '#CBF0F8', '#AECBFA', '#D7AEFB', '#FDCFE8', '#E6C9A8', '#E8EAED'];

const NoteCard = ({ note, onNoteUpdated }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showCollabModal, setShowCollabModal] = useState(false);
    const [collabEmail, setCollabEmail] = useState('');

    const handleTrash = async () => {
        try {
            const updated = await noteService.trashNote(note.id);
            onNoteUpdated(updated);
        } catch (error) {
            console.error("Failed to trash note", error);
        }
    };

    const handleArchive = async () => {
        try {
            const updated = await noteService.archiveNote(note.id);
            onNoteUpdated(updated);
        } catch (error) {
            console.error("Failed to archive note", error);
        }
    };

    const handleColorChange = async (color) => {
        try {
            const updated = await noteService.updateNote(note.id, { ...note, color });
            onNoteUpdated(updated);
        } catch (error) {
            console.error("Failed to update color", error);
        }
    };

    const handleReminderChange = async (daysFromNow) => {
        try {
            const date = new Date(Date.now() + daysFromNow * 86400000);
            const reminderString = date.toISOString().split('.')[0];
            const updated = await noteService.updateNote(note.id, { ...note, reminderDate: reminderString });
            onNoteUpdated(updated);
        } catch (error) {
            console.error("Failed to set reminder", error);
        }
    };

    const handleAddCollaborator = async () => {
        if (!collabEmail.trim()) return;
        try {
            const updated = await noteService.addCollaborator(note.id, collabEmail);
            onNoteUpdated(updated);
            setCollabEmail('');
        } catch (error) {
            console.error("Failed to add collaborator", error);
            alert("Could not add collaborator. Ensure the email is registered.");
        }
    };

    const colorPopover = (
        <Popover id={`popover-color-${note.id}`}>
            <Popover.Body className="d-flex flex-wrap gap-1 p-2" style={{ maxWidth: '160px' }}>
                {COLORS.map(c => (
                    <div 
                        key={c}
                        onClick={() => handleColorChange(c)}
                        style={{
                            width: '25px', height: '25px', borderRadius: '50%', backgroundColor: c,
                            border: '1px solid #ccc', cursor: 'pointer'
                        }}
                    />
                ))}
            </Popover.Body>
        </Popover>
    );

    const reminderPopover = (
        <Popover id={`popover-reminder-${note.id}`}>
            <Popover.Body className="d-flex flex-column p-2">
                <div style={{ cursor: 'pointer', padding: '5px' }} onClick={() => handleReminderChange(0)}>Later today</div>
                <div style={{ cursor: 'pointer', padding: '5px' }} onClick={() => handleReminderChange(1)}>Tomorrow</div>
                <div style={{ cursor: 'pointer', padding: '5px' }} onClick={() => handleReminderChange(7)}>Next week</div>
            </Popover.Body>
        </Popover>
    );

    return (
        <Card 
            className="note-card h-100 shadow-sm transition-all" 
            style={{ backgroundColor: note.color || '#ffffff', borderRadius: '8px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card.Body>
                {note.title && <Card.Title className="fw-bold">{note.title}</Card.Title>}
                <Card.Text>{note.description}</Card.Text>
                
                {note.reminderDate && (
                    <Badge bg="light" text="dark" className="me-1 mb-2 border rounded-pill py-1 px-2">
                        <span className="me-1">🕒</span>
                        {new Date(note.reminderDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </Badge>
                )}
                
                {/* Phase 3: Labels / Tags display */}
                {note.tags && note.tags.length > 0 && (
                    <div className="mb-2">
                        {note.tags.map(tag => (
                            <Badge bg="secondary" key={tag.id} className="me-1">{tag.name}</Badge>
                        ))}
                    </div>
                )}

                {/* Toolbar - visible on hover */}
                <div className={`note-toolbar d-flex justify-content-between mt-3 text-muted ${isHovered ? 'visible' : 'invisible'}`} aria-label="Note actions">
                    <OverlayTrigger trigger="click" placement="bottom" overlay={reminderPopover} rootClose>
                        <span title="Remind me" className="cursor-pointer" aria-label="Add reminder" role="button" tabIndex="0">🔔</span>
                    </OverlayTrigger>
                    <span title="Collaborator" className="cursor-pointer" onClick={() => setShowCollabModal(true)} aria-label="Add collaborator" role="button" tabIndex="0">👤</span>
                    <OverlayTrigger trigger="click" placement="bottom" overlay={colorPopover} rootClose>
                        <span title="Change color" className="cursor-pointer" aria-label="Change color" role="button" tabIndex="0">🎨</span>
                    </OverlayTrigger>
                    <span title="Archive" className="cursor-pointer" onClick={handleArchive} aria-label="Archive note" role="button" tabIndex="0">📥</span>
                    <span title="Delete" className="cursor-pointer" onClick={handleTrash} aria-label="Trash note" role="button" tabIndex="0">🗑️</span>
                </div>
            </Card.Body>

            <Modal show={showCollabModal} onHide={() => setShowCollabModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fs-5 fw-bold">Collaborators</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {note.collaborators && note.collaborators.length > 0 && (
                        <div className="mb-3">
                            {note.collaborators.map(email => (
                                <div key={email} className="d-flex align-items-center mb-2">
                                    <div className="bg-secondary rounded-circle me-2 d-flex justify-content-center align-items-center text-white" style={{width:'35px', height:'35px'}}>
                                        {email.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="fw-bold text-muted">{email}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Control 
                            type="email" 
                            placeholder="Person or email to share with" 
                            value={collabEmail}
                            onChange={(e) => setCollabEmail(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 bg-light rounded-bottom">
                    <Button variant="light" onClick={() => setShowCollabModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleAddCollaborator}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default NoteCard;
