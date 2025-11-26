
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Mail, MessageSquare, Search, Filter, Plus, X } from 'lucide-react';

const TicketingSystem = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [newComment, setNewComment] = useState('');

  // Simulated email integration - In production, this would connect to Gmail API
  const simulateEmailCheck = () => {
    // This simulates checking for new emails and creating tickets
    const newTicket = {
      id: Date.now(),
      subject: 'Email: Laptop won\'t connect to WiFi',
      description: 'Received via Gmail from user@company.com',
      status: 'open',
      priority: 'medium',
      source: 'email',
      requester: 'user@company.com',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      comments: []
    };
    return newTicket;
  };

  // Initialize with sample tickets
  useEffect(() => {
    const sampleTickets = [
      {
        id: 1,
        subject: 'Cannot access shared drive',
        description: 'Getting permission denied error when trying to access //fileserver/shared',
        status: 'open',
        priority: 'high',
        source: 'manual',
        requester: 'john.doe@company.com',
        created: new Date(Date.now() - 86400000).toISOString(),
        updated: new Date(Date.now() - 3600000).toISOString(),
        comments: [
          { author: 'IT Support', text: 'Checking your permissions now', time: new Date(Date.now() - 3600000).toISOString() }
        ]
      },
      {
        id: 2,
        subject: 'Email: Printer not working on 3rd floor',
        description: 'Received via Gmail from jane.smith@company.com',
        status: 'in_progress',
        priority: 'medium',
        source: 'email',
        requester: 'jane.smith@company.com',
        created: new Date(Date.now() - 172800000).toISOString(),
        updated: new Date(Date.now() - 7200000).toISOString(),
        comments: [
          { author: 'IT Support', text: 'Printer has paper jam, fixing now', time: new Date(Date.now() - 7200000).toISOString() }
        ]
      },
      {
        id: 3,
        subject: 'Password reset request',
        description: 'Need to reset my Windows password',
        status: 'resolved',
        priority: 'low',
        source: 'manual',
        requester: 'bob.johnson@company.com',
        created: new Date(Date.now() - 259200000).toISOString(),
        updated: new Date(Date.now() - 86400000).toISOString(),
        comments: [
          { author: 'IT Support', text: 'Password reset email sent', time: new Date(Date.now() - 86400000).toISOString() }
        ]
      }
    ];
    setTickets(sampleTickets);
    setFilteredTickets(sampleTickets);
  }, []);

  // Filter tickets
  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.requester.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, filterStatus, filterPriority]);

  const createTicket = (ticketData) => {
    const newTicket = {
      id: Date.now(),
      ...ticketData,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      comments: []
    };
    setTickets([newTicket, ...tickets]);
    setShowNewTicket(false);
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(tickets.map(t => 
      t.id === ticketId 
        ? { ...t, status: newStatus, updated: new Date().toISOString() }
        : t
    ));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus, updated: new Date().toISOString() });
    }
  };

  const addComment = (ticketId) => {
    if (!newComment.trim()) return;
    
    setTickets(tickets.map(t => 
      t.id === ticketId 
        ? { 
            ...t, 
            comments: [...t.comments, { author: 'IT Support', text: newComment, time: new Date().toISOString() }],
            updated: new Date().toISOString()
          }
        : t
    ));
    
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        comments: [...selectedTicket.comments, { author: 'IT Support', text: newComment, time: new Date().toISOString() }],
        updated: new Date().toISOString()
      });
    }
    
    setNewComment('');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const NewTicketForm = () => {
    const [formData, setFormData] = useState({
      subject: '',
      description: '',
      priority: 'medium',
      source: 'manual',
      requester: '',
      status: 'open'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      createTicket(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create New Ticket</h2>
            <button onClick={() => setShowNewTicket(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  rows="4"
                  className="w-full border rounded px-3 py-2"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Requester Email</label>
                <input
                  type="email"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.requester}
                  onChange={(e) => setFormData({...formData, requester: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Source</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                  >
                    <option value="manual">Manual</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Create Ticket
              </button>
              <button type="button" onClick={() => setShowNewTicket(false)} className="px-4 py-2 border rounded hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">IT Support Ticketing System</h1>
            <button
              onClick={() => setShowNewTicket(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={20} />
              New Ticket
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Integration Status */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="font-semibold mb-3">Integration Status</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-blue-600" />
              <span className="text-sm">Gmail: <span className="text-green-600 font-medium">Ready</span></span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-green-600" />
              <span className="text-sm">WhatsApp: <span className="text-orange-600 font-medium">Pending Setup</span></span>
            </div>
          </div>
          <button
            onClick={() => createTicket(simulateEmailCheck())}
            className="mt-3 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
          >
            Simulate Email Ticket
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-3 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className="border rounded-lg px-3 py-2"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets List */}
          <div className="space-y-4">
            {filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition ${
                  selectedTicket?.id === ticket.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {ticket.source === 'email' && <Mail size={16} className="text-blue-500" />}
                      {ticket.source === 'whatsapp' && <MessageSquare size={16} className="text-green-500" />}
                      <span className="font-semibold text-gray-900">{ticket.subject}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(ticket.created).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  From: {ticket.requester}
                </div>
              </div>
            ))}
            {filteredTickets.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                No tickets found
              </div>
            )}
          </div>

          {/* Ticket Details */}
          <div className="lg:sticky lg:top-4">
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold">{selectedTicket.subject}</h2>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-500 hover:text-gray-700 lg:hidden"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <select
                      className="w-full mt-1 border rounded px-3 py-2"
                      value={selectedTicket.status}
                      onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Priority</label>
                      <p className={`font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Source</label>
                      <p className="font-medium">{selectedTicket.source}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Requester</label>
                    <p className="font-medium">{selectedTicket.requester}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-gray-700 mt-1">{selectedTicket.description}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Created</label>
                    <p className="text-gray-700">{new Date(selectedTicket.created).toLocaleString()}</p>
                  </div>
                </div>

                {/* Comments */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Comments</h3>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {selectedTicket.comments.map((comment, idx) => (
                      <div key={idx} className="bg-gray-50 rounded p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.time).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 border rounded px-3 py-2 text-sm"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addComment(selectedTicket.id)}
                    />
                    <button
                      onClick={() => addComment(selectedTicket.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Select a ticket to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showNewTicket && <NewTicketForm />}
    </div>
  );
};

export default TicketingSystem;