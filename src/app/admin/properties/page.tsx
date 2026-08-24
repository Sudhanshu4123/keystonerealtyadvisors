'use client';

import { useState, useEffect } from 'react';
import { Project, PROJECT_TYPES, PROJECT_STATUSES, PROJECT_AMENITIES } from '@/lib/types';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Upload,
  X,
  Search,
  Check,
  Loader2,
  Image as ImageIcon,
  Layers,
  FileText,
} from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    type: 'Residential',
    status: 'Ongoing',
    shortDescription: '',
    description: '',
    developer: 'Keystone Real Estate Developments',
    address: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    totalArea: '',
    buildings: '',
    floors: '',
    units: '',
    completionDate: '',
    featured: false,
    published: true,
    seoTitle: '',
    metaDescription: '',
    images: [] as { imageUrl: string; isPrimary: boolean }[],
    amenities: [] as string[],
    floorPlans: [] as { title: string; description: string; fileUrl: string }[],
    brochures: [] as { fileName: string; fileUrl: string }[],
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAdminProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?includeUnpublished=true&limit=100');
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setForm({
      name: '',
      type: 'Residential',
      status: 'Ongoing',
      shortDescription: '',
      description: '',
      developer: 'Keystone Real Estate Developments',
      address: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      totalArea: '',
      buildings: '',
      floors: '',
      units: '',
      completionDate: '',
      featured: false,
      published: true,
      seoTitle: '',
      metaDescription: '',
      images: [],
      amenities: ['Swimming Pool', 'Gym', 'Security'],
      floorPlans: [],
      brochures: [],
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setForm({
      name: proj.name,
      type: proj.type,
      status: proj.status,
      shortDescription: proj.shortDescription || '',
      description: proj.description || '',
      developer: proj.developer || 'Keystone Real Estate Developments',
      address: proj.address || '',
      area: proj.area || '',
      city: proj.city || '',
      state: proj.state || '',
      pincode: proj.pincode || '',
      totalArea: proj.totalArea || '',
      buildings: proj.buildings ? proj.buildings.toString() : '',
      floors: proj.floors ? proj.floors.toString() : '',
      units: proj.units ? proj.units.toString() : '',
      completionDate: proj.completionDate || '',
      featured: proj.featured,
      published: proj.published,
      seoTitle: proj.seoTitle || proj.name,
      metaDescription: proj.metaDescription || proj.shortDescription,
      images: proj.images ? proj.images.map((i) => ({ imageUrl: i.imageUrl, isPrimary: i.isPrimary })) : [],
      amenities: proj.amenities ? proj.amenities.map((a: any) => (typeof a === 'string' ? a : a.name)) : [],
      floorPlans: proj.floorPlans ? proj.floorPlans.map((fp) => ({ title: fp.title, description: fp.description || '', fileUrl: fp.fileUrl })) : [],
      brochures: proj.brochures ? proj.brochures.map((b) => ({ fileName: b.fileName, fileUrl: b.fileUrl })) : [],
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const newImages = data.files
        .filter((f: any) => !f.isPdf)
        .map((f: any, idx: number) => ({
          imageUrl: f.url,
          isPrimary: form.images.length === 0 && idx === 0,
        }));

      setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    } catch (err: any) {
      setErrorMsg(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingBrochure(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('files', files[0]);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Brochure upload failed');

      const uploaded = data.files[0];
      setForm((prev) => ({
        ...prev,
        brochures: [{ fileName: uploaded.fileName || 'Project_Brochure.pdf', fileUrl: uploaded.url }],
      }));
    } catch (err: any) {
      setErrorMsg(err.message || 'Brochure upload failed.');
    } finally {
      setUploadingBrochure(false);
    }
  };

  const handleAmenityToggle = (name: string) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(name);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== name) : [...prev.amenities, name],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project');

      setIsModalOpen(false);
      fetchAdminProjects();
    } catch (err: any) {
      setErrorMsg(err.message || 'Save error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${deleteTargetId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setDeleteTargetId(null);
        fetchAdminProjects();
      } else {
        alert(data.error || 'Failed to delete project.');
      }
    } catch (err: any) {
      alert('Delete error: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (proj: Project) => {
    try {
      await fetch(`/api/projects/${proj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !proj.published }),
      });
      fetchAdminProjects();
    } catch (err) {
      console.error('Toggle publish error:', err);
    }
  };

  const handleToggleFeatured = async (proj: Project) => {
    try {
      await fetch(`/api/projects/${proj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !proj.featured }),
      });
      fetchAdminProjects();
    } catch (err) {
      console.error('Toggle featured error:', err);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.area.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-slate-50">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-600" />
            <span>Master Projects Management</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Create, edit, publish, feature, or upload media for real estate projects.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter projects by name, city, or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-900 font-medium shadow-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {/* PROJECTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto mb-2" />
            <span>Loading master projects...</span>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-extrabold border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Project</th>
                  <th className="p-3.5">Category & Status</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Specifications</th>
                  <th className="p-3.5">Featured</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProjects.map((proj) => {
                  const primaryImg =
                    proj.images?.find((i) => i.isPrimary)?.imageUrl ||
                    proj.images?.[0]?.imageUrl ||
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80';

                  return (
                    <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={primaryImg}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                        />
                        <div className="max-w-xs">
                          <span className="font-bold text-slate-900 block truncate">{proj.name}</span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">
                            {proj.shortDescription}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5 space-y-1">
                        <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold block w-fit">
                          {proj.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase block w-fit ${
                            proj.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : proj.status === 'Ongoing'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-700">
                        {proj.area}, {proj.city}
                      </td>

                      <td className="p-3.5 text-[11px] text-slate-500">
                        {proj.totalArea || 'N/A'} • {proj.completionDate || 'N/A'}
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleFeatured(proj)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            proj.featured
                              ? 'bg-amber-50 text-amber-600 border-amber-300'
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-900'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => handleTogglePublish(proj)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 border cursor-pointer ${
                            proj.published
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {proj.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{proj.published ? 'Published' : 'Hidden'}</span>
                        </button>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(proj)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-8 text-center text-xs text-slate-500">No master projects found.</p>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl my-auto">
            
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>{editingProject ? 'Edit Project' : 'Add New Real Estate Project'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-900 font-medium">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Name, Type, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="The Royal Azure Residences"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900 text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Project Category *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900 font-semibold"
                  >
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Project Status *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900 font-semibold"
                  >
                    {PROJECT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="Brief 1-line project summary for cards..."
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Complete project master plan narrative, architectural vision..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              {/* Location & Developer */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Developer Name</label>
                  <input
                    type="text"
                    value={form.developer}
                    onChange={(e) => setForm({ ...form, developer: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Area / Neighborhood *</label>
                  <input
                    type="text"
                    required
                    placeholder="Manhattan"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="New York"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">State & Zip</label>
                  <input
                    type="text"
                    placeholder="NY 10001"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Total Area</label>
                  <input
                    type="text"
                    placeholder="4.5 Acres"
                    value={form.totalArea}
                    onChange={(e) => setForm({ ...form, totalArea: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Buildings</label>
                  <input
                    type="number"
                    placeholder="3"
                    value={form.buildings}
                    onChange={(e) => setForm({ ...form, buildings: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Floors</label>
                  <input
                    type="number"
                    placeholder="36"
                    value={form.floors}
                    onChange={(e) => setForm({ ...form, floors: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Units</label>
                  <input
                    type="number"
                    placeholder="240"
                    value={form.units}
                    onChange={(e) => setForm({ ...form, units: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Completion</label>
                  <input
                    type="text"
                    placeholder="Q3 2027"
                    value={form.completionDate}
                    onChange={(e) => setForm({ ...form, completionDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Project Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PROJECT_AMENITIES.map((amenity) => {
                    const isChecked = form.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`px-3 py-2 rounded-xl text-left font-bold border flex items-center justify-between transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-blue-50 text-blue-900 border-blue-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span>{amenity}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-blue-900" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Media Uploads */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>Project Gallery Images ({form.images.length})</span>
                  </h3>
                  <label className="gold-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {form.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 h-24">
                        <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded hover:bg-rose-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brochure Uploader */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>PDF Brochure Upload</span>
                    </h3>
                    {form.brochures.length > 0 && (
                      <span className="text-[11px] text-blue-900 font-mono font-bold block">
                        File: {form.brochures[0].fileName} ({form.brochures[0].fileUrl})
                      </span>
                    )}
                  </div>
                  <label className="px-4 py-2 bg-slate-100 border border-slate-200 hover:border-blue-900 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer">
                    {uploadingBrochure ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-amber-600" />}
                    <span>Upload Brochure PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleBrochureUpload}
                      disabled={uploadingBrochure}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-3 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                  <span>Mark as Featured Project</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span>Publish Project Live</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="gold-btn px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Real Estate Project"
        message="Are you sure you want to permanently delete this project? All related images, floor plans, brochures, and amenities will also be removed. This action cannot be undone."
        onConfirm={executeDelete}
        onClose={() => setDeleteTargetId(null)}
        loading={deleting}
      />

    </div>
  );
}
