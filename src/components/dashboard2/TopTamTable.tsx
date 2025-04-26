
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";

interface TopTamTableProps {
  selectedState: string;
}

const TopTamTable: React.FC<TopTamTableProps> = ({ selectedState }) => {
  // This would come from the actual data when connected to Supabase
  const hasData = false;

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ZIP</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="text-right">Households</TableHead>
            <TableHead className="text-right">Competitors</TableHead>
            <TableHead className="text-right">Composite Score</TableHead>
            <TableHead className="text-right">TAM</TableHead>
            <TableHead className="text-right">SAM</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasData && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopTamTable;
