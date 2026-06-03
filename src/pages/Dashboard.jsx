import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Button, Navbar, Row, Col } from 'react-bootstrap';
import CreateNote from '../components/CreateNote';
import NoteCard from '../components/NoteCard';
import { noteService } from '../services/noteService';
import './Dashboard.scss';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('notes'); // 'notes', 'archive', 'trash', 'reminders'

    useEffect(() => {
        fetchNotes(currentView);
    }, [currentView]);

    const fetchNotes = async (view) => {
        setNotes([]); // Instantly clear stale notes from the previous view
        setLoading(true);
        try {
            let data = [];
            if (view === 'notes' || view === 'reminders') {
                data = await noteService.getAllNotes();
                if (view === 'reminders') {
                    // Filter notes that have a reminder
                    data = data.filter(n => n.reminderDate);
                }
            } else if (view === 'archive') {
                data = await noteService.getArchivedNotes();
            } else if (view === 'trash') {
                data = await noteService.getTrashedNotes();
            }
            setNotes(data || []);
        } catch (error) {
            console.error("Failed to fetch notes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNoteCreated = (newNote) => {
        setNotes([newNote, ...notes]);
    };

    const handleNoteUpdated = (updatedNote) => {
        // If a note is updated (e.g. trashed/archived) we usually just remove it from the current view
        // if it no longer belongs there. For simplicity, re-fetch to ensure correctness.
        fetchNotes(currentView);
    };

    return (
        <div className="dashboard vh-100 bg-light">
            <Navbar bg="white" expand="lg" className="shadow-sm mb-4 border-bottom sticky-top py-2">
                <Container fluid className="px-4">
                    <Navbar.Brand className="fs-4 d-flex align-items-center">
                        <span className="text-warning fw-bold me-2">Fundoo</span> Notes
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="me-4 d-none d-md-block text-muted">
                            {user?.email}
                        </Navbar.Text>
                        <Button variant="outline-secondary" size="sm" className="px-4 rounded-pill" onClick={logout}>Logout</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            
            <Container fluid>
                <Row>
                    {/* Phase 3: Sidebar will go here, for now column sizing accounts for it */}
                    {/* Sidebar */}
                    <Col md={2} className="d-none d-md-block vh-100 pt-2">
                        <ul className="list-unstyled">
                            <li className={`sidebar-item mb-1 cursor-pointer d-flex align-items-center ${currentView === 'notes' ? 'active-item' : 'text-muted'}`} onClick={() => setCurrentView('notes')} aria-label="View Notes" tabIndex="0">
                                <span className="fs-5 me-3 d-inline-block text-center" style={{ width: '30px' }}>💡</span> 
                                <span className="fw-medium">Notes</span>
                            </li>
                            <li className={`sidebar-item mb-1 cursor-pointer d-flex align-items-center ${currentView === 'reminders' ? 'active-item' : 'text-muted'}`} onClick={() => setCurrentView('reminders')} aria-label="Reminders" tabIndex="0">
                                <span className="fs-5 me-3 d-inline-block text-center" style={{ width: '30px' }}>🔔</span> 
                                <span className="fw-medium">Reminders</span>
                            </li>
                            <li className={`sidebar-item mb-1 cursor-pointer d-flex align-items-center ${currentView === 'labels' ? 'active-item' : 'text-muted'}`} onClick={() => setCurrentView('labels')} aria-label="Edit Labels" tabIndex="0">
                                <span className="fs-5 me-3 d-inline-block text-center" style={{ width: '30px' }}>🏷️</span> 
                                <span className="fw-medium">Edit Labels</span>
                            </li>
                            <li className={`sidebar-item mb-1 cursor-pointer d-flex align-items-center ${currentView === 'archive' ? 'active-item' : 'text-muted'}`} onClick={() => setCurrentView('archive')} aria-label="Archive" tabIndex="0">
                                <span className="fs-5 me-3 d-inline-block text-center" style={{ width: '30px' }}>📥</span> 
                                <span className="fw-medium">Archive</span>
                            </li>
                            <li className={`sidebar-item mb-1 cursor-pointer d-flex align-items-center ${currentView === 'trash' ? 'active-item' : 'text-muted'}`} onClick={() => setCurrentView('trash')} aria-label="Trash" tabIndex="0">
                                <span className="fs-5 me-3 d-inline-block text-center" style={{ width: '30px' }}>🗑️</span> 
                                <span className="fw-medium">Trash</span>
                            </li>
                        </ul>
                    </Col>
                    
                    <Col md={10} className="pt-2 px-md-5">
                        <div className="d-flex flex-column align-items-center">
                            {currentView !== 'trash' && currentView !== 'labels' && (
                                <div className="w-100 d-flex justify-content-center">
                                    <CreateNote currentView={currentView} onNoteCreated={handleNoteCreated} />
                                </div>
                            )}
                            
                            {loading ? (
                                <div className="text-center mt-5 text-muted">Loading notes...</div>
                            ) : (
                                <div className="w-100" style={{ maxWidth: '1200px' }}>
                                    <Row className="g-4 mt-2 justify-content-start">
                                        {notes.map(note => (
                                            <Col xs={12} sm={6} md={4} lg={3} key={note.id}>
                                                <NoteCard note={note} onNoteUpdated={handleNoteUpdated} />
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
