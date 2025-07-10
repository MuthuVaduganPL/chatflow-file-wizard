import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Request {
  id: string;
  createdAt: string;
  lastModified: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface RequestsListProps {
  namespace: string;
  selectedRequestId?: string;
  onRequestSelect: (requestId: string) => void;
}

// Mock data
const generateMockRequests = (namespace: string): Request[] => {
  const statuses: Request['status'][] = ['pending', 'processing', 'completed', 'failed'];
  return Array.from({ length: 25 }, (_, i) => ({
    id: `${namespace}-req-${String(i + 1).padStart(3, '0')}`,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    lastModified: new Date(Date.now() - i * 3600000 + Math.random() * 3600000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

const ITEMS_PER_PAGE = 10;

export const RequestsList = ({ namespace, selectedRequestId, onRequestSelect }: RequestsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const requests = generateMockRequests(namespace);
  
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRequests = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-primary text-primary-foreground animate-pulse-glow';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Requests</h2>
        <p className="text-sm text-muted-foreground">Namespace: {namespace}</p>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {currentRequests.map((request) => (
          <Card 
            key={request.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-card",
              selectedRequestId === request.id 
                ? "ring-2 ring-primary bg-primary/5" 
                : "hover:bg-muted/30"
            )}
            onClick={() => onRequestSelect(request.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-sm text-foreground">{request.id}</span>
                <Badge className={cn("text-xs", getStatusColor(request.status))}>
                  {request.status}
                </Badge>
              </div>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Created: {formatTimestamp(request.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Modified: {formatTimestamp(request.lastModified)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};