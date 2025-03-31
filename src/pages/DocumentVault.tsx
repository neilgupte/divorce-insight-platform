
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SAMPLE_DOCUMENTS, US_STATES } from "@/data/mockData";
import {
  File,
  FileText,
  FileType,
  FileSpreadsheet,
  Download,
  Upload,
  Search,
  Tag,
  Info,
  Eye,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  X,
  Plus,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  tags: string[];
  uploadedBy: string;
}

const DocumentVault = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(SAMPLE_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [newDocumentTags, setNewDocumentTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  
  // Filter documents based on search term and selected tags
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === "" || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => doc.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Get all unique tags from documents
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)));

  // Handle document selection
  const toggleDocumentSelection = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  // Handle select all documents
  const toggleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  // Handle tag selection for filtering
  const toggleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle document deletion
  const handleDeleteDocuments = () => {
    if (selectedDocuments.length === 0) return;
    
    setDocuments(documents.filter(doc => !selectedDocuments.includes(doc.id)));
    toast({
      title: `${selectedDocuments.length} document${selectedDocuments.length > 1 ? 's' : ''} deleted`,
      description: "The selected documents have been removed from the vault",
    });
    setSelectedDocuments([]);
  };

  // Handle document download
  const handleDownloadDocuments = () => {
    if (selectedDocuments.length === 0) return;
    
    toast({
      title: `Downloading ${selectedDocuments.length} document${selectedDocuments.length > 1 ? 's' : ''}`,
      description: "Your files will be downloaded shortly",
    });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  // Handle new tag addition to document being uploaded
  const handleAddTag = () => {
    if (newTag && !newDocumentTags.includes(newTag)) {
      setNewDocumentTags([...newDocumentTags, newTag]);
      setNewTag("");
    }
  };

  // Handle tag removal from document being uploaded
  const handleRemoveTag = (tag: string) => {
    setNewDocumentTags(newDocumentTags.filter(t => t !== tag));
  };

  // Handle document upload submission
  const handleUploadSubmit = () => {
    if (!fileToUpload) return;
    
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: fileToUpload.name,
      type: fileToUpload.type.includes("pdf") ? "PDF" :
            fileToUpload.type.includes("spreadsheet") || fileToUpload.type.includes("excel") ? "Spreadsheet" :
            fileToUpload.type.includes("document") || fileToUpload.type.includes("word") ? "Document" : "Other",
      size: `${(fileToUpload.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: newDocumentTags,
      uploadedBy: "Admin User",
    };
    
    setDocuments([newDocument, ...documents]);
    setIsUploadDialogOpen(false);
    setFileToUpload(null);
    setNewDocumentTags([]);
    
    toast({
      title: "Document uploaded",
      description: `${fileToUpload.name} has been added to the vault`,
    });
  };

  // Get appropriate icon for document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileType className="h-5 w-5 text-red-500" />;
      case "Document":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "Spreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Vault</h1>
          <p className="text-muted-foreground">
            Securely store and organize case-related documents
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Sidebar Filters */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter documents by tags
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search documents..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium">Document Tags</h3>
              <div className="space-y-2">
                {allTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTagSelection(tag)}
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium">Document Type</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-pdf" />
                  <label htmlFor="type-pdf" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    PDF
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-document" />
                  <label htmlFor="type-document" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Document
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-spreadsheet" />
                  <label htmlFor="type-spreadsheet" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Spreadsheet
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTagSelection(tag)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document List */}
        <div className="md:col-span-3 space-y-4">
          {/* Actions toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedDocuments.length > 0 && selectedDocuments.length === filteredDocuments.length}
                onCheckedChange={toggleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                {selectedDocuments.length > 0
                  ? `Selected ${selectedDocuments.length} document${selectedDocuments.length > 1 ? 's' : ''}`
                  : "Select all"}
              </label>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadDocuments}
                disabled={selectedDocuments.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteDocuments}
                disabled={selectedDocuments.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Document table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedDocuments.includes(document.id)}
                            onCheckedChange={() => toggleDocumentSelection(document.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getDocumentIcon(document.type)}
                            <span className="font-medium">{document.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{document.type}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {document.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{document.size}</TableCell>
                        <TableCell>{document.uploadDate}</TableCell>
                        <TableCell>{document.uploadedBy}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Tag className="mr-2 h-4 w-4" />
                                Edit Tags
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No documents found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Add a document to the vault with metadata
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="document">Select File</Label>
              <Input id="document" type="file" onChange={handleFileUpload} />
              {fileToUpload && (
                <p className="text-xs text-muted-foreground">
                  {fileToUpload.name} ({(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Select onValueChange={(value) => setNewDocumentTags([...newDocumentTags, value])}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setNewDocumentTags([...newDocumentTags, value])}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Real estate">Real estate</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Offshore assets">Offshore assets</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Private clubs">Private clubs</SelectItem>
                    <SelectItem value="Social connections">Social connections</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Custom Tags</Label>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add custom tag"
                />
                <Button type="button" size="icon" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {newDocumentTags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} disabled={!fileToUpload}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentVault;
