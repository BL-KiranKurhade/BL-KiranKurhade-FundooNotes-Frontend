import axiosInstance from './axiosInstance';

export const noteService = {
    getAllNotes: async () => {
        const response = await axiosInstance.get('/notes');
        return response.data.data || [];
    },
    
    getArchivedNotes: async () => {
        const response = await axiosInstance.get('/notes/archive');
        return response.data.data || [];
    },
    
    getTrashedNotes: async () => {
        const response = await axiosInstance.get('/notes/trash');
        return response.data.data || [];
    },
    
    createNote: async (noteData) => {
        const response = await axiosInstance.post('/notes', noteData);
        return response.data.data;
    },
    
    updateNote: async (id, noteData) => {
        const response = await axiosInstance.put(`/notes/${id}`, noteData);
        return response.data.data;
    },
    
    deleteNote: async (id) => {
        const response = await axiosInstance.delete(`/notes/${id}`);
        return response.data.message;
    },
    
    // Additional features for Phase 2/3
    trashNote: async (id) => {
        // Toggle trash via the specific endpoint based on NoteController
        const response = await axiosInstance.patch(`/notes/${id}/trash`);
        return response.data.data;
    },
    
    archiveNote: async (id) => {
        const response = await axiosInstance.patch(`/notes/${id}/archive`);
        return response.data.data;
    },
    
    changeColor: async (id, color) => {
        const response = await axiosInstance.get(`/notes`);
        const note = response.data.data.find(n => n.id === id);
        const updateResponse = await axiosInstance.put(`/notes/${id}`, { ...note, color });
        return updateResponse.data.data;
    },

    addCollaborator: async (id, email) => {
        const response = await axiosInstance.post(`/notes/${id}/collaborators?email=${encodeURIComponent(email)}`);
        return response.data.data;
    },

    removeCollaborator: async (id, email) => {
        const response = await axiosInstance.delete(`/notes/${id}/collaborators?email=${encodeURIComponent(email)}`);
        return response.data.data;
    }
};

export const tagService = {
    getAllTags: async () => {
        const response = await axiosInstance.get('/tags');
        return response.data;
    },
    
    createTag: async (tagData) => {
        const response = await axiosInstance.post('/tags', tagData);
        return response.data;
    }
};
