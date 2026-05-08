import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, UploadCloud, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TeamMemberInput {
  id: string;
  name: string;
  role: string;
  bio: string;
  city: string;
  linkedin_url: string;
  email: string;
  instagram_url: string;
  image_url: string;
  imageFile?: File;
}

interface TeamMemberSectionProps {
  members: TeamMemberInput[];
  onChange: (members: TeamMemberInput[]) => void;
}

export const TeamMemberSection: React.FC<TeamMemberSectionProps> = ({ members, onChange }) => {
  const addMember = () => {
    onChange([
      ...members,
      { id: Math.random().toString(), name: "", role: "", bio: "", city: "", linkedin_url: "", email: "", instagram_url: "", image_url: "" }
    ]);
  };

  const removeMember = (id: string) => {
    onChange(members.filter(m => m.id !== id));
  };

  const updateMember = (id: string, field: keyof TeamMemberInput, value: any) => {
    onChange(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <div className="space-y-4">
      {members.map((member, index) => (
        <div key={member.id} className="p-4 border border-border/50 rounded-lg bg-card/50 relative group">
          <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeMember(member.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <h4 className="text-sm font-semibold mb-4">Team Member {index + 1}</h4>
          
          <div className="mb-6">
            <ImageUploadPreview 
              id={`team-image-${member.id}`}
              label="Profile Photo"
              file={member.imageFile || null}
              onFileSelect={(f) => updateMember(member.id, "imageFile", f)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={member.name} onChange={e => updateMember(member.id, "name", e.target.value)} placeholder="Full Name" />
            </div>
            <div className="space-y-2">
              <Label>Designation</Label>
              <Input value={member.role} onChange={e => updateMember(member.id, "role", e.target.value)} placeholder="e.g. CEO & Founder" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={member.city} onChange={e => updateMember(member.id, "city", e.target.value)} placeholder="City" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={member.email} onChange={e => updateMember(member.id, "email", e.target.value)} placeholder="Email address" />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input value={member.linkedin_url} onChange={e => updateMember(member.id, "linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input value={member.instagram_url} onChange={e => updateMember(member.id, "instagram_url", e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Short Bio</Label>
              <Textarea value={member.bio} onChange={e => updateMember(member.id, "bio", e.target.value)} placeholder="Brief background about the member..." className="h-20" />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addMember} className="w-full border-dashed">
        <Plus className="h-4 w-4 mr-2" /> Add Team Member
      </Button>
    </div>
  );
};

export interface OpenRoleInput {
  id: string;
  title: string;
  department: string;
  work_mode: string;
  city: string;
  experience: string;
  skills: string;
  description: string;
  apply_link: string;
  apply_email: string;
  contact_person: string;
  deadline: string;
}

interface OpenRolesSectionProps {
  roles: OpenRoleInput[];
  onChange: (roles: OpenRoleInput[]) => void;
}

export const OpenRolesSection: React.FC<OpenRolesSectionProps> = ({ roles, onChange }) => {
  const addRole = () => {
    onChange([
      ...roles,
      { id: Math.random().toString(), title: "", department: "", work_mode: "Remote", city: "", experience: "", skills: "", description: "", apply_link: "", apply_email: "", contact_person: "", deadline: "" }
    ]);
  };

  const removeRole = (id: string) => {
    onChange(roles.filter(r => r.id !== id));
  };

  const updateRole = (id: string, field: keyof OpenRoleInput, value: string) => {
    onChange(roles.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="space-y-4 mt-4">
      {roles.map((role, index) => (
        <div key={role.id} className="p-4 border border-border/50 rounded-lg bg-card/50 relative group">
          <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeRole(role.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <h4 className="text-sm font-semibold mb-4">Open Role {index + 1}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role Title</Label>
              <Input value={role.title} onChange={e => updateRole(role.id, "title", e.target.value)} placeholder="e.g. Frontend Engineer" />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={role.department} onChange={e => updateRole(role.id, "department", e.target.value)} placeholder="e.g. Engineering" />
            </div>
            
            <div className="space-y-2">
              <Label>Work Mode</Label>
              <Select value={role.work_mode} onValueChange={(v) => updateRole(role.id, "work_mode", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>City (if Hybrid/On-site)</Label>
              <Input value={role.city} onChange={e => updateRole(role.id, "city", e.target.value)} placeholder="e.g. Bangalore" />
            </div>
            
            <div className="space-y-2">
              <Label>Experience Required</Label>
              <Input value={role.experience} onChange={e => updateRole(role.id, "experience", e.target.value)} placeholder="e.g. 2-4 Years" />
            </div>
            <div className="space-y-2">
              <Label>Skills Required</Label>
              <Input value={role.skills} onChange={e => updateRole(role.id, "skills", e.target.value)} placeholder="e.g. React, Node.js" />
            </div>
            
            <div className="space-y-2">
              <Label>Apply Link</Label>
              <Input value={role.apply_link} onChange={e => updateRole(role.id, "apply_link", e.target.value)} placeholder="URL to career page" />
            </div>
            <div className="space-y-2">
              <Label>Apply Email</Label>
              <Input type="email" value={role.apply_email} onChange={e => updateRole(role.id, "apply_email", e.target.value)} placeholder="jobs@company.com" />
            </div>

            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input value={role.contact_person} onChange={e => updateRole(role.id, "contact_person", e.target.value)} placeholder="Name of Hiring Manager" />
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input type="date" value={role.deadline} onChange={e => updateRole(role.id, "deadline", e.target.value)} />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label>Job Description</Label>
              <Textarea value={role.description} onChange={e => updateRole(role.id, "description", e.target.value)} placeholder="Briefly describe the responsibilities..." className="h-20" />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addRole} className="w-full border-dashed">
        <Plus className="h-4 w-4 mr-2" /> Add Open Role
      </Button>
    </div>
  );
};

export const MultiSelectGrid = ({ options, selected, onChange, allowCustom = false }: { options: string[], selected: string[], onChange: (val: string[]) => void, allowCustom?: boolean }) => {
  const [customInput, setCustomInput] = React.useState("");

  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(x => x !== opt));
    else onChange([...selected, opt]);
  };

  const handleCustomAdd = () => {
    if (customInput.trim() && !selected.includes(customInput.trim())) {
      onChange([...selected, customInput.trim()]);
      setCustomInput("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isSelected = selected.includes(opt);
          return (
            <Badge 
              key={opt} 
              variant={isSelected ? "default" : "outline"} 
              className={`cursor-pointer px-3 py-1.5 ${isSelected ? 'bg-primary' : 'bg-background hover:bg-muted'}`}
              onClick={() => toggle(opt)}
            >
              {isSelected && <Check className="h-3 w-3 mr-1" />}
              {opt}
            </Badge>
          );
        })}
        {allowCustom && selected.filter(s => !options.includes(s)).map(opt => (
          <Badge 
            key={opt} 
            variant="default" 
            className="cursor-pointer px-3 py-1.5 bg-primary"
            onClick={() => toggle(opt)}
          >
            <Check className="h-3 w-3 mr-1" />
            {opt}
          </Badge>
        ))}
      </div>
      {allowCustom && (
        <div className="flex gap-2 max-w-sm">
          <Input 
            placeholder="Other (specify)" 
            value={customInput} 
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleCustomAdd(); }}}
          />
          <Button type="button" variant="secondary" onClick={handleCustomAdd}>Add</Button>
        </div>
      )}
    </div>
  );
};

export const ImageUploadPreview = ({ file, onFileSelect, label, id }: { file: File | null, onFileSelect: (f: File | null) => void, label: string, id: string }) => {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input id={id} type="file" accept="image/*" className="hidden" onChange={e => onFileSelect(e.target.files?.[0] || null)} />
          <Label htmlFor={id} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border/50 rounded-lg cursor-pointer bg-card/30 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
            </div>
          </Label>
        </div>
        {file && (
          <div className="w-32 h-32 rounded-lg border border-border/50 overflow-hidden relative group shrink-0">
            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button type="button" variant="destructive" size="sm" onClick={() => onFileSelect(null)}>Remove</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
