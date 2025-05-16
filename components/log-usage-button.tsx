import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { SubstanceLogDialog } from "./substance-log-dialog"
import { InterventionLogDialog } from "./intervention-log-dialog"

export function LogUsageButton() {
  return (
    <div className="flex justify-center gap-3">
      <SubstanceLogDialog
        trigger={
          <Button className="bg-logButton text-black hover:bg-logButton/80">
            <PlusCircle className="h-4 w-4 mr-1" />
            Log Substance
          </Button>
        }
      />
      <InterventionLogDialog
        trigger={
          <Button variant="outline">
            <PlusCircle className="h-4 w-4 mr-1" />
            Log Intervention
          </Button>
        }
      />
    </div>
  )
}
