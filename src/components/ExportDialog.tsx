import { useState } from 'react'
import { Supplement, SupplementCombination } from '@/lib/types'
import { exportToCSV, exportToPDF, downloadFile, generateFilename, ExportOptions } from '@/lib/export-utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { FileArrowDown, FileCsv, FilePdf } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

interface ExportDialogProps {
  supplements: Supplement[]
  combinations: SupplementCombination[]
}

export function ExportDialog({ supplements, combinations }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [includeInsights, setIncludeInsights] = useState(true)
  const [includeLinks, setIncludeLinks] = useState(true)
  const [includeTrendData, setIncludeTrendData] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true)
    try {
      const options: ExportOptions = {
        includeInsights,
        includeLinks,
        includeTrendData,
      }

      if (format === 'csv') {
        const csvContent = exportToCSV(supplements, combinations, options)
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        downloadFile(blob, generateFilename('csv'))
        toast.success('CSV report downloaded successfully!')
      } else {
        const pdfBlob = await exportToPDF(supplements, combinations, options)
        downloadFile(pdfBlob, generateFilename('pdf'))
        toast.success('PDF report downloaded successfully!')
      }

      setOpen(false)
    } catch (error) {
      console.error('Export error:', error)
      toast.error(`Failed to export ${format.toUpperCase()} report`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <FileArrowDown className="w-5 h-5" />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Trend Report</DialogTitle>
          <DialogDescription>
            Choose your export format and customize what to include in the report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Report Contents</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insights"
                  checked={includeInsights}
                  onCheckedChange={(checked) => setIncludeInsights(checked as boolean)}
                />
                <Label
                  htmlFor="insights"
                  className="text-sm font-normal cursor-pointer"
                >
                  Include AI insights and analysis
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="links"
                  checked={includeLinks}
                  onCheckedChange={(checked) => setIncludeLinks(checked as boolean)}
                />
                <Label
                  htmlFor="links"
                  className="text-sm font-normal cursor-pointer"
                >
                  Include discussion links and sources
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trend-data"
                  checked={includeTrendData}
                  onCheckedChange={(checked) => setIncludeTrendData(checked as boolean)}
                />
                <Label
                  htmlFor="trend-data"
                  className="text-sm font-normal cursor-pointer"
                >
                  Include raw trend data (CSV only)
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Report Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Supplements</p>
                <p className="text-2xl font-bold text-primary">{supplements.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Stacks</p>
                <p className="text-2xl font-bold text-primary">{combinations.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Rising Trends</p>
                <p className="text-lg font-semibold text-green-600">
                  {supplements.filter(s => s.trendDirection === 'rising').length}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Total Items</p>
                <p className="text-lg font-semibold">
                  {supplements.length + combinations.length}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Export Format</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
              >
                <FileCsv className="w-8 h-8 text-green-600" weight="duotone" />
                <div className="text-center">
                  <div className="font-semibold">CSV</div>
                  <div className="text-xs text-muted-foreground">
                    Spreadsheet format
                  </div>
                </div>
              </Button>
              <Button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
              >
                <FilePdf className="w-8 h-8 text-red-600" weight="duotone" />
                <div className="text-center">
                  <div className="font-semibold">PDF</div>
                  <div className="text-xs text-muted-foreground">
                    Document format
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
