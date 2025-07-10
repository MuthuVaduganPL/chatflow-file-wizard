import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "lucide-react";

interface NamespaceSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const namespaces = [
  { id: 'default', name: 'Default' },
  { id: 'production', name: 'Production' },
  { id: 'staging', name: 'Staging' },
  { id: 'development', name: 'Development' },
];

export const NamespaceSelector = ({ value, onValueChange }: NamespaceSelectorProps) => {
  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      <Database className="h-5 w-5 text-primary" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="bg-card border-border hover:bg-muted/50 transition-colors">
          <SelectValue placeholder="Select namespace" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {namespaces.map((namespace) => (
            <SelectItem key={namespace.id} value={namespace.id}>
              {namespace.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};