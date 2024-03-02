import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

interface DomainSuggestion {
  domain: string;
  justification: string;
}

const ResultsTable = ({ domainSuggestions }: { domainSuggestions: DomainSuggestion[]; }) => {

  return (
    <div className="mt-6">
      <Table>
        <TableCaption >Available Domains</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Availability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domainSuggestions.length > 0 && domainSuggestions.map((item: any, index: number) => (
            <TableRow key={item.domain}>
              <TableCell>
                <a href={`https://www.godaddy.com/en-uk/domainsearch/find?domainToCheck=${item.domain}`} target='_blank'>{item.domain}</a>
              </TableCell>
              <TableCell>
                {item.available ? `$${item.price}` : 'unavailable'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResultsTable;