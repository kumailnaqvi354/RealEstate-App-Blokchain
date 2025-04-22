import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PropertyBlockchainInfoProps {
  tokenId: string
  blockchain: string
  owner: string
  deedDocument: string
  transactionHistory: {
    date: string
    action: string
    price: string
    from: string | null
    to: string | null
  }[]
}

export default function PropertyBlockchainInfo({
  tokenId,
  blockchain,
  owner,
  transactionHistory,
  deedDocument,
}: PropertyBlockchainInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Blockchain Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Token ID</div>
            <div className="font-mono flex items-center gap-2">
              {tokenId}
              <a href={`https://testnet.bscscan.com/token/0xfb7c2e16d94e6f4bd84f1592d963cb56a2f079ce?a=${tokenId}`} className="text-primary hover:underline">
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Blockchain</div>
            <div className="flex items-center gap-2">
              {blockchain}
              <Badge variant="outline">{blockchain}</Badge>
            </div>
          </div>
          <div className="p-4 border rounded-md md:col-span-2">
            <div className="text-sm text-muted-foreground">Current Owner</div>
            <div className="font-mono flex items-center gap-2">
              {owner}
              <a href={`https://testnet.bscscan.com/address${owner}`} className="text-primary hover:underline">
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="p-4 border rounded-md md:col-span-2">
            <div className="text-sm text-muted-foreground">Verification Document</div>
            <div className="font-mono flex items-center gap-2">
              {deedDocument}
              <a href={`https://gateway.pinata.cloud/ipfs/${deedDocument}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  From/To
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {transactionHistory.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{transaction.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge variant={transaction.action === "Listed" ? "outline" : "secondary"}>
                      {transaction.action}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">USD {transaction.price}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                    {transaction.action === "Listed" ? (
                      <span>{transaction.from?.substring(0, 8)}...</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">From:</span>
                          <span>{transaction.from?.substring(0, 8)}...</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">To:</span>
                          <span>{transaction.to?.substring(0, 8)}...</span>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
