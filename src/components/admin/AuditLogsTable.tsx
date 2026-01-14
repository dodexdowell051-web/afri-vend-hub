import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, FileText, Shield, Lock } from "lucide-react";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  user_id: string | null;
  details: unknown;
  created_at: string | null;
  user_email?: string;
}

interface AuditLogsTableProps {
  logs: AuditLog[];
}

const getActionBadge = (actionType: string) => {
  if (actionType.includes("delete") || actionType.includes("suspend") || actionType.includes("lock")) {
    return <Badge variant="destructive">{actionType.replace(/_/g, " ")}</Badge>;
  }
  if (actionType.includes("approve") || actionType.includes("complete") || actionType.includes("unlock")) {
    return <Badge className="bg-green-100 text-green-700 border-green-300">{actionType.replace(/_/g, " ")}</Badge>;
  }
  if (actionType.includes("update") || actionType.includes("process")) {
    return <Badge className="bg-blue-100 text-blue-700 border-blue-300">{actionType.replace(/_/g, " ")}</Badge>;
  }
  return <Badge variant="secondary">{actionType.replace(/_/g, " ")}</Badge>;
};

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case "profile":
    case "user":
      return "👤";
    case "store":
      return "🏪";
    case "product":
      return "📦";
    case "order":
      return "🛒";
    case "payout":
      return "💰";
    case "wallet":
      return "👛";
    case "dispute":
      return "⚖️";
    case "refund":
      return "↩️";
    case "platform_settings":
      return "⚙️";
    default:
      return "📋";
  }
};

export const AuditLogsTable = ({ logs }: AuditLogsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const actionTypes = [...new Set(logs.map(l => l.action_type))];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || log.action_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Audit logs are immutable and cannot be edited or deleted</span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {actionTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8" />
                    <p>No audit logs found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {log.created_at ? (
                      <div>
                        <div>{format(new Date(log.created_at), "MMM d, yyyy")}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), "HH:mm:ss")}
                        </div>
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell>{getActionBadge(log.action_type)}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <span>{getEntityIcon(log.entity_type)}</span>
                      <span className="capitalize">{log.entity_type.replace(/_/g, " ")}</span>
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.entity_id ? `${log.entity_id.slice(0, 8)}...` : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{log.user_email || "System"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {log.details && Object.keys(log.details).length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Log Details
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Action:</span>
                  <div className="mt-1">{getActionBadge(selectedLog.action_type)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Entity:</span>
                  <p className="capitalize">{selectedLog.entity_type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Entity ID:</span>
                  <p className="font-mono text-xs">{selectedLog.entity_id || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Performed by:</span>
                  <p>{selectedLog.user_email || "System"}</p>
                </div>
              </div>
              
              {selectedLog.details && (
                <div>
                  <span className="text-muted-foreground text-sm">Details:</span>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-auto max-h-60">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}

              <div className="text-xs text-muted-foreground border-t pt-3">
                Logged at: {selectedLog.created_at ? format(new Date(selectedLog.created_at), "PPpp") : "-"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
