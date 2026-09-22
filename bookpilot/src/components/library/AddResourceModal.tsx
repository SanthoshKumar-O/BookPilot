import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Link as LinkIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBookPilot } from '../../context';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Tabs } from '../ui/Tabs';

export interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { addResource } = useBookPilot();

  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf' || ext === 'epub') {
        setSelectedFile(file);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        }
        setError(null);
      } else {
        setError('Only PDF and EPUB files are supported.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf' || ext === 'epub') {
        setSelectedFile(file);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        }
        setError(null);
      } else {
        setError('Only PDF and EPUB files are supported.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'upload') {
      if (!selectedFile) {
        setError('Please select or drop a PDF or EPUB file.');
        return;
      }
    } else {
      if (!urlInput.trim() || !urlInput.startsWith('http')) {
        setError('Please enter a valid HTTP/HTTPS URL pointing to a PDF resource.');
        return;
      }
    }

    setIsSubmitting(true);

    const fileType = activeTab === 'upload' ? (selectedFile?.name.endsWith('.epub') ? 'epub' : 'pdf') : 'url';
    const resourceTitle = title.trim() || (activeTab === 'upload' ? selectedFile?.name : 'Imported Document') || 'Technical Resource';
    const resourceAuthor = author.trim() || 'Technical Author';

    const newResource = addResource({
      title: resourceTitle,
      author: resourceAuthor,
      type: fileType,
      status: 'processing',
      description: 'Newly imported technical learning resource currently undergoing AST chapter and concept extraction.',
      tags: ['Technical', fileType.toUpperCase()],
    });

    setIsSubmitting(false);
    onClose();
    // Navigate to resource detail view where the user will see the processing pipeline
    navigate(`/library/${newResource.id}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Learning Resource"
      description="Import a technical book, documentation, or paper into your BookPilot environment."
      size="md"
    >
      <div className="space-y-5">
        {/* Method Switcher Tabs */}
        <Tabs
          variant="segmented"
          activeTab={activeTab}
          onChange={(id) => {
            setActiveTab(id as 'upload' | 'url');
            setError(null);
          }}
          items={[
            { id: 'upload', label: 'Upload PDF / EPUB', icon: <UploadCloud className="w-3.5 h-3.5" /> },
            { id: 'url', label: 'Import from URL', icon: <LinkIcon className="w-3.5 h-3.5" /> },
          ]}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'upload' ? (
            /* Upload Drop Area */
            <div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  selectedFile
                    ? 'border-[var(--primary)] bg-[var(--secondary)]/50'
                    : 'border-[var(--border)] hover:border-[var(--ring)]/40 bg-[var(--card)]'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.epub"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-xs font-semibold text-[var(--foreground)] truncate max-w-[200px]">
                        {selectedFile.name}
                      </div>
                      <div className="text-[11px] text-[var(--muted-foreground)]">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                    <label
                      htmlFor="file-upload"
                      className="ml-auto text-xs text-[var(--accent)] hover:underline cursor-pointer font-medium"
                    >
                      Change
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer space-y-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--muted-foreground)]">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-medium text-[var(--foreground)]">
                      Click to browse or drag & drop file
                    </div>
                    <div className="text-[11px] text-[var(--muted-foreground)]">
                      Supports PDF and EPUB files up to 100MB
                    </div>
                  </label>
                )}
              </div>
            </div>
          ) : (
            /* URL Input */
            <div className="space-y-1">
              <Input
                label="Resource URL"
                placeholder="https://example.com/materials/deep-learning.pdf"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                leftElement={<LinkIcon className="w-4 h-4" />}
                hint="Provide a direct link to a PDF document or open technical paper."
              />
            </div>
          )}

          {/* Book Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Input
              label="Resource Title"
              placeholder="e.g. Deep Learning Foundations"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              label="Author (optional)"
              placeholder="e.g. Ian Goodfellow"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-[var(--error)]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Processing Info Banner */}
          <div className="p-3 rounded-lg bg-[var(--secondary)]/70 border border-[var(--border)] text-[11px] text-[var(--muted-foreground)] space-y-1">
            <div className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />
              Automated Processing Pipeline
            </div>
            <p>
              Once added, BookPilot will extract the chapter hierarchy, detect technical concepts, and build a contextual reading layer around the original text.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--border)]">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Import Resource
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
